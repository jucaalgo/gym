import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Shield, Search, Save, X, Lock, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';

const AdminPanel = () => {
    const { users, registerUser, deleteUser, activeUser } = useUser();

    // Form States
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('user');
    const [message, setMessage] = useState(null);

    // Settings State
    const { customApiKey, updateApiKey } = useUser();
    const [apiKey, setApiKey] = useState(customApiKey);

    const handleSaveKey = () => {
        updateApiKey(apiKey);
        setMessage({ type: 'success', text: 'API Key Saved Successfully' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage(null);

        if (!newUsername || !newPassword || !newName) return;

        const result = registerUser(newUsername, newPassword, newName, newRole);

        if (result.success) {
            setMessage({ type: 'success', text: 'Agente registrado correctamente' });
            setNewName('');
            setNewUsername('');
            setNewPassword('');
            setIsAdding(false);
            // Auto hide message
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: result.error });
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`⚠️ ADVERTENCIA DE SEGURIDAD\n\n¿Estás seguro de eliminar al agente ${name}?\nEsta acción no se puede deshacer.`)) {
            deleteUser(id);
        }
    };

    return (
        <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                        PANEL DE CONTROL
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white/60">SYS.ADMIN.V2</span>
                        <p className="text-white/40 text-sm">Gestión de identidad y accesos</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-500 text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
                    <Shield className="w-4 h-4" />
                    SECURE CONNECTION
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{users.length}</div>
                        <div className="text-xs text-white/50">Usuarios Totales</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{users.filter(u => u.role !== 'admin').length}</div>
                        <div className="text-xs text-white/50">Agentes Activos</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</div>
                        <div className="text-xs text-white/50">Administradores</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-white/40" />
                        Directorio de Personal
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            {isAdding ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* API Key Settings Section */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        System Configuration
                    </h3>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-white/40 mb-1">Google Gemini API Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter AI API Key..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
                                />
                                <Lock className="w-4 h-4 text-white/20 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <button
                            onClick={handleSaveKey}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Key
                        </button>
                    </div>
                </div>

                {/* Add User Form */}
                {isAdding && (
                    <div className="p-6 bg-white/5 border-b border-white/10 animate-slide-in">
                        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Nombre Visible</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Ej. Agente Smith"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Usuario (Login)</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    placeholder="agent_007"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Contraseña</label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 uppercase font-bold">Rol</label>
                                <select
                                    value={newRole}
                                    onChange={e => setNewRole(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                                >
                                    <option value="user">Usuario (App)</option>
                                    <option value="admin">Administrador (Panel)</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 lg:col-span-4 mt-2"
                            >
                                <Save className="w-4 h-4" />
                                Guardar Registro
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>
                )}

                {/* Users List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-mono text-white/40 border-b border-white/5">
                                <th className="px-6 py-4">IDENTIDAD</th>
                                <th className="px-6 py-4">CREDENCIAL</th>
                                <th className="px-6 py-4">ROL</th>
                                <th className="px-6 py-4">ARQUETIPO</th>
                                <th className="px-6 py-4 text-right">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-white/30 italic">
                                        No hay registros en la base de datos.
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/60">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.name}</div>
                                                <div className="text-xs text-white/40 md:hidden">{user.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-white/60">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                                                <Shield className="w-3 h-3" /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                APP USER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/60 border border-white/10 uppercase">
                                            {user.archetype}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.id !== 'admin' && ( // Prevent deleting main admin
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400 transition-colors"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
