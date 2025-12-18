import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from '../config/firebase';
import { ARCHETYPES } from '../data/archetypes';

const UserContext = createContext(null);

const DEFAULT_USER_TEMPLATE = {
    name: 'New User',
    archetype: 'guerrero',
    role: 'user',
    isNew: true, // Triggers onboarding

    // Biometrics
    weight: 0,
    height: 0,
    age: 0,
    gender: 'female',

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

    // Neural Biometrics (Mock Data for Readiness)
    hrv: 75, // ms
    sleepScore: 82, // 0-100
    restingHR: 62, // bpm

    // Bio-Hologram Data
    muscleFatigue: {
        chest: 0,
        back: 0,
        legs: 0,
        arms: 0,
        shoulders: 0,
        abs: 0
    },
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]); // For Admin Panel
    const [isLoading, setIsLoading] = useState(true);
    const [levelUpEvent, setLevelUpEvent] = useState(null);

    // ═══════════════════════════════════════════════════════════════
    // AUTH STATE LISTENER (PERSISTENCE) WITH SELF-HEALING ADMIN
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                let userData = { ...DEFAULT_USER_TEMPLATE, id: currentUser.uid, email: currentUser.email };
                if (docSnap.exists()) {
                    userData = { ...userData, ...docSnap.data() };
                }

                // SECURITY OVERRIDE: Enforce Admin for specific email matches
                // This ensures even if DB write failed previously, the code grants access and repairs DB
                if (currentUser.email === 'jucaalgo@admin.com') {
                    console.log('🛡️ SYSTEM: Super Admin Detected. Validating integrity...');
                    userData.role = 'admin';
                    userData.name = 'Juan Carlos';
                    userData.username = 'jucaalgo';

                    // Self-heal DB if role is missing or incorrect
                    if (!docSnap.exists() || docSnap.data().role !== 'admin') {
                        console.log('🛡️ SYSTEM: Repairing Admin Role in Database...');
                        try {
                            const adminProfile = {
                                ...DEFAULT_USER_TEMPLATE,
                                ...userData,
                                rank: 'System Administrator',
                                level: 99,
                                rankIcon: '🛡️',
                                lastActive: serverTimestamp()
                            };
                            await setDoc(docRef, adminProfile, { merge: true });
                        } catch (err) {
                            console.error('SYSTEM ERROR: Could not repair admin record', err);
                        }
                    }
                }

                setUser(userData);
            } else {
                setUser(null);
                setUsers([]); // Clear admin data
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // ADMIN: FETCH ALL USERS
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        if (user?.role === 'admin') {
            const q = query(collection(db, "users"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const usersList = [];
                querySnapshot.forEach((doc) => {
                    usersList.push({ id: doc.id, ...doc.data() });
                });
                setUsers(usersList);
            });
            return () => unsubscribe();
        }
    }, [user?.role]);

    // ═══════════════════════════════════════════════════════════════
    // SYNC TO FIRESTORE (AUTO-SAVE)
    // ═══════════════════════════════════════════════════════════════
    const saveData = async (newData) => {
        if (!user?.id) return;
        try {
            const userRef = doc(db, "users", user.id);
            await setDoc(userRef, { ...newData, lastActive: serverTimestamp() }, { merge: true });
            setUser(prev => ({ ...prev, ...newData }));
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════

    const registerUser = async (email, password, name, role = 'user') => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Create user document in Firestore
            const newUserData = {
                ...DEFAULT_USER_TEMPLATE,
                name,
                role,
                username: email.split('@')[0],
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, "users", uid), newUserData);
            return { success: true };
        } catch (error) {
            console.error("Registration invalid:", error);
            let msg = error.message;
            if (msg.includes('email-already-in-use')) msg = 'Este correo (o usuario) ya está registrado.';
            if (msg.includes('weak-password')) msg = 'La contraseña es muy débil (min 6 caracteres).';
            return { success: false, error: msg };
        }
    };

    const login = async (emailOrUsername, password) => {
        try {
            // SUPER ADMIN BACKDOOR / BYPASS
            let email = emailOrUsername;
            let isSuperAdmin = false;

            if (emailOrUsername === 'jucaalgo' && password === '13470811') {
                email = 'jucaalgo@admin.com';
                isSuperAdmin = true;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (authError) {
                // If Super Admin doesn't exist yet, create it automatically
                if (isSuperAdmin) {
                    // Check common errors suitable for "not found" scenario
                    if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/invalid-email') {
                        console.log("Creating Super Admin account...");
                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                            // Initial creation, listener will handle the rest (Self-Healing)
                            return { success: true };
                        } catch (createError) {
                            if (createError.code === 'auth/email-already-in-use') {
                                // Wait, if it's in use but login failed... maybe wrong password?
                                // We can't fix password here. We just return error.
                                return { success: false, error: 'Credenciales de ADMIN incorrectas. (Cuenta existe, contraseña incorrecta)' };
                            }
                            throw createError;
                        }
                    }
                }
                throw authError; // Rethrow if not super admin flow
            }

            return { success: true };
        } catch (error) {
            console.error("Login invalid:", error);
            let msg = 'Credenciales inválidas.';
            if (error.code === 'auth/too-many-requests') msg = 'Demasiados intentos falidos. Espere unos minutos.';
            return { success: false, error: msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // GAMEPLAY COMPOSABLES
    // ═══════════════════════════════════════════════════════════════

    const updateDailyStatus = (energy, stress, sleep) => {
        saveData({ energyLevel: energy, stressLevel: stress, sleepQuality: sleep });
    };

    const getCurrentArchetype = () => {
        if (!user) return ARCHETYPES.GUERRERO;
        return Object.values(ARCHETYPES).find(a => a.id === user.archetype) || ARCHETYPES.GUERRERO;
    };

    const addXP = (amount) => {
        if (!user) return;
        let newXP = user.xp + amount;
        let newLevel = user.level;
        let xpNeeded = user.xpToNextLevel;

        while (newXP >= xpNeeded) {
            newXP -= xpNeeded;
            newLevel++;
            xpNeeded = Math.floor(xpNeeded * 1.2);
        }

        const archetype = getCurrentArchetype();
        const newRank = `${archetype.name.split(' ')[0]} ${newLevel}`;

        if (newLevel > user.level) {
            setLevelUpEvent({ level: newLevel, rank: newRank });
        }

        saveData({ xp: newXP, level: newLevel, xpToNextLevel: xpNeeded, rank: newRank });
    };

    const completeWorkout = (durationMinutes, caloriesBurned) => {
        if (!user) return;
        const newTotalWorkouts = (user.totalWorkouts || 0) + 1;
        const newTotalMinutes = (user.totalMinutes || 0) + durationMinutes;
        const newCalories = (user.caloriesBurned || 0) + caloriesBurned;
        const newStreak = (user.currentStreak || 0) + 1;
        const newLongestStreak = Math.max((user.longestStreak || 0), newStreak);

        saveData({
            totalWorkouts: newTotalWorkouts,
            totalMinutes: newTotalMinutes,
            caloriesBurned: newCalories,
            currentStreak: newStreak,
            longestStreak: newLongestStreak
        });
        const baseXP = durationMinutes * 10;
        addXP(baseXP + 25);
    };

    const logFood = (calories, protein, carbs, fat) => {
        if (!user) return;
        saveData({
            todayCalories: (user.todayCalories || 0) + calories,
            todayProtein: (user.todayProtein || 0) + protein,
            todayCarbs: (user.todayCarbs || 0) + carbs,
            todayFat: (user.todayFat || 0) + fat
        });
        addXP(5);
    };

    const changeArchetype = (newArchetypeId) => {
        if (!user) return;
        const archetype = Object.values(ARCHETYPES).find(a => a.id === newArchetypeId);
        if (archetype) {
            saveData({
                archetype: newArchetypeId,
                rank: `${archetype.name.split(' ')[0]} ${user.level}`,
                rankIcon: archetype.icon
            });
        }
    };

    const updateApiKey = (key) => saveData({ customApiKey: key });

    const values = {
        user,
        users,
        isLoading,
        levelUpEvent,
        setLevelUpEvent,
        login,
        registerUser,
        logout,
        deleteUser,
        updateDailyStatus,
        getCurrentArchetype,
        addXP,
        completeWorkout,
        logFood,
        changeArchetype,
        updateApiKey,
        updateUserProfile: (uid, data) => saveData(data),
        getApiKey: () => user?.customApiKey || import.meta.env.VITE_GEMINI_API_KEY
    };

    return (
        <UserContext.Provider value={values}>
            {!isLoading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
