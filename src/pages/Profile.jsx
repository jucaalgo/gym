import React from 'react';
import { useUser } from '../context/UserContext';
import { User, Shield, Activity, Calendar, Trophy, Zap, Download, Upload, Smartphone } from 'lucide-react';
import soundManager from '../utils/sounds';
import { triggerHaptic } from '../utils/haptics';

const Profile = () => {
    const { user, logout, setUser } = useUser();

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
                    alert('Data restored successfully! Welcome back, Agent.');
                } else {
                    alert('Invalid backup file.');
                }
            } catch (err) {
                console.error(err);
                alert('Error reading file.');
            }
        };
        reader.readAsText(file);
    };

    if (!user) return null;

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Agent Profile</h1>
                    <p className="text-white/60">Identity & Stats</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors"
                >
                    Logout
                </button>
            </header>

            {/* Identity Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-50`}>
                    <div className="text-6xl">{user.rankIcon}</div>
                </div>

                <div className="relative z-10 flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
                        {user.name.charAt(0)}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            {user.role === 'admin' && (
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> ADMIN
                                </span>
                            )}
                        </div>
                        <p className="text-white/60 font-mono mb-4">ID: {user.username || user.id}</p>

                        <div className="flex gap-4">
                            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
                                Rank: <span className="text-white font-bold">{user.rank}</span>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
                                Level: <span className="text-primary font-bold">{user.level}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold">Total Trained</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{Math.floor(user.totalMinutes / 60)}h {user.totalMinutes % 60}m</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-secondary">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-bold">Calories</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{(user.caloriesBurned / 1000).toFixed(1)}k kcal</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-accent">
                        <Trophy className="w-5 h-5" />
                        <h3 className="font-bold">Current Streak</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{user.currentStreak} days</p>
                </div>
            </div>

            {/* Biometrics */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-success" />
                    Biometrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-white/40 text-xs uppercase mb-1">Weight</div>
                        <div className="text-xl font-bold text-white">{user.weight} kg</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-white/40 text-xs uppercase mb-1">Height</div>
                        <div className="text-xl font-bold text-white">{user.height} cm</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-white/40 text-xs uppercase mb-1">Age</div>
                        <div className="text-xl font-bold text-white">{user.age} yrs</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-white/40 text-xs uppercase mb-1">Gender</div>
                        <div className="text-xl font-bold text-white capitalize">{user.gender}</div>
                    </div>
                </div>
            </div>
            {/* Data Management (Sync) */}
            <div className="glass-panel p-6 rounded-3xl border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Device Sync & Backup
                </h3>
                <p className="text-white/50 text-sm mb-6">
                    Since this is a secure offline system, your data lives on this device.
                    To transfer to another phone, Export here and Import on the new device.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleExport}
                        className="py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                        <Download className="w-5 h-5" />
                        Export Backup
                    </button>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="w-full h-full py-4 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary font-semibold flex items-center justify-center gap-2 transition-all border border-primary/20">
                            <Upload className="w-5 h-5" />
                            Restore Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
