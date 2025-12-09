import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded credentials as per user request
        if (username === 'jucaalgo' && password === '13470811') {
            localStorage.setItem('antigravity_admin', 'true');
            navigate('/admin');
        } else {
            setError('CREDENCIALES INVÁLIDAS. ACCESO DENEGADO.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

            <div className="relative z-10 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-display font-bold text-center mb-2 tracking-wider">ANTIGRAVITY</h2>
                <p className="text-center text-gray-400 text-sm mb-8 font-mono">ACCESO DE ADMINISTRADOR (GOD MODE)</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">USUARIO</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Identificación"
                            />
                            <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">CLAVE DE ACCESO</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-mono text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
                    >
                        INICIAR SISTEMA
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
