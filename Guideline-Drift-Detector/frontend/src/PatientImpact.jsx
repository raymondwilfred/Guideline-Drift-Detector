import React, { useEffect, useState } from 'react';
import { fetchImpactSimulation } from './apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Users, Target, Loader2, ShieldAlert } from 'lucide-react';

export default function PatientImpact({ diffId }) {
    const [impactData, setImpactData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (diffId) {
            setLoading(true);
            fetchImpactSimulation(diffId).then(data => {
                setImpactData(data);
                setLoading(false);
            });
        }
    }, [diffId]);

    if (loading) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="lucide-spin" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', fontWeight: 500 }}>Running Digital Twin population models...</p>
        </div>
    );

    if (!impactData || impactData.error) return null;

    const COLORS = ['#cbd5e1', '#fbbf24', '#ef4444'];

    return (
        <div className="glass-card" style={{ padding: '2rem', animation: 'slideUp 0.6s ease-out forwards', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    <Users size={28} color="var(--primary)" /> Patient Impact Simulation 
                </h2>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fffbeb', color: '#d97706', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fde68a', fontWeight: 600 }}>
                    <ShieldAlert size={14} /> ETHICAL AI SAFEGUARD: Clinical Guidance Only
                </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Simulating guideline shifts across a baseline clinical cohort of <strong>{impactData.total_cohort_simulated.toLocaleString()}</strong> virtual patients.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Patients Impacted</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{impactData.patients_newly_eligible.toLocaleString()}</span>
                    </div>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Cohort Shift %</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626' }}>+{impactData.impact_percentage}%</span>
                    </div>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Clinical Direction</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', marginTop: '10px' }}>
                        <Target size={18} color="#059669" /> {impactData.risk_shift}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demographic Vulnerability (Age)</h3>
                    <div style={{ width: '100%', height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={impactData.demographics_age} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="impacted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient Reclassification Tracker</h3>
                    <div style={{ width: '100%', height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={impactData.reclassification}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="patients"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                >
                                    {impactData.reclassification.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
