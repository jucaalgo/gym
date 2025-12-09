import React, { useState } from 'react';
import { Book, Star, Calendar, Save, Trash2, Plus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import soundManager from '../utils/sounds';
import { triggerHaptic } from '../utils/haptics';

const Journal = () => {
    const { user, saveWorkoutLog } = useUser();
    const [note, setNote] = useState('');
    const [rating, setRating] = useState(5);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const logs = user.workoutHistory || [];

    const handleSave = () => {
        if (!note.trim()) return;

        saveWorkoutLog({
            notes: note,
            rating,
            type: 'Journal Entry',
            duration: 0
        });

        triggerHaptic('success');
        soundManager.play('success');
        setNote('');
        setRating(5);
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-6 pb-24 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Book className="w-8 h-8 text-secondary" />
                    Neural Journal
                </h1>
                <p className="text-white/60">Log your mission reports</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Entry Form */}
                <div className="glass-panel p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-secondary" />
                        New Entry
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-white/50 mb-2 block">Mission Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => {
                                            setRating(star);
                                            soundManager.play('click');
                                        }}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? 'fill-warning text-warning' : 'text-white/20'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-white/50 mb-2 block">Field Notes</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Report mission status, pain levels, or observations..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-secondary transition-colors h-40 resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!note.trim()}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            SAVE LOG
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="glass-panel p-6 rounded-3xl h-[600px] overflow-y-auto">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-white/50" />
                        Mission Logs
                    </h3>

                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <div className="text-center py-12 text-white/30">
                                <Book className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                No entries yet
                            </div>
                        ) : (
                            [...logs].reverse().map((log) => (
                                <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="text-xs text-secondary font-mono mb-1">
                                                {formatDate(log.date)}
                                            </div>
                                            <div className="font-semibold text-white">
                                                {log.type || 'Workout'}
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(log.rating || 0)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                                            ))}
                                        </div>
                                    </div>
                                    {log.notes && (
                                        <p className="text-white/70 text-sm leading-relaxed">
                                            {log.notes}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Journal;
