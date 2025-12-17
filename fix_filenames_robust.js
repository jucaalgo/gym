import fs from 'fs';
import path from 'path';

const DIR = 'public/exercises';

// Map of Current Name -> Target Name
const RENAME_MAP = {
    'bench-press.png': 'barbell-bench-press.png',
    'deadlift.png': 'barbell-deadlift.png',
    'lunge.png': 'dumbbell-lunge.png',
    'squat.png': 'barbell-squat.png'
};

console.log('🔧 Starting Robust Rename in:', DIR);

if (!fs.existsSync(DIR)) {
    console.error('❌ Directory Not Found:', DIR);
    process.exit(1);
}

Object.entries(RENAME_MAP).forEach(([oldName, newName]) => {
    const oldPath = path.join(DIR, oldName);
    const newPath = path.join(DIR, newName);

    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${oldName} -> ${newName}`);
        } catch (err) {
            console.error(`❌ Failed to rename ${oldName}:`, err.message);
        }
    } else if (fs.existsSync(newPath)) {
        console.log(`ℹ️ Already Renamed: ${newName}`);
    } else {
        console.log(`⚠️ Source file not found: ${oldName} (and target missing)`);
    }
});

console.log('\n📂 Final Directory State:');
fs.readdirSync(DIR).forEach(file => {
    console.log(` - ${file}`);
});
