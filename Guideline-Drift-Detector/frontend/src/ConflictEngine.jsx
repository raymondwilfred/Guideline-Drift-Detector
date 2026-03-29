import React, { useEffect, useState } from 'react';
import { fetchConflicts } from './apiService';
import { Network, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ConflictEngine() {
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConflicts().then(data => {
            setConflicts(data || []);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Scanning global guidelines for contradictions...</p>
        </div>
    );

    return (
        <div className="glass-card" style={{ padding: '2rem', animation: 'fadeIn 0.6s ease-out' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                <Network size={28} color="#8b5cf6" /> Multi-Guideline Conflict Engine
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Detecting contradictions across different organizational bodies (e.g. WHO vs NICE).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {conflicts.map(conflict => (
                    <div key={conflict.id} style={{ 
                        border: '1px solid var(--card-border)', 
                        borderRadius: 'var(--radius-lg)', 
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ 
                            padding: '1rem 1.5rem', 
                            backgroundColor: conflict.severity === 'High' ? '#fef2f2' : '#fffbeb',
                            borderBottom: '1px solid var(--card-border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                                    {conflict.disease_category} Conflict
                                </span>
                                <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {conflict.severity === 'High' ? <ShieldAlert size={18} color="#dc2626"/> : <AlertCircle size={18} color="#d97706"/>}
                                    {conflict.conflict_type}
                                </h3>
                            </div>
                            <span className={`badge ${conflict.severity === 'High' ? 'badge-critical' : 'badge-moderate'}`}>
                                {conflict.severity} Severity
                            </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--card-border)' }}>
                            <div style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
                                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>{conflict.org_1}</div>
                                <div style={{ fontSize: '1rem', color: '#0f172a', lineHeight: 1.6, paddingLeft: '1rem', borderLeft: '3px solid #cbd5e1' }}>
                                    {conflict.org_1_rule}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
                                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>{conflict.org_2}</div>
                                <div style={{ fontSize: '1rem', color: '#0f172a', lineHeight: 1.6, paddingLeft: '1rem', borderLeft: '3px solid #cbd5e1' }}>
                                    {conflict.org_2_rule}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--card-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <CheckCircle2 size={20} color="#059669" style={{ marginTop: '2px' }} />
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Resolution Advice</strong>
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{conflict.resolution_advice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
