import React, { useState, useMemo } from 'react';
import {
    Search,
    Dumbbell,
    X,
    Sparkles,
    Loader2,
    Filter,
    Camera,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import VisualAsset from '../components/ui/VisualAsset';

// ═══════════════════════════════════════════════════════════════
// ENCYCLOPEDIA - SYSTEM DATABASE v2.1
// Advanced Filtering & Pagination
// ═══════════════════════════════════════════════════════════════

// MAPPING LOGIC: Raw Muscle -> Category
// MAPPING LOGIC: Raw Muscle -> Category
const MUSCLE_GROUPS = {
    'Pecho': ['Pectoralis', 'Serratus', 'Chest'],
    'Espalda': ['Latissimus', 'Trapezius', 'Rhomboids', 'Teres', 'Back'],
    'Piernas': ['Quadriceps', 'Hamstrings', 'Gluteus', 'Adductor', 'Abductor', 'Calves', 'Soleus', 'Tibialis', 'Legs', 'Thigh'],
    'Hombros': ['Deltoid', 'Shoulder'],
    'Brazos': ['Biceps', 'Triceps', 'Brachialis', 'Forearms', 'Arms'],
    'Core': ['Abdominis', 'Obliques', 'Core']
};

const getMuscleCategory = (muscleName) => {
    if (!muscleName) return 'Otros';
    for (const [category, keywords] of Object.entries(MUSCLE_GROUPS)) {
        if (keywords.some(k => muscleName.includes(k))) return category;
    }
    return 'Otros';
};

const PAGE_SIZE = 24;

const Encyclopedia = () => {
    const { exercises: allExercises, loading, error } = useWorkoutData();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos'); // Replaces specific muscle filter
    const [selectedEquipment, setSelectedEquipment] = useState('all');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Options
    const categories = ['todos', ...Object.keys(MUSCLE_GROUPS), 'Otros'];

    const equipmentList = useMemo(() => {
        const set = new Set();
        allExercises.forEach(ex => {
            if (ex.equipment) set.add(ex.equipment);
        });
        return ['all', ...Array.from(set).sort()];
    }, [allExercises]);

    // Filtering Logic
    const filteredExercises = useMemo(() => {
        if (loading || allExercises.length === 0) return [];

        // Reset page on filter change
        if (currentPage !== 1) setCurrentPage(1);

        return allExercises.filter(ex => {
            const matchesSearch = !searchQuery ||
                ex.name.toLowerCase().includes(searchQuery.toLowerCase());

            const exCategory = getMuscleCategory(ex.targetMuscle);
            const matchesCategory = selectedCategory === 'todos' || exCategory === selectedCategory;

            const matchesEquipment = selectedEquipment === 'all' ||
                ex.equipment === selectedEquipment;

            return matchesSearch && matchesCategory && matchesEquipment;
        });
    }, [allExercises, searchQuery, selectedCategory, selectedEquipment, loading]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredExercises.length / PAGE_SIZE);
    const paginatedExercises = filteredExercises.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const getImageUrl = (exercise) => {
        if (!exercise) return null;
        return exercise.imagePath;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-[#00D4FF] animate-spin mx-auto mb-6" />
                    <div className="text-white text-xl font-['Orbitron'] mb-2">ACCESSING MAINFRAME</div>
                    <p className="text-[#00D4FF]/60 font-['Roboto_Mono'] text-sm">Loading 455 master files...</p>
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 text-center p-10">SYSTEM ERROR: {error}</div>;

    return (
        <div className="min-h-screen p-6 pb-24">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[#00D4FF] mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider font-['Roboto_Mono']">System Database</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white font-['Orbitron'] tracking-wide">
                        ENCYCLOPEDIA <span className="text-[#00D4FF]">V2.1</span>
                    </h1>
                    <p className="text-white/60 mt-2 font-['Roboto_Mono'] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                        {filteredExercises.length} Records Found
                    </p>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="glass-panel rounded-2xl p-4 mb-8 border border-white/5 bg-[#121212]/80 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#00D4FF] transition-colors" />
                        <input
                            type="text"
                            placeholder="Decipher exercise codes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00D4FF]/50 transition-all font-['Roboto_Mono']"
                        />
                    </div>

                    {/* Category Filter (Simpler) */}
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#00D4FF]/50 hover:bg-white/5 transition-all text-sm capitalize">
                        <option value="all" className="bg-gray-900">All Muscle Groups</option>
                        {categories.slice(1).map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                    </select>

                    <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#00D4FF]/50 hover:bg-white/5 transition-all text-sm capitalize">
                        <option value="all" className="bg-gray-900">All Equipment</option>
                        {equipmentList.slice(1).map(e => <option key={e} value={e} className="bg-gray-900 capitalize">{e}</option>)}
                    </select>
                </div>
            </div>

            {/* Main Grid (Paginated) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[500px]">
                {paginatedExercises.map(exercise => (
                    <div
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise)}
                        className="glass-panel rounded-2xl overflow-hidden hover:border-[#00D4FF]/50 transition-all duration-300 cursor-pointer group relative bg-[#1A1A1A] border-white/5 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="aspect-video bg-black/60 relative overflow-hidden">
                            <VisualAsset
                                exercise={exercise}
                                type="3d_viewer"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1">
                            <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-[#00D4FF] transition-colors font-['Orbitron'] text-sm tracking-wide">
                                {exercise.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 capitalize">
                                    {getMuscleCategory(exercise.targetMuscle)}
                                </span>
                                <span className="px-2 py-1 rounded bg-white/5 text-white/50 border border-white/5 capitalize">
                                    {exercise.equipment || 'No Gear'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {filteredExercises.length > PAGE_SIZE && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-white/60 font-['Roboto_Mono'] text-sm">
                        Page <span className="text-[#00D4FF] font-bold">{currentPage}</span> of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredExercises.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">No Records Found</h3>
                    <p className="text-white/50">Adjust your search parameters to locate files.</p>
                </div>
            )}

            {/* Detail Modal (Same as before) */}
            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedExercise(null)}>
                    <div className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.1)] bg-[#0f0f0f]" onClick={e => e.stopPropagation()}>

                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white font-['Orbitron'] tracking-wide flex items-center gap-3">
                                    {selectedExercise.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse"></span>
                                    <span className="text-[#00D4FF] text-xs font-bold font-['Roboto_Mono'] tracking-widest uppercase">
                                        CLASSIFIED EXERCISE DATA
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedExercise(null)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                                <X className="w-6 h-6 border-none" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="aspect-square bg-black/40 rounded-2xl overflow-hidden relative border border-[#00D4FF]/20 shadow-2xl">
                                    <VisualAsset
                                        exercise={selectedExercise}
                                        type="3d_viewer"
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-panel p-4 rounded-xl border-l-2 border-[#00D4FF] bg-[#00D4FF]/5">
                                        <div className="text-[#00D4FF] text-[10px] uppercase font-bold tracking-wider mb-1">Target Muscle</div>
                                        <div className="text-white font-bold capitalize text-lg">{selectedExercise.targetMuscle || 'N/A'}</div>
                                    </div>
                                    <div className="glass-panel p-4 rounded-xl border-l-2 border-[#39FF14] bg-[#39FF14]/5">
                                        <div className="text-[#39FF14] text-[10px] uppercase font-bold tracking-wider mb-1">Equipment</div>
                                        <div className="text-white font-bold capitalize text-lg">{selectedExercise.equipment || 'No Gear'}</div>
                                    </div>
                                </div>

                                {selectedExercise.biomechanics && (
                                    <div className="glass-panel rounded-2xl p-6 border border-[#00D4FF]/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Sparkles className="w-24 h-24 text-[#00D4FF]" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#00D4FF] mb-4 flex items-center gap-2 font-['Orbitron']">
                                            <Sparkles className="w-5 h-5" />
                                            BIOMECHANICAL ANALYSIS
                                        </h3>
                                        <div className="text-white/80 text-sm leading-relaxed font-light relative z-10">
                                            {selectedExercise.biomechanics}
                                        </div>
                                    </div>
                                )}

                                {selectedExercise.aiPrompt && (
                                    <div className="rounded-2xl p-6 bg-black/60 border border-white/10 font-['Roboto_Mono']">
                                        <h3 className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                            SYSTEM PROMPT
                                        </h3>
                                        <div className="text-[#39FF14] text-xs leading-relaxed opacity-80 break-words">
                                            {">"} {selectedExercise.aiPrompt}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Encyclopedia;
