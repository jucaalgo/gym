import { BASE_MOVES } from './base_moves';
import { EQUIPMENT, ANGLES, VARIANTS, VALID_COMBOS } from './modifiers';

/**
 * THE GRAND LIBRARY ENGINE
 * Procedurally generates thousands of valid exercises by combining
 * Base Moves + Equipment + Angles + Variants.
 */

const generateLibrary = () => {
    let library = [];
    let idCounter = 1000;

    // Helper: Generate ID
    const genId = (base, eq, ang, vari) => {
        return `${base}-${eq}-${ang}-${vari}`.toLowerCase().replace(/_/g, '-').replace(/-+/g, '-');
    };

    // Helper: Calculate Difficulty
    const calcDiff = (baseDiff, eqKey, varKey) => {
        let d = baseDiff + (EQUIPMENT[eqKey]?.difficultyMod || 0) + (VARIANTS[varKey]?.mod || 0);
        return Math.min(10, Math.max(1, d)); // Clamp 1-10
    };

    // ════════ LOOP THROUGH ALL BASE MOVES ════════
    Object.values(BASE_MOVES).forEach(move => {
        // Find valid combo rules for this move
        // Check for exact ID match (e.g. 'squat') OR category match (e.g. 'calf_raise_standing' -> 'calves')
        let rules = VALID_COMBOS[move.id];

        if (!rules) {
            // Fallback Logic
            if (move.id.includes('calf')) rules = VALID_COMBOS.calves;
            else if (move.id.includes('curl')) rules = VALID_COMBOS.bicep_curl;
            else if (move.id.includes('extension')) rules = VALID_COMBOS.tricep_extension;
            else if (move.mechanics === 'compound') rules = VALID_COMBOS.cardio; // Rough fallback for new cardiovascular compound moves
            else rules = VALID_COMBOS.GENERIC_ISOLATION;
        }

        rules.forEach(rule => {
            // Level 1: Equipment
            rule.eq.forEach(eqKey => {
                if (!EQUIPMENT[eqKey] && eqKey !== 'TRAPBAR') return; // Skip if invalid ref
                const eq = EQUIPMENT[eqKey] || { label: '', id: 'none' };

                // Level 2: Angles
                rule.angles.forEach(angKey => {
                    if (!ANGLES[angKey]) return;
                    const ang = ANGLES[angKey];

                    // Level 3: Variants
                    rule.vars.forEach(varKey => {
                        if (!VARIANTS[varKey]) return;
                        const vari = VARIANTS[varKey];

                        // ════════ GENERATE ITEM ════════
                        // Construct Name: "Press de Banca (Inclinado) con Mancuernas - Agarre Neutro"
                        let fullName = `${move.name}`;
                        if (ang.label) fullName += ` ${ang.label}`;
                        if (eq.label) fullName += ` ${eq.label}`;
                        if (vari.label) fullName += ` - ${vari.label}`;

                        // Determine Visual Asset (Fallbacks)
                        // In a real app with 1000 items, we map these to ~50 generic asset buckets
                        let visualType = move.visualLevel;
                        let assetUrl = null;

                        // Smart Asset Mapping (Simulated)
                        if (move.id.includes('squat')) assetUrl = "https://videos.pexels.com/video-files/5319759/5319759-sd_640_360_25fps.mp4";
                        if (move.id.includes('deadlift')) assetUrl = "https://videos.pexels.com/video-files/5319098/5319098-sd_640_360_25fps.mp4";

                        // Create Entry
                        const entry = {
                            id: genId(move.id, eq.id, ang.id, vari.id),
                            name: fullName,
                            muscleGroup: move.muscle,
                            pattern: move.pattern,
                            mechanics: move.mechanics,
                            equipment: [eq.type],
                            difficulty: calcDiff(move.baseDifficulty, eqKey, varKey),
                            visualLevel: visualType,
                            videoUrl: assetUrl, // Will be populated with backup generic if null
                            genderTarget: 'unisex', // Default
                            tags: [move.id, eq.id, ang.id],
                            generated: true
                        };

                        library.push(entry);
                        idCounter++;
                    });
                });
            });
        });
    });

    return library;
};

// Execute Generation
const GRAND_LIBRARY = generateLibrary();

// Export
export default GRAND_LIBRARY;
export { generateLibrary };
