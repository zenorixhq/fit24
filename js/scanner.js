// FIT24 Scanner & Hardware Access Controller
// Handles USB Laser Barcode/QR Scanners, WebRTC Camera Stream, and Audio Chimes

class Fit24ScannerController {
  constructor() {
    this.keyBuffer = "";
    this.lastKeyTime = 0;
    this.audioCtx = null;
    this.videoStream = null;
    this.isCameraActive = false;
    this.initHardwareListener();
  }

  // Audio Chime Synthesizer via Web Audio API (Zero external MP3 dependencies)
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
  }

  playSuccessBeep() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // High A
      osc.frequency.exponentialRampToValueAtTime(1760, this.audioCtx.currentTime + 0.15); // Ramp up
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  playWarningBeep() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime); // Low buzz
      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  // 1. USB Laser / Handheld Barcode Scanner Auto-Listener
  // Standard handheld scanners type out the scanned string in under 30-50ms and press 'Enter'.
  initHardwareListener() {
    document.addEventListener("keydown", (e) => {
      // Ignore if user is intentionally typing into a form input or textarea
      const targetTag = (e.target.tagName || "").toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || targetTag === "select") {
        return;
      }

      const now = Date.now();
      if (now - this.lastKeyTime > 120) {
        this.keyBuffer = ""; // Reset if typing speed is human/slow
      }
      this.lastKeyTime = now;

      if (e.key === "Enter") {
        if (this.keyBuffer.length >= 4) {
          const scannedCode = this.keyBuffer.trim();
          this.keyBuffer = "";
          this.handleScannedCode(scannedCode);
        }
      } else if (e.key.length === 1) {
        this.keyBuffer += e.key;
      }
    });
  }

  handleScannedCode(code) {
    console.log("📷 Hardware Barcode Scanned:", code);
    if (typeof window.executeScanCheckIn === "function") {
      window.executeScanCheckIn(code);
    }
  }

  // 2. WebRTC Camera Stream Scanner for iPads / Laptops / Tablets
  async startCamera(videoElementId, onDetected) {
    const video = document.getElementById(videoElementId);
    if (!video) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      this.videoStream = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      await video.play();
      this.isCameraActive = true;

      // Use native BarcodeDetector API if available in browser
      if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
        const scanFrame = async () => {
          if (!this.isCameraActive) return;
          try {
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0) {
              const detectedVal = barcodes[0].rawValue;
              this.playSuccessBeep();
              onDetected(detectedVal);
              return;
            }
          } catch (err) {}
          requestAnimationFrame(scanFrame);
        };
        scanFrame();
      }
    } catch (err) {
      console.warn("Camera access not available or denied:", err);
      alert("Camera access was not granted or not supported on this device. You can type member ID or use a USB scanner!");
    }
  }

  stopCamera() {
    this.isCameraActive = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
  }
}

window.fit24Scanner = new Fit24ScannerController();
