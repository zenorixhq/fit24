/**
 * FIT24 Master Exercise Library
 * Curated catalog of 70+ verified exercises spanning 10 physical disciplines.
 * Each movement specifies biomechanic target, equipment, recommended sets/reps,
 * rest intervals, tempo, and drillmaster coaching form cues.
 */

const MASTER_EXERCISE_CATEGORIES = [
  { id: "all", name: "All Disciplines", icon: "🔥" },
  { id: "chest", name: "Chest / Pecs", icon: "🛡️" },
  { id: "back", name: "Back / Lats", icon: "🦅" },
  { id: "legs", name: "Legs / Quads", icon: "🦵" },
  { id: "posterior", name: "Hamstrings & Glutes", icon: "⚡" },
  { id: "shoulders", name: "Shoulders / Delts", icon: "🏔️" },
  { id: "arms", name: "Arms (Bi & Tri)", icon: "💪" },
  { id: "core", name: "Core & Abs", icon: "🧱" },
  { id: "cardio", name: "Cardio & HIIT", icon: "🏃" },
  { id: "functional", name: "CrossFit & Functional", icon: "🥊" },
  { id: "mobility", name: "Mobility & Warmup", icon: "🧘" }
];

const MASTER_EXERCISE_LIBRARY = [
  // ==========================================
  // 1. CHEST / PECTORALS (7 Movements)
  // ==========================================
  {
    id: "ex-chest-001",
    name: "Barbell Flat Bench Press",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Mid/Lower Sternal Pectoralis & Anterior Deltoid",
    equipment: "Olympic Barbell & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "4x6-8",
    recommendedRestSec: 120,
    recommendedTempo: "3-1-1-0",
    formCues: "Plant feet flat. Retract scapulae firmly into the pad. Lower bar under control to sternum with a 1-sec pause; drive upward without flaring elbows past 75°."
  },
  {
    id: "ex-chest-002",
    name: "Incline Dumbbell Bench Press",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Clavicular Pectoralis (Upper Chest)",
    equipment: "Dumbbells & Incline Bench (30°)",
    difficulty: "Intermediate",
    recommendedSets: "4x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Angle bench to 30°. Keep elbows at 45° angle. Squeeze upper pecs at the top of the movement without banging weights together."
  },
  {
    id: "ex-chest-003",
    name: "Flat Dumbbell Flyes",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Sternal Pectoralis (Chest Stretch)",
    equipment: "Dumbbells & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x12",
    recommendedRestSec: 75,
    recommendedTempo: "3-1-1-0",
    formCues: "Maintain a slight bend in elbows throughout. Lower until deep stretch across chest is felt; squeeze pecs to return to starting position as if hugging a tree."
  },
  {
    id: "ex-chest-004",
    name: "Standing Cable Crossover Flyes",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Lower Pectoralis & Inner Chest Squeeze",
    equipment: "Dual Adjustable Cable Column",
    difficulty: "Beginner",
    recommendedSets: "3x15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Step forward with staggered stance. Bring hands together in an arc with a hard 1-sec peak contraction at full lockout."
  },
  {
    id: "ex-chest-005",
    name: "Weighted Chest Dips",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Lower Pectoralis, Anterior Deltoid, Triceps",
    equipment: "Parallel Dip Bars & Dip Belt",
    difficulty: "Advanced",
    recommendedSets: "3x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Lean torso forward 30° to bias pecs over triceps. Lower until elbows reach 90° flexion, then press upward explosively."
  },
  {
    id: "ex-chest-006",
    name: "Incline Hammer Strength Machine Press",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Upper Chest Isolator",
    equipment: "Plate-Loaded Incline Machine",
    difficulty: "Beginner",
    recommendedSets: "4x10",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-0",
    formCues: "Seat height adjusted so handles align with upper clavicle. Drive through heels and maintain tight upper back against seat pad."
  },
  {
    id: "ex-chest-007",
    name: "Deficit Push-Ups / Diamond Push-Ups",
    category: "chest",
    categoryLabel: "Chest / Pecs",
    targetMuscle: "Total Chest Endurance & Triceps",
    equipment: "Floor / Elevation Blocks",
    difficulty: "Beginner",
    recommendedSets: "3x Failure",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-0",
    formCues: "Maintain rigid plank line from heels to crown. For deficit, elevate hands on 10kg plates for increased stretch at the bottom."
  },

  // ==========================================
  // 2. BACK / LATS & TRAPS (8 Movements)
  // ==========================================
  {
    id: "ex-back-001",
    name: "Conventional Barbell Deadlift",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Erector Spinae, Latissimus, Hamstrings, Glutes",
    equipment: "Olympic Barbell & Calibrated Plates",
    difficulty: "Advanced",
    recommendedSets: "4x5",
    recommendedRestSec: 150,
    recommendedTempo: "2-1-1-0",
    formCues: "Bar over midfoot. Engage lats by flexing armpits. Drive the floor away through midfoot and lock out hips firmly without hyper-extending lumbar."
  },
  {
    id: "ex-back-002",
    name: "Barbell Bent-Over Row (Overhand)",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Latissimus Dorsi, Rhomboids, Mid Trapezius",
    equipment: "Olympic Barbell",
    difficulty: "Intermediate",
    recommendedSets: "4x8",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-1",
    formCues: "Hinge at hips to a 45° torso angle. Pull barbell toward belly button, driving elbows back and pinching shoulder blades at the top."
  },
  {
    id: "ex-back-003",
    name: "Wide-Grip Lat Pulldown",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Latissimus Dorsi (V-Taper Width)",
    equipment: "Cable Lat Pulldown Machine",
    difficulty: "Beginner",
    recommendedSets: "4x10-12",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-1",
    formCues: "Lean back slightly (10-15°). Pull bar down to upper clavicle by pulling elbows down and in. Avoid swinging torso."
  },
  {
    id: "ex-back-004",
    name: "Seated Cable Row (Neutral V-Grip)",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Mid-Back Thickness, Rhomboids, Lower Lats",
    equipment: "Low Cable Row Station",
    difficulty: "Beginner",
    recommendedSets: "4x10-12",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-1",
    formCues: "Maintain upright posture with chest puffed out. Pull handle to navel; fully stretch shoulder blades forward on eccentric phase."
  },
  {
    id: "ex-back-005",
    name: "Weighted Pull-Ups / Neutral Pull-Ups",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Latissimus Dorsi, Biceps, Core",
    equipment: "Pull-Up Bar & Weight Belt",
    difficulty: "Advanced",
    recommendedSets: "3x6-8",
    recommendedRestSec: 120,
    recommendedTempo: "3-0-1-0",
    formCues: "Full dead-hang at bottom. Initiate pull by depressing scapulae; pull chest up to the bar without kipping legs."
  },
  {
    id: "ex-back-006",
    name: "T-Bar Row (Chest-Supported or Free)",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Middle Traps, Rhomboids, Latissimus",
    equipment: "T-Bar Station / Landmine",
    difficulty: "Intermediate",
    recommendedSets: "4x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-1",
    formCues: "Brace core firmly. Pull handles toward lower chest and squeeze upper back hard at the peak of each repetition."
  },
  {
    id: "ex-back-007",
    name: "Rope Face Pulls",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Rear Deltoids, Rotator Cuff, Upper Traps",
    equipment: "High Cable & Rope Attachment",
    difficulty: "Beginner",
    recommendedSets: "3x15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Set cable at eye level. Pull rope attachment toward bridge of nose while externally rotating hands back like a double bicep pose."
  },
  {
    id: "ex-back-008",
    name: "Straight-Arm Cable Pulldown",
    category: "back",
    categoryLabel: "Back / Lats",
    targetMuscle: "Isolated Lat Sweep & Teres Major",
    equipment: "High Cable & Straight Bar / Rope",
    difficulty: "Beginner",
    recommendedSets: "3x12-15",
    recommendedRestSec: 60,
    recommendedTempo: "2-1-1-0",
    formCues: "Slight hip hinge. Keep elbows nearly straight. Sweep bar down in an arc until hands touch upper thighs, flexing lats hard."
  },

  // ==========================================
  // 3. LEGS / QUADS & CALVES (7 Movements)
  // ==========================================
  {
    id: "ex-legs-001",
    name: "Barbell Back Squat (High Bar)",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Quadriceps, Glutes, Core Bracing",
    equipment: "Squat Rack & Olympic Barbell",
    difficulty: "Advanced",
    recommendedSets: "4x6-8",
    recommendedRestSec: 150,
    recommendedTempo: "3-1-1-0",
    formCues: "Bar on upper traps. Deep diaphragmatic breath and brace. Squat down until hip crease breaks parallel; drive up through midfoot."
  },
  {
    id: "ex-legs-002",
    name: "Barbell Front Squat",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Quadriceps Anterior Focus & Thoracic Spine",
    equipment: "Squat Rack & Olympic Barbell",
    difficulty: "Advanced",
    recommendedSets: "4x6",
    recommendedRestSec: 120,
    recommendedTempo: "3-1-1-0",
    formCues: "Clean rack grip with high elbows. Keep torso completely upright throughout the descent. Drive knees forward over toes."
  },
  {
    id: "ex-legs-003",
    name: "45° Incline Leg Press",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Quad Hypertrophy & Glutes",
    equipment: "45° Plate-Loaded Leg Press",
    difficulty: "Beginner",
    recommendedSets: "4x10-12",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Feet shoulder-width on middle of platform. Lower platform deeply without letting lower back round off the pad. Don't lock knees at the top."
  },
  {
    id: "ex-legs-004",
    name: "Bulgarian Split Squat (Dumbbell)",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Single-Leg Quad, Gluteus Medius, Balance",
    equipment: "Dumbbells & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x10 / leg",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Back foot elevated on bench. Lower straight down until back knee hovers 1 inch above floor; drive through front heel."
  },
  {
    id: "ex-legs-005",
    name: "Leg Extensions (Quad Isolator)",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Rectus Femoris & Vastus Lateralis",
    equipment: "Leg Extension Machine",
    difficulty: "Beginner",
    recommendedSets: "3x15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Align knee joint with machine pivot axis. Extend legs fully with a 1-sec peak squeeze at top; lower slowly under tension."
  },
  {
    id: "ex-legs-006",
    name: "Hack Squat Machine",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Isolated Quad Sweep (Deep Knee Flexion)",
    equipment: "Hack Squat Machine",
    difficulty: "Intermediate",
    recommendedSets: "4x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-1-1-0",
    formCues: "Feet lower on platform for maximal quad load. Squat deeply into the machine; explode up smoothly without bouncing at bottom."
  },
  {
    id: "ex-legs-007",
    name: "Standing Calf Raises",
    category: "legs",
    categoryLabel: "Legs / Quads",
    targetMuscle: "Gastrocnemius & Soleus",
    equipment: "Standing Calf Machine / Smith Machine",
    difficulty: "Beginner",
    recommendedSets: "4x15-20",
    recommendedRestSec: 60,
    recommendedTempo: "2-2-1-1",
    formCues: "Balls of feet on edge. Lower for a full 2-sec stretch at bottom; push onto big toes for maximum contraction at the top."
  },

  // ==========================================
  // 4. HAMSTRINGS & GLUTES (7 Movements)
  // ==========================================
  {
    id: "ex-post-001",
    name: "Romanian Deadlift (Barbell RDL)",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Hamstrings (Semitendinosus/Biceps Femoris) & Glutes",
    equipment: "Olympic Barbell",
    difficulty: "Intermediate",
    recommendedSets: "4x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-1-1-0",
    formCues: "Slight soft bend in knees. Push hips back as if trying to touch the wall behind you. Lower bar to shin level until hamstrings are taut; snap hips forward."
  },
  {
    id: "ex-post-002",
    name: "Barbell Hip Thrusts",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Gluteus Maximus Peak Hypertrophy",
    equipment: "Barbell, Pad & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "4x10-12",
    recommendedRestSec: 90,
    recommendedTempo: "2-0-1-2",
    formCues: "Upper back rested across bench. Bar centered across hips with thick pad. Drive through heels to full horizontal extension with a 2-sec glute squeeze."
  },
  {
    id: "ex-post-003",
    name: "Lying Leg Curls (Hamstring Curl)",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Hamstrings Knee Flexion",
    equipment: "Lying Leg Curl Machine",
    difficulty: "Beginner",
    recommendedSets: "3x12",
    recommendedRestSec: 60,
    recommendedTempo: "3-0-1-1",
    formCues: "Keep hips pressed flat into bench. Curl pad toward glutes; resist the weight on the way down without letting stack drop."
  },
  {
    id: "ex-post-004",
    name: "Seated Hamstring Curls",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Hamstrings in Stretched Hip Flexion",
    equipment: "Seated Leg Curl Machine",
    difficulty: "Beginner",
    recommendedSets: "3x12-15",
    recommendedRestSec: 60,
    recommendedTempo: "3-0-1-1",
    formCues: "Lock thigh pad down tight. Curl legs down and under seat with a deliberate contraction; control eccentric return."
  },
  {
    id: "ex-post-005",
    name: "Walking Dumbbell Lunges",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Glutes, Hamstrings, Quadriceps",
    equipment: "Pair of Dumbbells",
    difficulty: "Intermediate",
    recommendedSets: "3x20 paces (10/leg)",
    recommendedRestSec: 90,
    recommendedTempo: "2-0-1-0",
    formCues: "Take long strides to target glutes and hamstrings. Lower back knee to brush floor; drive up and immediately into next stride."
  },
  {
    id: "ex-post-006",
    name: "Cable Glute Kickbacks",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Gluteus Maximus & Medius Isolator",
    equipment: "Low Cable & Ankle Strap",
    difficulty: "Beginner",
    recommendedSets: "3x15 / leg",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Brace on machine pillar with torso slightly angled. Kick leg back in a 45° angle, squeezing glute at top without arching lower back."
  },
  {
    id: "ex-post-007",
    name: "Sumo Deadlift (Barbell / Kettlebell)",
    category: "posterior",
    categoryLabel: "Hamstrings & Glutes",
    targetMuscle: "Adductors, Glutes, Hamstrings, Erector Spinae",
    equipment: "Olympic Barbell / Heavy Kettlebell",
    difficulty: "Advanced",
    recommendedSets: "4x6",
    recommendedRestSec: 120,
    recommendedTempo: "2-1-1-0",
    formCues: "Wide stance with toes pointed out 45°. Arms inside knees. Keep chest tall, open knees wide, drive through heels."
  },

  // ==========================================
  // 5. SHOULDERS / DELTOIDS (7 Movements)
  // ==========================================
  {
    id: "ex-shld-001",
    name: "Overhead Barbell Press (Military Press)",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Anterior Deltoids, Lateral Deltoids, Triceps",
    equipment: "Olympic Barbell",
    difficulty: "Advanced",
    recommendedSets: "4x6",
    recommendedRestSec: 120,
    recommendedTempo: "3-0-1-0",
    formCues: "Grip just outside shoulder width. Squeeze glutes and abs to prevent lower back arch. Press bar vertically in a straight path, moving head back to clear chin."
  },
  {
    id: "ex-shld-002",
    name: "Seated Dumbbell Shoulder Press",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Anterior & Lateral Deltoids",
    equipment: "Dumbbells & 80° Bench",
    difficulty: "Intermediate",
    recommendedSets: "4x8-10",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Elbows angled slightly forward (not fully flared). Press weights up until arms are fully extended overhead without clanking dumbbells."
  },
  {
    id: "ex-shld-003",
    name: "Dumbbell Lateral Raises (Side Delts)",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Lateral Deltoid (Shoulder Cap Width)",
    equipment: "Pair of Dumbbells",
    difficulty: "Beginner",
    recommendedSets: "4x12-15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Slight forward torso lean. Raise dumbbells out to sides leading with elbows until parallel with floor. Avoid shrugging traps."
  },
  {
    id: "ex-shld-004",
    name: "Cable Lateral Raises (Single-Arm)",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Lateral Deltoid with Continuous Cable Tension",
    equipment: "Low Cable & Single D-Handle",
    difficulty: "Intermediate",
    recommendedSets: "3x12-15 / arm",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Cable behind back or across front. Pull handle up and out in the scapular plane with constant tension throughout range."
  },
  {
    id: "ex-shld-005",
    name: "Arnold Dumbbell Press",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Anterior, Lateral & Rotational Deltoid",
    equipment: "Pair of Dumbbells & Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x10",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-0",
    formCues: "Start with palms facing chest in bicep curl position. Rotate palms outward as you press overhead; reverse motion smoothly on descent."
  },
  {
    id: "ex-shld-006",
    name: "Bent-Over Dumbbell Rear Delt Flyes",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Posterior Deltoid & Infraspinatus",
    equipment: "Pair of Light Dumbbells",
    difficulty: "Beginner",
    recommendedSets: "3x15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Hinge at hips until torso is parallel with floor. Fly dumbbells out to sides with pinkies angled slightly higher than thumbs."
  },
  {
    id: "ex-shld-007",
    name: "Cable Upright Rows (EZ Attachment)",
    category: "shoulders",
    categoryLabel: "Shoulders / Delts",
    targetMuscle: "Lateral Delts & Upper Trapezius",
    equipment: "Low Cable & EZ Bar Attachment",
    difficulty: "Intermediate",
    recommendedSets: "3x12",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Grip shoulder-width apart. Pull bar up along torso leading with elbows until elbows reach shoulder height. Control descent."
  },

  // ==========================================
  // 6. ARMS / BICEPS & TRICEPS (8 Movements)
  // ==========================================
  {
    id: "ex-arm-001",
    name: "Standing Barbell Bicep Curl",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Biceps Brachii (Short & Long Heads)",
    equipment: "Olympic or EZ-Curl Barbell",
    difficulty: "Beginner",
    recommendedSets: "4x8-10",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-0",
    formCues: "Pin elbows at sides. Curl bar up towards shoulders without swinging hips; lower fully under strict 3-sec control."
  },
  {
    id: "ex-arm-002",
    name: "Incline Dumbbell Hammer Curls",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Brachialis & Forearm Brachioradialis",
    equipment: "Dumbbells & 45° Incline Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x10-12",
    recommendedRestSec: 60,
    recommendedTempo: "3-0-1-0",
    formCues: "Palms facing inward throughout (neutral grip). Full bicep stretch at bottom due to incline; curl powerfully to shoulder height."
  },
  {
    id: "ex-arm-003",
    name: "EZ-Bar Preacher Curls",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Bicep Peak & Short Head Isolation",
    equipment: "Preacher Bench & EZ-Bar",
    difficulty: "Intermediate",
    recommendedSets: "3x10",
    recommendedRestSec: 60,
    recommendedTempo: "3-0-1-1",
    formCues: "Armpits snug against top of preacher pad. Curl up until forearms are vertical; don't lift elbows off the pad."
  },
  {
    id: "ex-arm-004",
    name: "Cable Bicep Curls (21s Protocol)",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Total Bicep Pump & Bloodflow",
    equipment: "Low Cable & Straight Bar",
    difficulty: "Intermediate",
    recommendedSets: "3 sets of 21 (7 bottom + 7 top + 7 full)",
    recommendedRestSec: 90,
    recommendedTempo: "2-0-1-0",
    formCues: "7 reps from bottom to halfway, 7 reps from halfway to top, 7 full reps without rest between phases."
  },
  {
    id: "ex-arm-005",
    name: "Cable Tricep Rope Pushdowns",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Triceps Lateral & Medial Heads",
    equipment: "High Cable & Rope Attachment",
    difficulty: "Beginner",
    recommendedSets: "4x12-15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Elbows locked at ribs. Push rope down and flare rope ends apart at full lockout with a 1-sec squeeze."
  },
  {
    id: "ex-arm-006",
    name: "Barbell Skull Crushers (Lying Tricep Ext)",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Triceps Long Head",
    equipment: "EZ-Bar & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x10",
    recommendedRestSec: 75,
    recommendedTempo: "3-0-1-0",
    formCues: "Arms angled back 10° toward head. Lower bar toward crown of skull by bending only at elbows; press back up to starting angle."
  },
  {
    id: "ex-arm-007",
    name: "Overhead Dumbbell Tricep Extension",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Triceps Long Head in Stretched Position",
    equipment: "Single Heavy Dumbbell & Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x12",
    recommendedRestSec: 60,
    recommendedTempo: "3-0-1-0",
    formCues: "Cup dumbbell head with both hands. Lower behind neck until forearms contact biceps; press straight overhead."
  },
  {
    id: "ex-arm-008",
    name: "Close-Grip Barbell Bench Press",
    category: "arms",
    categoryLabel: "Arms (Bi & Tri)",
    targetMuscle: "Triceps Mass & Lockout Strength",
    equipment: "Olympic Barbell & Flat Bench",
    difficulty: "Intermediate",
    recommendedSets: "3x8",
    recommendedRestSec: 90,
    recommendedTempo: "3-0-1-0",
    formCues: "Hands shoulder-width apart (not touching). Keep elbows tucked close to sides; press up smoothly through triceps."
  },

  // ==========================================
  // 7. CORE & ABS (7 Movements)
  // ==========================================
  {
    id: "ex-core-001",
    name: "Hanging Leg Raises (Toes-to-Bar)",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Lower Rectus Abdominis & Hip Flexors",
    equipment: "Pull-Up Bar / Captain's Chair",
    difficulty: "Intermediate",
    recommendedSets: "3x12-15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Dead hang without swinging. Curl pelvis upward as legs raise until toes reach bar level; lower slowly under control."
  },
  {
    id: "ex-core-002",
    name: "Cable Woodchops (High-to-Low)",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Internal & External Obliques, Rotational Power",
    equipment: "High Cable & D-Handle",
    difficulty: "Intermediate",
    recommendedSets: "3x12 / side",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-0",
    formCues: "Rotate torso diagonally down across body using core muscles, not arms. Pivot back foot as you complete the chop."
  },
  {
    id: "ex-core-003",
    name: "Ab Wheel Rollouts",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Anti-Extension Core Bracing & Lat Engagement",
    equipment: "Ab Roller Wheel & Knee Mat",
    difficulty: "Advanced",
    recommendedSets: "3x8-10",
    recommendedRestSec: 60,
    recommendedTempo: "3-1-1-0",
    formCues: "Tuck pelvis into posterior tilt. Roll wheel forward until chest hovers just above ground; pull back using abs without dipping lower back."
  },
  {
    id: "ex-core-004",
    name: "Weighted Plank Hold",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Transverse Abdominis Isometric Endurance",
    equipment: "Weight Plate (10kg-20kg) on back",
    difficulty: "Intermediate",
    recommendedSets: "3x 45-60 seconds",
    recommendedRestSec: 60,
    recommendedTempo: "Isometric",
    formCues: "Forearms on ground. Squeeze glutes, quads, and abs maximally. Do not let lumbar spine sag."
  },
  {
    id: "ex-core-005",
    name: "Russian Twists (Medicine Ball)",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Obliques & Rotational Core",
    equipment: "5kg-10kg Medicine Ball",
    difficulty: "Beginner",
    recommendedSets: "3x20 taps (10/side)",
    recommendedRestSec: 45,
    recommendedTempo: "1-0-1-0",
    formCues: "Torso at 45° angle with feet elevated. Rotate shoulders side-to-side, tapping ball gently on ground on each side."
  },
  {
    id: "ex-core-006",
    name: "Decline Weighted Crunches",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Upper Rectus Abdominis",
    equipment: "Decline Sit-Up Bench & Plate",
    difficulty: "Intermediate",
    recommendedSets: "3x15",
    recommendedRestSec: 60,
    recommendedTempo: "2-0-1-1",
    formCues: "Hold plate across chest or behind head. Curl torso up by contracting abs; stop before sitting upright to keep constant abdominal tension."
  },
  {
    id: "ex-core-007",
    name: "Dead Bug / Hollow Body Hold",
    category: "core",
    categoryLabel: "Core & Abs",
    targetMuscle: "Deep Core Stabilizers & Pelvic Floor",
    equipment: "Bodyweight & Mat",
    difficulty: "Beginner",
    recommendedSets: "3x12 reps or 40s hold",
    recommendedRestSec: 45,
    recommendedTempo: "2-1-2-0",
    formCues: "Press lower back flat into floor with zero gap. Extend opposite arm and leg simultaneously while maintaining grounded lower back."
  },

  // ==========================================
  // 8. CARDIO & HIIT (7 Movements)
  // ==========================================
  {
    id: "ex-card-001",
    name: "Incline Treadmill Ruck / Power Walk",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Aerobic Base, Calves, Hamstrings, Fat Oxidation",
    equipment: "Commercial Incline Treadmill (12% Incline, 5.0 km/h)",
    difficulty: "Beginner",
    recommendedSets: "20-30 Mins Steady State",
    recommendedRestSec: 0,
    recommendedTempo: "Continuous",
    formCues: "Do not hold on to the side handles. Pump arms naturally, push through heels, and maintain upright spine."
  },
  {
    id: "ex-card-002",
    name: "Concept2 Rower 500m Sprints",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Full Body Posterior & Cardiovascular Capacity",
    equipment: "Concept2 Ergometer Rower",
    difficulty: "Intermediate",
    recommendedSets: "5x 500m (Rest 90s between intervals)",
    recommendedRestSec: 90,
    recommendedTempo: "Max Effort Sprint",
    formCues: "Legs drive first, then hip swing, then arms pull. Reverse smoothly: arms, hips, then knees bend."
  },
  {
    id: "ex-card-003",
    name: "Assault AirBike Max Calorie Sprints",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Anaerobic Lactic Capacity & Total Body Burn",
    equipment: "Assault AirBike Fan Bike",
    difficulty: "Advanced",
    recommendedSets: "8 rounds x 20s Max Sprint / 40s Rest",
    recommendedRestSec: 40,
    recommendedTempo: "Tabata / HIIT",
    formCues: "Drive handles aggressively with arms while pumping legs. Maintain cadence above 70 RPM during work intervals."
  },
  {
    id: "ex-card-004",
    name: "Jump Rope Double-Unders / Boxer Shuffle",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Calves, Footwork, Conditioning & Coordination",
    equipment: "Speed Jump Rope",
    difficulty: "Intermediate",
    recommendedSets: "5 rounds x 2 Mins",
    recommendedRestSec: 60,
    recommendedTempo: "Continuous",
    formCues: "Spin rope from wrists, not shoulders. Stay on the balls of your feet with small, efficient hops."
  },
  {
    id: "ex-card-005",
    name: "Stairmaster Fat-Burn Intervals",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Glutes, Quads & Cardiovascular Endurance",
    equipment: "Stairmaster Revolving Stairs",
    difficulty: "Intermediate",
    recommendedSets: "20 Mins (Level 8-10)",
    recommendedRestSec: 0,
    recommendedTempo: "Continuous",
    formCues: "Take full steps on whole foot to recruit glutes. Stand tall without slouching over front console."
  },
  {
    id: "ex-card-006",
    name: "400m Track / Treadmill Interval Sprints",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "VO2 Max & Fast-Twitch Muscle Fibers",
    equipment: "Running Track or Sprint Treadmill",
    difficulty: "Intermediate",
    recommendedSets: "4-6 rounds x 400m (Rest 2 Mins)",
    recommendedRestSec: 120,
    recommendedTempo: "85-90% Max Pace",
    formCues: "Run tall, strike with midfoot, drive knees forward and maintain relaxed shoulders."
  },
  {
    id: "ex-card-007",
    name: "Heavy Bag Boxing Rounds (COMBAT ZONE)",
    category: "cardio",
    categoryLabel: "Cardio & HIIT",
    targetMuscle: "Shoulders, Core, Rotational Power & Aerobic",
    equipment: "FIT24 Boxing Heavy Bag & Wraps/Gloves",
    difficulty: "Intermediate",
    recommendedSets: "4 rounds x 3 Mins (1 Min Rest)",
    recommendedRestSec: 60,
    recommendedTempo: "Boxing Rounds",
    formCues: "Jab-cross-hook combinations. Stay light on toes; exhale sharply with every punch."
  },

  // ==========================================
  // 9. FUNCTIONAL & CROSSFIT (7 Movements)
  // ==========================================
  {
    id: "ex-func-001",
    name: "Russian Kettlebell Swings",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Hip Hinge Power, Glutes, Hamstrings, Grip",
    equipment: "24kg-32kg Competition Kettlebell",
    difficulty: "Intermediate",
    recommendedSets: "4x15-20",
    recommendedRestSec: 60,
    recommendedTempo: "Explosive Hinge",
    formCues: "This is a hip snap, not a squat! Hinge at hips with bell high in groin; snap hips to float bell to chest height."
  },
  {
    id: "ex-func-002",
    name: "Barbell Clean and Press",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Full Body Triple Extension & Overhead Power",
    equipment: "Olympic Barbell & Bumper Plates",
    difficulty: "Advanced",
    recommendedSets: "5x3-5",
    recommendedRestSec: 120,
    recommendedTempo: "Dynamic",
    formCues: "Pull bar aggressively off floor, catch in front rack position with fast elbows, then drive vertically overhead."
  },
  {
    id: "ex-func-003",
    name: "Plyometric Box Jumps",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Explosive Leg Power & Rate of Force Development",
    equipment: "24-inch or 30-inch Plyo Box",
    difficulty: "Intermediate",
    recommendedSets: "4x6-8",
    recommendedRestSec: 75,
    recommendedTempo: "Explosive",
    formCues: "Swing arms back, explode upward, land softly on box in a quarter-squat with knees tracking toes. Step down carefully."
  },
  {
    id: "ex-func-004",
    name: "Heavy Farmer's Walks / Carry",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Grip Strength, Trapezius, Core Stabilizers",
    equipment: "Trap Bar / Heavy Dumbbells / Farmer Handles",
    difficulty: "Intermediate",
    recommendedSets: "4x 40m walks",
    recommendedRestSec: 90,
    recommendedTempo: "Brisk Pace",
    formCues: "Deadlift weight up. Walk with upright posture and short, deliberate steps without swaying side-to-side."
  },
  {
    id: "ex-func-005",
    name: "Turf Sled / Prowler Push",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Quads, Calves, Glutes, Conditioning",
    equipment: "Heavy Turf Sled on Astro-Turf",
    difficulty: "Intermediate",
    recommendedSets: "4x 25m turf lengths",
    recommendedRestSec: 90,
    recommendedTempo: "Max Drive",
    formCues: "Hands on upright poles, arms straight. Lean into sled at 45° angle; drive legs through turf with high knees."
  },
  {
    id: "ex-func-006",
    name: "Wall Ball Shots",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Quads, Shoulders, Cardiovascular Engine",
    equipment: "9kg Medicine Ball & 10ft Target Wall",
    difficulty: "Intermediate",
    recommendedSets: "3x15-20",
    recommendedRestSec: 60,
    recommendedTempo: "Fluid Rhythm",
    formCues: "Full squat holding ball at chest. Drive up explosively and throw ball to 10-foot mark; catch on descent into next squat."
  },
  {
    id: "ex-func-007",
    name: "Barbell Snatch (Power Snatch)",
    category: "functional",
    categoryLabel: "CrossFit & Functional",
    targetMuscle: "Total Body Explosiveness & Overhead Balance",
    equipment: "Olympic Barbell & Bumper Plates",
    difficulty: "Advanced",
    recommendedSets: "4x3",
    recommendedRestSec: 120,
    recommendedTempo: "Max Speed",
    formCues: "Wide snatch grip. Extend hips and knees violently, shrug bar upwards and catch in a partial overhead squat with locked elbows."
  },

  // ==========================================
  // 10. MOBILITY & WARMUP (7 Movements)
  // ==========================================
  {
    id: "ex-mob-001",
    name: "World's Greatest Stretch",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Hip Flexors, Thoracic Spine, Hamstrings",
    equipment: "Bodyweight & Mat",
    difficulty: "Beginner",
    recommendedSets: "2x6 / side",
    recommendedRestSec: 30,
    recommendedTempo: "Controlled 3-sec Hold",
    formCues: "Deep lunge with front foot outside hand. Lower elbow to inside of ankle, then rotate torso and reach hand to ceiling."
  },
  {
    id: "ex-mob-002",
    name: "90/90 Hip Openers & Rotations",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Internal & External Hip Rotators",
    equipment: "Floor Mat",
    difficulty: "Beginner",
    recommendedSets: "2x8 / side",
    recommendedRestSec: 30,
    recommendedTempo: "Slow & Mindful",
    formCues: "Sit on floor with both legs bent at 90° angles. Rotate knees from side to side keeping chest tall and heels anchored."
  },
  {
    id: "ex-mob-003",
    name: "Banded Shoulder Dislocations & Pass-Throughs",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Shoulder Capsule & Pec Minor Mobilization",
    equipment: "PVC Pipe or Resistance Band",
    difficulty: "Beginner",
    recommendedSets: "2x10 passes",
    recommendedRestSec: 30,
    recommendedTempo: "Smooth Arc",
    formCues: "Wide grip on band. Move arms from front of thighs in an arc overhead and behind back without bending elbows."
  },
  {
    id: "ex-mob-004",
    name: "Cat-Camel & Quadruped Thoracic Extensions",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Spine Segmentation & Thoracic Mobility",
    equipment: "Floor Mat",
    difficulty: "Beginner",
    recommendedSets: "2x10 cycles",
    recommendedRestSec: 30,
    recommendedTempo: "Slow Flow",
    formCues: "On hands and knees. Inhale, drop belly, look up (Camel); exhale, round upper back toward ceiling, tuck chin (Cat)."
  },
  {
    id: "ex-mob-005",
    name: "Deep Goblet Squat Pry & Ankle Hold",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Hip Adductors, Ankle Dorsiflexion, Groin",
    equipment: "Light Kettlebell or Dumbbell (8kg-12kg)",
    difficulty: "Beginner",
    recommendedSets: "2x 45-sec hold",
    recommendedRestSec: 45,
    recommendedTempo: "Isometric Pry",
    formCues: "Sit into deepest squat. Use elbows to gently pry knees outward while keeping chest proud and feet completely flat on floor."
  },
  {
    id: "ex-mob-006",
    name: "Foam Roller Thoracic Spine Extension",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Thoracic Spine Mobilization & Posture",
    equipment: "High-Density Foam Roller",
    difficulty: "Beginner",
    recommendedSets: "2x10 extensions",
    recommendedRestSec: 30,
    recommendedTempo: "Controlled Breath",
    formCues: "Support head with hands. Roller under mid-back; arch backward over roller while keeping hips on floor, exhaling deeply."
  },
  {
    id: "ex-mob-007",
    name: "Banded Ankle Dorsiflexion Mobilization",
    category: "mobility",
    categoryLabel: "Mobility & Warmup",
    targetMuscle: "Talocrural Joint & Achilles Tendon Mobility",
    equipment: "Heavy Resistance Band anchored low",
    difficulty: "Beginner",
    recommendedSets: "2x15 drives / ankle",
    recommendedRestSec: 30,
    recommendedTempo: "Pulse 2s",
    formCues: "Band anchored behind and wrapped around front of ankle joint. Drive knee forward past toes while keeping heel pinned flat."
  }
];

// Helper query utilities
function getMasterExerciseCategories() {
  return MASTER_EXERCISE_CATEGORIES;
}

function getMasterExerciseLibrary(category = "all", searchTerm = "") {
  return MASTER_EXERCISE_LIBRARY.filter(ex => {
    const matchesCategory = (!category || category === "all" || ex.category.toLowerCase() === category.toLowerCase());
    const query = (searchTerm || "").toLowerCase().trim();
    const matchesQuery = !query || 
      ex.name.toLowerCase().includes(query) ||
      ex.targetMuscle.toLowerCase().includes(query) ||
      ex.equipment.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

function getExerciseById(id) {
  return MASTER_EXERCISE_LIBRARY.find(ex => ex.id === id) || null;
}

// Make accessible on window object
if (typeof window !== "undefined") {
  window.MASTER_EXERCISE_CATEGORIES = MASTER_EXERCISE_CATEGORIES;
  window.MASTER_EXERCISE_LIBRARY = MASTER_EXERCISE_LIBRARY;
  window.getMasterExerciseCategories = getMasterExerciseCategories;
  window.getMasterExerciseLibrary = getMasterExerciseLibrary;
  window.getExerciseById = getExerciseById;
}
