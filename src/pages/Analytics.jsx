import React, { useMemo } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, Activity, Dumbbell, Calendar, Target, Zap
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// Mock data generator for demo purposes
// In real app, this would come from user history
const generateMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Workout Frequency
    const activityData = months.map(month => ({
        name: month,
        workouts: Math.floor(Math.random() * 8) + 12,
        calories: Math.floor(Math.random() * 5000) + 8000
    }));

    // Muscle Distribution
    const muscles = [
        { name: 'Chest', value: 30, color: '#f59e0b' },
        { name: 'Back', value: 25, color: '#3b82f6' },
        { name: 'Legs', value: 35, color: '#10b981' },
        { name: 'Arms', value: 10, color: '#ec4899' },
    ];

    // Strength Progress (e.g. Squat Max)
    const strengthData = months.map((month, idx) => ({
        name: month,
        weight: 100 + (idx * 5) + Math.floor(Math.random() * 5)
    }));

    return { activityData, muscles, strengthData };
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3 rounded-xl border border-white/10">
                <p className="text-white font-bold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    const { user } = useUser();
    const data = useMemo(() => generateMockData(), []);

    return (
        <div className="p-6 space-y-6 min-h-screen pb-24">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    Performance Analytics
                </h1>
                <p className="text-white/60">Track your optimization metrics</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Total Workouts</span>
                    </div>
                    <div className="text-2xl font-bold text-white">42</div>
                    <div className="text-xs text-green-400">+12% vs last month</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-accent">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Volume</span>
                    </div>
                    <div className="text-2xl font-bold text-white">124<span className="text-sm text-white/50"> tons</span></div>
                </div>
                <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-warning">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Consistency</span>
                    </div>
                    <div className="text-2xl font-bold text-white">85%</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-secondary">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Best Lift</span>
                    </div>
                    <div className="text-2xl font-bold text-white">145<span className="text-sm text-white/50">kg</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="glass-panel p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Monthly Activity
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.activityData}>
                                <defs>
                                    <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="workouts"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWorkouts)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Muscle Distribution */}
                <div className="glass-panel p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-accent" />
                        Focus Distribution
                    </h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.muscles}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.muscles.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Strength Progress */}
                <div className="glass-panel p-6 rounded-3xl lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        Strength Progression (Compound Lifts)
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.strengthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
