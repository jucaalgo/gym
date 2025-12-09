import React, { createContext, useContext, useState, useEffect } from 'react';
import { ARCHETYPES } from '../data/archetypes';

const UserContext = createContext(null);

// Default Admin Credentials (in a real app, this would be secure)
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123'
};

const DEFAULT_USER_TEMPLATE = {
    id: '',
    username: '',
    password: '',
    name: 'New User',
    archetype: 'guerrero',
    role: 'user', // 'user' or 'admin'
    isNew: true, // Triggers onboarding

    // Biometrics
    weight: 0,
    height: 0,
    age: 0,
    gender: 'female', // Defaulting to female as requested (60%) or neutral

    // Daily Status
    energyLevel: 7,
    stressLevel: 4,
    sleepQuality: 7,
    injuries: [],

    // Time constraints
    timeAvailable: 45,

    // Gamification
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    rank: 'Iniciado',
    rankIcon: '🌱',

    // Streaks
    currentStreak: 0,
    longestStreak: 0,

    // Stats
    totalWorkouts: 0,
    totalMinutes: 0,
    caloriesBurned: 0,

    // Nutrition (Today)
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFat: 0,
    calorieGoal: 2000,

    // Achievements
    achievements: [],
};

const DB_KEY = 'antigravity_db_v2';

export const UserProvider = ({ children }) => {
    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    // Database State (All Users)
    const [db, setDb] = useState(() => {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { users: [] };
            }
        }
        return { users: [] };
    });

    // Current Session State
    const [user, setUser] = useState(() => {
        const savedSession = localStorage.getItem('antigravity_session_user');
        if (savedSession) {
            try {
                return JSON.parse(savedSession);
            } catch {
                return null;
            }
        }
        return null;
    });
    const [levelUpEvent, setLevelUpEvent] = useState(null);

    // Save DB whenever it changes
    useEffect(() => {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }, [db]);

    // Save Current User to DB whenever it changes (auto-save progress)
    // AND update session storage
    useEffect(() => {
        if (user && db.users && user.role !== 'admin') {
            setDb(prev => ({
                ...prev,
                users: prev.users.map(u => u.id === user.id ? user : u)
            }));
            localStorage.setItem('antigravity_session_user', JSON.stringify(user));
        } else if (user && user.role === 'admin') {
            localStorage.setItem('antigravity_session_user', JSON.stringify(user));
        }
    }, [user]);

    // ═══════════════════════════════════════════════════════════════
    // AUTHENTICATION
    // ═══════════════════════════════════════════════════════════════

    const login = (username, password, role = 'user') => {
        if (role === 'admin') {
            if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
                // Admin "ghost" user
                const adminUser = {
                    ...DEFAULT_USER_TEMPLATE,
                    id: 'admin',
                    name: 'Administrator',
                    role: 'admin',
                    archetype: 'master'
                };
                setUser(adminUser);
                localStorage.setItem('antigravity_admin', 'true');
                return { success: true };
            }
            return { success: false, error: 'Credenciales de administrador inválidas' };
        } else {
            const foundUser = db.users.find(u => u.username === username && u.password === password);
            if (foundUser) {
                setUser(foundUser);
                localStorage.removeItem('antigravity_admin');
                return { success: true };
            }
            return { success: false, error: 'Usuario o contraseña incorrectos' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('antigravity_admin');
        localStorage.removeItem('antigravity_session_user');
    };

    // ═══════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    const registerUser = (username, password, name, type = 'user') => {
        const exists = db.users.some(u => u.username === username);
        if (exists) return { success: false, error: 'El nombre de usuario ya existe' };

        const newUser = {
            ...DEFAULT_USER_TEMPLATE,
            id: crypto.randomUUID(),
            username,
            password,
            name,
            role: type
        };

        setDb(prev => ({
            ...prev,
            users: [...prev.users, newUser]
        }));

        return { success: true, user: newUser };
    };

    const deleteUser = (userId) => {
        setDb(prev => ({
            ...prev,
            users: prev.users.filter(u => u.id !== userId)
        }));
    };

    const resetUserPassword = (userId, newPassword) => {
        setDb(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === userId ? { ...u, password: newPassword } : u)
        }));
    };

    // Update specific user (Admin use)
    const updateUserProfile = (userId, updates) => {
        setDb(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u)
        }));
        // If updating current user, update state too
        if (user && user.id === userId) {
            setUser(prev => ({ ...prev, ...updates }));
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // GAMEPLAY FUNCTIONS (Work on 'user' state)
    // ═══════════════════════════════════════════════════════════════

    const getCurrentArchetype = () => {
        if (!user) return ARCHETYPES.GUERRERO;
        return Object.values(ARCHETYPES).find(a => a.id === user.archetype) || ARCHETYPES.GUERRERO;
    };

    const updateDailyStatus = (energy, stress, sleep) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            energyLevel: energy,
            stressLevel: stress,
            sleepQuality: sleep,
        }));
    };

    const addXP = (amount) => {
        if (!user) return;
        setUser(prev => {
            let newXP = prev.xp + amount;
            let newLevel = prev.level;
            let xpNeeded = prev.xpToNextLevel;

            while (newXP >= xpNeeded) {
                newXP -= xpNeeded;
                newLevel++;
                xpNeeded = Math.floor(xpNeeded * 1.2);
            }

            const archetype = getCurrentArchetype();
            const newRank = `${archetype.name.split(' ')[0]} ${newLevel}`;

            if (newLevel > prev.level) {
                setLevelUpEvent({ level: newLevel, rank: newRank });
            }

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                xpToNextLevel: xpNeeded,
                rank: newRank,
                rankIcon: archetype.icon,
            };
        });
    };

    const completeWorkout = (durationMinutes, caloriesBurned) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            totalWorkouts: prev.totalWorkouts + 1,
            totalMinutes: prev.totalMinutes + durationMinutes,
            caloriesBurned: prev.caloriesBurned + caloriesBurned,
            currentStreak: prev.currentStreak + 1,
            longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        }));
        const baseXP = durationMinutes * 10;
        const streakBonus = user.currentStreak >= 7 ? 50 : 25;
        addXP(baseXP + streakBonus);
    };

    const logFood = (calories, protein, carbs, fat) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            todayCalories: prev.todayCalories + calories,
            todayProtein: prev.todayProtein + protein,
            todayCarbs: prev.todayCarbs + carbs,
            todayFat: prev.todayFat + fat,
        }));
        addXP(5);
    };

    const changeArchetype = (newArchetypeId) => {
        if (!user) return;
        const archetype = Object.values(ARCHETYPES).find(a => a.id === newArchetypeId);
        if (archetype) {
            setUser(prev => ({
                ...prev,
                archetype: newArchetypeId,
                rank: `${archetype.name.split(' ')[0]} ${prev.level}`,
                rankIcon: archetype.icon,
            }));
        }
    };

    const setTimeAvailable = (minutes) => {
        if (!user) return;
        setUser(prev => ({ ...prev, timeAvailable: minutes }));
    };

    const setActiveRoutine = (id) => {
        if (!user) return;
        setUser(prev => ({ ...prev, activeRoutineId: id }));
    };

    // Derived values
    const value = {
        user, // Current active user
        users: db.users, // All users List (for Admin)
        levelUpEvent,
        setLevelUpEvent,

        // Auth
        login,
        logout,

        // Admin
        registerUser,
        deleteUser,
        resetUserPassword,
        updateUserProfile,

        // Gameplay
        getCurrentArchetype,
        updateDailyStatus,
        addXP,
        completeWorkout,
        logFood,
        changeArchetype,
        setTimeAvailable,
        resetDailyStats: () => { }, // Todo implementations
        setActiveRoutine
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
