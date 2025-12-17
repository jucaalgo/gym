import fs from 'fs';
import path from 'path';

// CONFIG
const CATALOG_PATH = './public/free_exercise_catalog.json';
const IMAGES_DIR = './public/exercises';
const OUTPUT_MAP_PATH = './public/exercise_image_map.json';

// Normalize for comparison: remove all non-alphanumeric, lowercase
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const run = async () => {
    console.log('🔍 Starting Image Verification...');

    // 1. Load Catalog
    const catalogRaw = fs.readFileSync(CATALOG_PATH);
    const catalog = JSON.parse(catalogRaw);
    console.log(`✅ Loaded Catalog: ${catalog.length} items`);

    // 2. Load Files
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('❌ Exercises directory not found!');
        return;
    }
    const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
    console.log(`✅ Found Files: ${files.length} images`);

    // 3. Create Map (Name -> Filename)
    const map = {};
    const unmapped = [];
    const usedFiles = new Set();

    catalog.forEach(item => {
        const simpleName = normalize(item.name);

        // Strategy A: Exact Match of normalized name
        let match = files.find(f => normalize(f.replace('.png', '')) === simpleName);

        // Strategy B: Try to match with specific replacements if A fails
        // (yuhonas db uses ___ for ' - ' and __ for ' (')
        if (!match) {
            // e.g. "Bench Press - Powerlifting" -> "bench_press___powerlifting"
            const legacyName = item.name.toLowerCase()
                .replace(/ - /g, '___')
                .replace(/ \(/g, '__')
                .replace(/\)/g, '_') // trailing ) -> _
                .replace(/ /g, '_')
                .replace(/[^a-z0-9_]/g, '') // remove others
                .replace(/_+/g, '_') // collapse
                .replace(/_$/g, ''); // trim end

            match = files.find(f => f === `${legacyName}.png`);
        }

        if (match) {
            map[item.name] = match; // Key is original name, Value is filename
            usedFiles.add(match);
        } else {
            unmapped.push(item.name);
        }
    });

    // 4. Report
    console.log(`\n🎉 MAPPED: ${Object.keys(map).length}/${catalog.length}`);
    console.log(`⚠️ UNMAPPED: ${unmapped.length}`);

    if (unmapped.length > 0) {
        console.log('\nSample Unmapped:', unmapped.slice(0, 10));
    }

    // 5. Save Map
    fs.writeFileSync(OUTPUT_MAP_PATH, JSON.stringify(map, null, 2));
    console.log(`\n💾 Saved Mapping to: ${OUTPUT_MAP_PATH}`);
};

run();
