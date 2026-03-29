import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, ShieldAlert, CheckCircle2, SplitSquareHorizontal, Users } from 'lucide-react';
import PatientImpact from './PatientImpact';

export default function ComparisonView({ diff }) {
    const [showImpact, setShowImpact] = useState(false);

    const getRiskConfig = (risk) => {
        if (risk === 'Critical') return { bg: 'var(--danger-bg)', border: 'var(--danger-border)', text: 'var(--danger-text)', icon: <ShieldAlert size={16} /> };
        if (risk === 'Moderate') return { bg: 'var(--warning-bg)', border: 'var(--warning-border)', text: 'var(--warning-text)', icon: <AlertTriangle size={16} /> };
        return { bg: 'var(--success-bg)', border: 'var(--success-border)', text: 'var(--success-text)', icon: <CheckCircle2 size={16} /> };
    };

    const config = getRiskConfig(diff.risk_level);

    return (
        <div className="glass-card" style={{ 
            padding: '1.5rem', 
            marginBottom: '1.5rem', 
            borderLeft: `4px solid ${config.text}`,
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <SplitSquareHorizontal size={20} color="var(--primary)" />
                    {diff.change_type}
                </h3>
                <span className={`badge`} style={{ backgroundColor: config.bg, color: config.text, border: `1px solid ${config.border}` }}>
                    {config.icon} Risk: {diff.risk_level}
                </span>
            </div>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Explanation</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{diff.explanation}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--card-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#fff' }}>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous Strategy</p>
                    <div className="diff-removed" style={{ padding: '1rem', borderRadius: '4px', margin: 0, fontSize: '0.95rem' }}>
                        - {diff.old_text_snippet || "N/A"}
                    </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#fff' }}>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Recommendation</p>
                    <div className="diff-added" style={{ padding: '1rem', borderRadius: '4px', margin: 0, fontSize: '0.95rem' }}>
                        + {diff.new_text_snippet || "N/A"}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button 
                    onClick={() => setShowImpact(!showImpact)}
                    style={{
                        background: showImpact ? 'var(--bg-color)' : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                        color: showImpact ? 'var(--text-muted)' : 'white',
                        border: showImpact ? '1px solid var(--card-border)' : 'none',
                        padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: showImpact ? 'none' : '0 4px 10px -2px rgba(59,130,246,0.3)',
                        transition: 'all 0.2s', width: '100%', justifyContent: 'center'
                    }}
                >
                    <Users size={18} /> {showImpact ? 'Hide Simulation' : 'Run Patient Impact Simulation'}
                </button>
            </div>

            {showImpact && (
                <div style={{ marginTop: '1.5rem' }}>
                    <PatientImpact diffId={diff.id} />
                </div>
            )}
        </div>
    );
}
