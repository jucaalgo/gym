import React, { useState, useEffect } from 'react';
import { Calendar, Zap, Target, Flag, ChevronRight, Star, Dumbbell, Play, X, Loader2 } from 'lucide-react';
import {
    ALL_ROUTINES,
    getFullRoutine,
    getRoutinesByGender
} from '../data/musclewiki_routines';
import { useNavigate } from 'react-router-dom';
import RoutineHeaderCarousel from '../components/ui/RoutineHeaderCarousel';

// ═══════════════════════════════════════════════════════════════
// ROUTINES BROWSER - MUSCLEWIKI SPLIT PROGRAMS
// Gender-optimized workout templates
// ═══════════════════════════════════════════════════════════════

const Routines = () => {
    const [routines, setRoutines] = useState(ALL_ROUTINES);
    const [loading, setLoading] = useState(false);
    const [genderFilter, setGenderFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const navigate = useNavigate();

    // Filter logic
    const filteredRoutines = routines.filter(routine => {
        const matchesGender = genderFilter === 'all' || routine.targetGender === genderFilter;
        const matchesDifficulty = difficultyFilter === 'all' || routine.difficulty === difficultyFilter;
        return matchesGender && matchesDifficulty;
    });



    const getGoalLabel = (goal) => {
        const labels = {
            'hypertrophy': '💪 Hypertrophy',
            'strength': '🏋️ Strength',
            'toning': '✨ Toning',
            'fat-loss': '🔥 Fat Loss',
            'general': '⚡ General',
            'functional': '🎯 Functional',
            'performance': '🚀 Performance'
        };
        return labels[goal] || goal;
    };

    const getGenderLabel = (gender) => {
        const labels = {
            'male': '♂️ Male Focus',
            'female': '♀️ Female Focus',
            'unisex': '👥 Unisex'
        };
        return labels[gender] || '👥 Unisex';
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'beginner': 'bg-green-500/20 text-green-400',
            'intermediate': 'bg-yellow-500/20 text-yellow-400',
            'advanced': 'bg-red-500/20 text-red-400'
        };
        return colors[difficulty] || colors.intermediate;
    };

    const getGradientColor = (goal) => {
        const gradients = {
            'hypertrophy': 'from-blue-600 to-purple-600',
            'strength': 'from-red-600 to-orange-600',
            'toning': 'from-pink-500 to-rose-500',
            'fat-loss': 'from-orange-500 to-yellow-500',
            'general': 'from-emerald-500 to-teal-500',
            'functional': 'from-cyan-500 to-blue-500',
            'performance': 'from-violet-500 to-purple-500'
        };
        return gradients[goal] || 'from-primary to-accent';
    };

    // Get unique goals from routines
    const availableGoals = [...new Set(routines.map(r => r.goal))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading workout programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-accent mb-2">
                    <Flag className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Routines</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Workout Programs</h1>
                        <p className="text-white/60 mt-1">{filteredRoutines.length} of {routines.length} programs</p>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-sm text-white/50 mb-2 block">TARGET</label>
                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                        <option value="all" className="bg-gray-900">All</option>
                        <option value="male" className="bg-gray-900">Male Focus</option>
                        <option value="female" className="bg-gray-900">Female Focus</option>
                        <option value="unisex" className="bg-gray-900">Unisex</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-sm text-white/50 mb-2 block">GOAL</label>
                    <select
                        value={goalFilter}
                        onChange={(e) => setGoalFilter(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                        <option value="all" className="bg-gray-900">All Goals</option>
                        {availableGoals.map(goal => (
                            <option key={goal} value={goal} className="bg-gray-900 capitalize">{goal}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Routines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutines.map((routine) => (
                    <div
                        key={routine.id}
                        onClick={() => setSelectedRoutine(routine)}
                        className="glass-panel rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                    >
                        {/* Header with gradient */}
                        <div className={`p-4 bg-gradient-to-r ${getGradientColor(routine.goal)}`}>
                            <div className="flex items-center justify-between">
                                <Dumbbell className="w-8 h-8 text-white/80" />
                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(routine.difficulty)}`}>
                                    {routine.difficulty}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {routine.name}
                            </h3>
                            <p className="text-sm text-white/50 mb-4 line-clamp-2">{routine.description}</p>

                            {/* Info Pills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {routine.duration}
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs flex items-center gap-1">
                                    <Dumbbell className="w-3 h-3" />
                                    {routine.exercises.length} exercises
                                </div>
                                <div className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    ~{routine.calories} cal
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                                {routine.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-xs capitalize">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredRoutines.length === 0 && (
                <div className="text-center py-12">
                    <Flag className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50">No programs found with these filters</p>
                    <button
                        onClick={() => { setGenderFilter('all'); setDifficultyFilter('all'); }}
                        className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Routine Detail Modal */}
            {selectedRoutine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRoutine(null)}>
                    <div className="bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold italic text-white">{selectedRoutine.name}</h2>
                                    <p className="text-white/60 text-sm">{selectedRoutine.description}</p>
                                </div>
                                <button onClick={() => setSelectedRoutine(null)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Dynamic Carousel Header */}
                            {getFullRoutine(selectedRoutine.id)?.exercises && (
                                <RoutineHeaderCarousel exercises={getFullRoutine(selectedRoutine.id).exercises} />
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                                    <div className="font-bold text-white">{selectedRoutine.weeklyFrequency}x/wk</div>
                                    <div className="text-xs text-white/40 uppercase">Frequency</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <Target className="w-5 h-5 text-primary mx-auto mb-2" />
                                    <div className="font-bold text-white capitalize">{selectedRoutine.tags?.[0] || 'General'}</div>
                                    <div className="text-xs text-white/40 uppercase">Focus</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
                                    <div className="font-bold text-white capitalize">{selectedRoutine.difficulty}</div>
                                    <div className="text-xs text-white/40 uppercase">Level</div>
                                </div>
                            </div>

                            {/* Exercises List */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Dumbbell className="w-5 h-5 text-primary" />
                                    Workout Plan
                                </h3>
                                <div className="space-y-3">
                                    {getFullRoutine(selectedRoutine.id)?.exercises.map((ex, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-white truncate">{ex.name}</div>
                                                <div className="text-xs text-white/50">{ex.sets} sets × {ex.reps}</div>
                                            </div>
                                            {ex.videoUrl && (
                                                <div className="w-16 h-10 bg-black rounded overflow-hidden shrink-0">
                                                    <video src={ex.videoUrl} className="w-full h-full object-cover opacity-60" muted />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={() => navigate('/matrix', { state: { routineId: selectedRoutine.id } })}
                                className="w-full py-4 bg-primary hover:bg-primary-hover text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                            >
                                <Play className="w-6 h-6 fill-current" />
                                START WORKOUT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Routines;
