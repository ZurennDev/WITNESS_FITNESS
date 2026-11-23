/* Witness Fitness: gradual progression + 12 new exercises. Load AFTER the main script. */
X.push(
["sumo","Sumo Squat",3,"12 reps",0,2,"Full Body","M","knee hip","Quads, inner thighs, glutes","Stand with feet wider than your shoulders and toes turned out. Lower your hips straight down, keeping your knees over your toes. Press through your heels to stand."],
["jsquat","Jump Squats",3,"10 reps",0,2,"Cardio","H","knee ankle hip back heart asthma pregnant","Quads, glutes, calves","Squat down with your chest up. Jump up and swing your arms. Land softly with bent knees and go straight into the next squat."],
["gobsq","Goblet Squat",3,"10 reps",2,2,"Strength","M","knee hip back","Quads, glutes, core","Hold one dumbbell at your chest with both hands. Lower into a squat with your chest tall. Stand by driving through your heels."],
["mtclimb","Mountain Climbers",3,"30 sec",2,2,"Cardio","H","shoulder neck back heart asthma pregnant","Core, shoulders, legs","Start in a high plank with hands under your shoulders. Drive one knee toward your chest, then switch legs quickly. Keep your hips low and your core tight."],
["stepup","Step-ups",3,"10 reps per leg",0,2,"Full Body","M","knee ankle hip","Quads, glutes","Face a sturdy step or the bottom stair. Step up with one foot, bring the other up, then step down slowly. Switch the leading leg each set."],
["revlunge","Reverse Lunges",3,"10 reps per leg",0,2,"Strength","M","knee hip ankle","Glutes, quads","Step one foot back and lower until both knees are about 90 degrees. Push through the front heel to return. Switch legs."],
["hammer","Hammer Curl",3,"12 reps per arm",1,0,"Strength","L","","Biceps, forearms","Hold the dumbbell with your palm facing in. Keep your elbow at your side. Curl up, pause, and lower slowly."],
["kpush","Knee Push-ups",3,"10 reps",2,0,"Home","L","shoulder neck pregnant","Chest, shoulders, triceps","Kneel with hands under your shoulders and a straight line from knees to head. Lower your chest toward the floor, then press back up."],
["slbridge","Single-Leg Glute Bridge",3,"10 reps per leg",0,2,"Home","M","hip back","Glutes, hamstrings","Lie on your back with one foot flat and the other leg lifted. Push through the flat heel to raise your hips. Lower slowly, then switch legs."],
["lungestr","Kneeling Hip Flexor Stretch",2,"45 sec per side",0,2,"Stretching","L","knee","Hip flexors, quads","Kneel on one knee with the other foot forward. Tuck your pelvis and shift forward until you feel a stretch at the front of your hip. Keep your chest tall."],
["calfstr","Wall Calf Stretch",2,"40 sec per leg",1,2,"Stretching","L","ankle","Calves","Face a wall with your hands on it. Step one foot back with the heel down. Bend the front knee until you feel the stretch in the back calf. Switch legs."],
["reach","Seated Overhead Reach",3,"10 reps",1,0,"Seated","L","shoulder neck","Shoulders, upper back","Sit tall. Reach your arm or arms up toward the ceiling, then lower slowly. Keep your ribs down and your shoulders relaxed."]
);
/* reuse the closest animated figure */
(function(){const f0=window.fig,AL={sumo:"squat",jsquat:"burpee",gobsq:"squat",mtclimb:"plank",stepup:"lunge",revlunge:"lunge",hammer:"curl",kpush:"pushup",slbridge:"bridge",lungestr:"lunge",calfstr:"wallpush",reach:"press"};if(f0)window.fig=(id,n)=>f0(AL[id]||id,n)})();
/* progression: more training days in the last 3 weeks = slightly higher reps and holds */
function progStep(){if(!S||!S.logs)return 0;const a=[];for(let i=0;i<21;i++)a.push(day(i));const d=new Set(S.logs.filter(l=>a.includes(l.day)).map(l=>l.day)).size,s=d>=15?2:d>=9?1:0,c=P().conds||[],g=ageNow(),lim=(g!==null&&(g>=65||g<18))||c.some(x=>["heart","pregnant","asthma"].includes(x));return Math.min(s,lim?1:2)}
function scaleAmt(a){const s=progStep();if(!s||/fast|walk/.test(a))return a;const m=/^(\d+)( reps| sec| min)/.exec(a);if(!m)return a;const n=Math.max(+m[1]+1,Math.round(+m[1]*(1+.1*s)));return n+a.slice(m[1].length)}
function progNote(){const s=progStep();return s?" Level-up: reps and holds are a little higher because you have trained on many days lately.":" Train on 9 different days within 3 weeks to unlock gradual level-ups."}
