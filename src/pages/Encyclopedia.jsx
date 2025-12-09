import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Dumbbell,
    X,
    Play,
    Sparkles,
    Loader2
} from 'lucide-react';
import { realExercisesAdapter } from '../data/real_exercises_adapter';

// ═══════════════════════════════════════════════════════════════
// ENCYCLOPEDIA - 800+ REAL EXERCISES
// Using real exercise database with images
// ═══════════════════════════════════════════════════════════════

const Encyclopedia = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEquipment, setSelectedEquipment] = useState('all');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Load exercises on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await realExercisesAdapter.init();
            const allExercises = realExercisesAdapter.getAll();
            setExercises(allExercises);
            setLoading(false);
        };
        loadData();
    }, []);

    // Get unique filter options
    const muscles = useMemo(() => {
        const set = new Set();
        exercises.forEach(ex => {
            if (ex.primaryMuscles) {
                ex.primaryMuscles.forEach(m => set.add(m));
            }
        });
        return ['all', ...Array.from(set).sort()];
    }, [exercises]);

    const categories = useMemo(() => {
        const set = new Set(exercises.map(ex => ex.category).filter(Boolean));
        return ['all', ...Array.from(set).sort()];
    }, [exercises]);

    const equipmentList = useMemo(() => {
        const set = new Set(exercises.map(ex => ex.equipment).filter(Boolean));
        return ['all', ...Array.from(set).sort()];
    }, [exercises]);

    // Filter exercises
    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const matchesSearch = !searchQuery ||
                ex.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMuscle = selectedMuscle === 'all' ||
                (ex.primaryMuscles && ex.primaryMuscles.includes(selectedMuscle));
            const matchesCategory = selectedCategory === 'all' ||
                ex.category === selectedCategory;
            const matchesEquipment = selectedEquipment === 'all' ||
                ex.equipment === selectedEquipment;
            return matchesSearch && matchesMuscle && matchesCategory && matchesEquipment;
        });
    }, [exercises, searchQuery, selectedMuscle, selectedCategory, selectedEquipment]);

    // Image slideshow for selected exercise
    useEffect(() => {
        if (!selectedExercise || !selectedExercise.images || selectedExercise.images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % selectedExercise.images.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [selectedExercise]);

    const getImageUrl = (exercise, imageIndex = 0) => {
        if (!exercise || !exercise.images || exercise.images.length === 0) return null;
        const imgPath = exercise.images[imageIndex] || exercise.images[0];
        return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imgPath}`;
    };

    const getLevelBadge = (level) => {
        const badges = {
            beginner: { color: 'bg-green-500/20 text-green-400', label: 'Beginner' },
            intermediate: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Intermediate' },
            expert: { color: 'bg-red-500/20 text-red-400', label: 'Expert' }
        };
        return badges[level] || badges.intermediate;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading 800+ exercises...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-accent mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Encyclopedia</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Exercise Database</h1>
                    <p className="text-white/60 mt-1">{filteredExercises.length} of {exercises.length} exercises</p>
                </div>
            </header>

            {/* Filters */}
            <div className="glass-panel rounded-2xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <select value={selectedMuscle} onChange={(e) => setSelectedMuscle(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">
                        <option value="all" className="bg-gray-900">All Muscles</option>
                        {muscles.slice(1).map(m => <option key={m} value={m} className="bg-gray-900 capitalize">{m}</option>)}
                    </select>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">
                        <option value="all" className="bg-gray-900">All Categories</option>
                        {categories.slice(1).map(c => <option key={c} value={c} className="bg-gray-900 capitalize">{c}</option>)}
                    </select>
                    <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">
                        <option value="all" className="bg-gray-900">All Equipment</option>
                        {equipmentList.slice(1).map(e => <option key={e} value={e} className="bg-gray-900 capitalize">{e}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredExercises.slice(0, 100).map(exercise => {
                    const levelBadge = getLevelBadge(exercise.level);
                    const imageUrl = getImageUrl(exercise);
                    return (
                        <div key={exercise.id} onClick={() => { setSelectedExercise(exercise); setCurrentImageIndex(0); }}
                            className="glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group">
                            <div className="aspect-video bg-black/40 relative overflow-hidden">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={exercise.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Dumbbell className="w-12 h-12 text-white/20" /></div>
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${levelBadge.color}`}>{levelBadge.label}</div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-white mb-1 line-clamp-1">{exercise.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <span className="capitalize">{exercise.primaryMuscles?.[0] || 'General'}</span>
                                    <span>•</span>
                                    <span className="capitalize">{exercise.equipment || 'Various'}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {filteredExercises.length > 100 && (
                <div className="text-center mt-6 text-white/50">Showing 100 of {filteredExercises.length}. Use filters to narrow.</div>
            )}

            {/* Modal */}
            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gray-900/90 backdrop-blur">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedExercise.name}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelBadge(selectedExercise.level).color}`}>{selectedExercise.level}</span>
                            </div>
                            <button onClick={() => setSelectedExercise(null)} className="p-2 rounded-xl hover:bg-white/10"><X className="w-6 h-6 text-white/60" /></button>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="aspect-square bg-black rounded-2xl overflow-hidden relative">
                                {selectedExercise.images?.length > 0 ? (
                                    <>
                                        <img src={getImageUrl(selectedExercise, currentImageIndex)} alt={selectedExercise.name} className="w-full h-full object-contain" />
                                        {selectedExercise.images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {selectedExercise.images.map((_, idx) => (
                                                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-white/30'}`} />
                                                ))}
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-xs text-white/80">LIVE</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Dumbbell className="w-24 h-24 text-white/10" /></div>
                                )}
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-panel rounded-xl p-4">
                                        <div className="text-white/50 text-sm mb-1">Primary Muscles</div>
                                        <div className="text-white font-medium capitalize">{selectedExercise.primaryMuscles?.join(', ') || 'N/A'}</div>
                                    </div>
                                    <div className="glass-panel rounded-xl p-4">
                                        <div className="text-white/50 text-sm mb-1">Secondary</div>
                                        <div className="text-white font-medium capitalize">{selectedExercise.secondaryMuscles?.join(', ') || 'None'}</div>
                                    </div>
                                    <div className="glass-panel rounded-xl p-4">
                                        <div className="text-white/50 text-sm mb-1">Equipment</div>
                                        <div className="text-white font-medium capitalize">{selectedExercise.equipment || 'Body only'}</div>
                                    </div>
                                    <div className="glass-panel rounded-xl p-4">
                                        <div className="text-white/50 text-sm mb-1">Mechanic</div>
                                        <div className="text-white font-medium capitalize">{selectedExercise.mechanic || 'Compound'}</div>
                                    </div>
                                </div>
                                {selectedExercise.instructions?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
                                        <ol className="space-y-2">
                                            {selectedExercise.instructions.map((step, idx) => (
                                                <li key={idx} className="flex gap-3 text-white/70 text-sm">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
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
