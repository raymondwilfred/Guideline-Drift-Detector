import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImpactChart({ diffs }) {
    if (!diffs || diffs.length === 0) return null;

    const criticalCount = diffs.filter(d => d.risk_level === 'Critical').length;
    const moderateCount = diffs.filter(d => d.risk_level === 'Moderate').length;
    const minorCount = diffs.filter(d => d.risk_level === 'Minor').length;

    const data = [
        { name: 'Critical', value: criticalCount, color: '#dc2626' },
        { name: 'Moderate', value: moderateCount, color: '#d97706' },
        { name: 'Minor', value: minorCount, color: '#16a34a' }
    ].filter(d => d.value > 0);

    return (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} className="text-muted" /> Impact Assessment
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: '200px', height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="stat-item" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--danger-text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldAlert size={18} /> Critical Risk
                            </span>
                            <strong style={{ color: 'var(--danger-text)', fontSize: '1.25rem' }}>{criticalCount}</strong>
                        </div>
                    </div>
                    <div className="stat-item" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--warning-text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={18} /> Moderate Risk
                            </span>
                            <strong style={{ color: 'var(--warning-text)', fontSize: '1.25rem' }}>{moderateCount}</strong>
                        </div>
                    </div>
                    <div className="stat-item" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--success-text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle2 size={18} /> Minor Checks
                            </span>
                            <strong style={{ color: 'var(--success-text)', fontSize: '1.25rem' }}>{minorCount}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
