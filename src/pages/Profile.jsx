import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useInstallPrompt } from '../context/InstallContext';
import { User, Shield, Activity, Calendar, Trophy, Zap, Download, Upload, Smartphone, Edit2, Save } from 'lucide-react';
import soundManager from '../utils/sounds';
import { triggerHaptic } from '../utils/haptics';
import DigitalTwinAvatar from '../components/ui/DigitalTwinAvatar';
import Augmentations from '../components/ui/Augmentations';
import { ARCHETYPES } from '../data/archetypes';

const Profile = () => {
    const { user, logout, setUser, updateUserProfile } = useUser();
    const { promptInstall, deferredPrompt, isIOS, isStandalone } = useInstallPrompt();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    const handleSaveProfile = () => {
        updateUserProfile(user.id, editForm);
        setIsEditing(false);
        soundManager.play('success');
        triggerHaptic('success');
    };

    // Export Data (Backup)
    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `jca_gym_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        soundManager.play('success');
        triggerHaptic('success');
    };

    // Import Data (Restore)
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedUser = JSON.parse(e.target.result);
                if (importedUser && importedUser.id) {
                    setUser(importedUser);
                    localStorage.setItem('currentUser', JSON.stringify(importedUser)); // Force immediate save
                    soundManager.play('levelUp');
                    triggerHaptic('success');
                    alert('¡Datos restaurados con éxito! Bienvenido de nuevo, Agente.');
                } else {
                    alert('Archivo de respaldo inválido.');
                }
            } catch (err) {
                console.error(err);
                alert('Error leyendo archivo.');
            }
        };
        reader.readAsText(file);
    };

    if (!user) return null;

    // Safe name access
    const displayName = user.name || 'Agent';

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Orbitron'] tracking-wide">
                        PERFIL DE <span className="text-[#00D4FF]">AGENTE</span>
                    </h1>
                    <p className="text-white/60 font-['Roboto_Mono'] text-sm">Identidad y Estadísticas</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors font-['Orbitron'] text-xs tracking-wider"
                >
                    CERRAR SESIÓN
                </button>
            </header>

            {/* Identity Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-[#1A1A1A] border-white/5">
                <div className={`absolute top-0 right-0 p-4 opacity-10 md:opacity-50`}>
                    <div className="text-6xl md:text-8xl grayscale opacity-20">{user.rankIcon}</div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Digital Twin Hero */}
                    <div className="w-48 h-64 glass-panel rounded-2xl overflow-hidden bg-black/40 border-white/5 shadow-2xl">
                        <DigitalTwinAvatar
                            level={user.level}
                            archetype={Object.values(ARCHETYPES).find(a => a.id === user.archetype) || ARCHETYPES.GUERRERO}
                            biometrics={{ hrv: user.hrv, sleep: user.sleepScore }}
                            muscleFatigue={user.muscleFatigue}
                        />
                    </div>

                    <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Orbitron'] tracking-wide">{displayName}</h2>
                            {user.role === 'admin' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 uppercase tracking-wider font-['Roboto_Mono']">
                                    <Shield className="w-3 h-3" /> ADMIN
                                </span>
                            )}
                        </div>
                        <p className="text-white/40 font-['Roboto_Mono'] text-xs mb-4 uppercase tracking-widest">
                            ID: {user.username || user.id}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 font-['Roboto_Mono']">
                                RANK: <span className="text-white font-bold ml-1 uppercase">{user.rank}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 font-['Roboto_Mono']">
                                LEVEL: <span className="text-[#00D4FF] font-bold ml-1">{user.level}</span>
                            </div>
                        </div>

                        {/* Readiness Quick View */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm">
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <div className="text-[9px] text-white/40 uppercase mb-1">Neural HRV</div>
                                <div className="text-lg font-bold text-primary font-['Roboto_Mono']">{user.hrv || 75} <span className="text-[10px] font-normal">ms</span></div>
                            </div>
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                <div className="text-[9px] text-white/40 uppercase mb-1">Sleep Score</div>
                                <div className="text-lg font-bold text-accent font-['Roboto_Mono']">{user.sleepScore || 82}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl bg-[#0f0f0f] border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-[#00D4FF]">
                            <Activity className="w-5 h-5" />
                            <h3 className="font-bold font-['Orbitron'] text-xs tracking-wider">TOTAL TRAINED</h3>
                        </div>
                        <p className="text-2xl font-bold text-white font-['Roboto_Mono']">
                            {Math.floor(user.totalMinutes / 60)}<span className="text-sm text-white/40">h</span> {user.totalMinutes % 60}<span className="text-sm text-white/40">m</span>
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl bg-[#0f0f0f] border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-purple-400">
                            <Zap className="w-5 h-5" />
                            <h3 className="font-bold font-['Orbitron'] text-xs tracking-wider">CALORIES BURNED</h3>
                        </div>
                        <p className="text-2xl font-bold text-white font-['Roboto_Mono']">
                            {(user.caloriesBurned / 1000).toFixed(1)} <span className="text-sm text-white/40">kCal</span>
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl bg-[#0f0f0f] border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-emerald-400">
                            <Trophy className="w-5 h-5" />
                            <h3 className="font-bold font-['Orbitron'] text-xs tracking-wider">CURRENT STREAK</h3>
                        </div>
                        <p className="text-2xl font-bold text-white font-['Roboto_Mono']">
                            {user.currentStreak} <span className="text-sm text-white/40">DAYS</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Augmentations Section */}
            <div className="glass-panel p-6 rounded-3xl bg-[#1A1A1A] border-white/5">
                <Augmentations userLevel={user.level} />
            </div>

            {/* Biometrics */}
            <div className="glass-panel p-6 rounded-3xl bg-[#1A1A1A] border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Orbitron']">
                        <Activity className="w-5 h-5 text-[#39FF14]" />
                        BIOMETRICS
                    </h3>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)} // Cancel
                                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-['Roboto_Mono'] uppercase transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="px-3 py-1 rounded-lg bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border border-[#00D4FF]/20 text-xs font-bold transition-colors flex items-center gap-1 font-['Roboto_Mono'] uppercase"
                            >
                                <Save className="w-3 h-3" /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setEditForm({
                                    weight: user.weight,
                                    height: user.height,
                                    age: user.age,
                                    gender: user.gender
                                });
                                setIsEditing(true);
                            }}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-colors flex items-center gap-2 uppercase font-['Roboto_Mono']"
                        >
                            <Edit2 className="w-3 h-3" /> Edit Stats
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[#00D4FF] text-[10px] uppercase font-bold tracking-wider mb-1 font-['Roboto_Mono']">Weight</div>
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={editForm.weight}
                                    onChange={e => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                                    className="w-full bg-transparent border-b border-white/20 px-0 py-1 text-white font-bold text-lg focus:outline-none focus:border-[#00D4FF] font-['Roboto_Mono']"
                                />
                                <span className="text-xs text-white/40 font-['Roboto_Mono']">kg</span>
                            </div>
                        ) : (
                            <div className="text-xl font-bold text-white font-['Roboto_Mono']">{user.weight} <span className="text-xs text-white/40">kg</span></div>
                        )}
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[#00D4FF] text-[10px] uppercase font-bold tracking-wider mb-1 font-['Roboto_Mono']">Height</div>
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={editForm.height}
                                    onChange={e => setEditForm({ ...editForm, height: Number(e.target.value) })}
                                    className="w-full bg-transparent border-b border-white/20 px-0 py-1 text-white font-bold text-lg focus:outline-none focus:border-[#00D4FF] font-['Roboto_Mono']"
                                />
                                <span className="text-xs text-white/40 font-['Roboto_Mono']">cm</span>
                            </div>
                        ) : (
                            <div className="text-xl font-bold text-white font-['Roboto_Mono']">{user.height} <span className="text-xs text-white/40">cm</span></div>
                        )}
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[#00D4FF] text-[10px] uppercase font-bold tracking-wider mb-1 font-['Roboto_Mono']">Age</div>
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={editForm.age}
                                    onChange={e => setEditForm({ ...editForm, age: Number(e.target.value) })}
                                    className="w-full bg-transparent border-b border-white/20 px-0 py-1 text-white font-bold text-lg focus:outline-none focus:border-[#00D4FF] font-['Roboto_Mono']"
                                />
                                <span className="text-xs text-white/40 font-['Roboto_Mono']">yr</span>
                            </div>
                        ) : (
                            <div className="text-xl font-bold text-white font-['Roboto_Mono']">{user.age} <span className="text-xs text-white/40">yr</span></div>
                        )}
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[#00D4FF] text-[10px] uppercase font-bold tracking-wider mb-1 font-['Roboto_Mono']">Gender</div>
                        {isEditing ? (
                            <select
                                value={editForm.gender}
                                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                className="w-full bg-transparent border-b border-white/20 px-0 py-1 text-white font-bold text-sm focus:outline-none focus:border-[#00D4FF] font-['Roboto_Mono'] uppercase"
                            >
                                <option value="male" className="bg-black">Male</option>
                                <option value="female" className="bg-black">Female</option>
                                <option value="neutral" className="bg-black">Neutral</option>
                            </select>
                        ) : (
                            <div className="text-xl font-bold text-white capitalize font-['Roboto_Mono']">{user.gender}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Data Management (Sync) */}
            <div className="glass-panel p-6 rounded-3xl border border-[#00D4FF]/20 bg-[#00D4FF]/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-['Orbitron']">
                    <Smartphone className="w-5 h-5 text-[#00D4FF]" />
                    DEVICE SYNC & BACKUP
                </h3>
                <p className="text-white/50 text-xs mb-6 font-['Roboto_Mono'] leading-relaxed">
                    SECURE OFFLINE SYSTEM. DATA RESIDES LOCALLY. TO MIGRATE, EXPORT BACKUP AND RESTORE ON NEW TERMINAL.
                </p>

                {/* APP INSTALLATION STATUS */}
                {!isStandalone && (deferredPrompt || isIOS) && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                        <h4 className="text-primary font-bold text-sm mb-2 font-['Orbitron']">INSTALL APPLICATION</h4>
                        <p className="text-white/60 text-xs mb-3">Install JCA GYM for offline access and full performance.</p>

                        {isIOS ? (
                            <div className="text-xs text-white/50 bg-black/20 p-2 rounded border border-white/5">
                                Tap <span className="text-white font-bold">Share</span> then <span className="text-white font-bold">Add to Home Screen</span>
                            </div>
                        ) : (
                            <button
                                onClick={promptInstall}
                                className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/80 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-['Orbitron']"
                            >
                                <Download className="w-4 h-4" /> Install Now
                            </button>
                        )}
                    </div>
                )}

                {user.role === 'admin' && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                        <div>
                            <h4 className="text-amber-500 font-bold font-['Orbitron'] text-sm tracking-wide flex items-center gap-2">
                                <Shield className="w-4 h-4" /> SYSTEM ADMIN
                            </h4>
                            <p className="text-white/40 text-[10px] font-['Roboto_Mono']">Manage Users & Credentials</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/admin'}
                            className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors font-['Orbitron'] tracking-wider"
                        >
                            OPEN PANEL
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleExport}
                        className="py-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-lg font-['Orbitron'] text-sm tracking-wider"
                    >
                        <Download className="w-5 h-5" />
                        EXPORT DATA
                    </button>

                    <div className="relative group">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button className="w-full h-full py-4 rounded-xl bg-[#00D4FF] hover:bg-[#00c4ec] text-black font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] font-['Orbitron'] text-sm tracking-wider">
                            <Upload className="w-5 h-5" />
                            RESTORE DATA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
