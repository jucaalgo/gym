import { BASE_MOVEMENTS } from './src/data/grand_library/base_movements.js';

console.log('Checking ' + BASE_MOVEMENTS.length + ' movements...');

BASE_MOVEMENTS.forEach((move, index) => {
    if (!move.primary) {
        console.error(`[ERROR] Item ${index} (${move.name}) missing 'primary'`);
    }
    if (!move.pattern) {
        console.error(`[ERROR] Item ${index} (${move.name}) missing 'pattern'`);
    }
    if (!move.validEquipment) {
        console.error(`[ERROR] Item ${index} (${move.name}) missing 'validEquipment'`);
    }
});
console.log('Check complete.');
