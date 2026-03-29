import React, { useState, useEffect } from 'react';
import { fetchDiseaseDetails } from './apiService';
import { Info, BarChart3, FlaskConical, ShieldCheck, Activity, ChevronRight, AlertCircle, Heart, Stethoscope, ListChecks } from 'lucide-react';

export default function DiseaseDeepView({ category }) {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, parameters, protocols
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (category) {
            setLoading(true);
            fetchDiseaseDetails(category)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [category]);

    if (loading) return <div className="pulse-loading" style={{ height: '300px', borderRadius: '16px' }}></div>;
    if (!data || data.error) return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>Intelligence for "{category}" not found.</div>;

    return (
        <div className="disease-view fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '12px', borderRadius: '14px', color: 'white' }}>
                    <Heart size={24} />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>{data.name}</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deep Intelligence Layer enabled</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                {[
                    { id: 'overview', label: 'Overview', icon: Info },
                    { id: 'parameters', label: 'Clinical Parameters', icon: BarChart3 },
                    { id: 'progression', label: 'Progression', icon: Activity },
                    { id: 'protocols', label: 'Protocols', icon: ListChecks }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', 
                            border: 'none', background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content slide-up">
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                        <div>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Stethoscope size={18} color="var(--primary)"/> Definition</h4>
                            <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{data.definition}</p>
                            
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem' }}><FlaskConical size={18} color="var(--primary)"/> Primary Causes</h4>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
                                {data.causes.map(c => <li key={c} style={{ marginBottom: '6px' }}>{c}</li>)}
                            </ul>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} color="var(--primary)"/> Risk Factors</h4>
                            {data.risk_factors.map(rf => (
                                <div key={rf} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <ChevronRight size={14} color="var(--primary)" /> {rf}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'progression' && (
                    <div className="progression-timeline">
                        <h4 style={{ marginBottom: '2rem' }}>Condition Evolution Pathway</h4>
                        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', padding: '0 20px' }}>
                            <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', background: 'linear-gradient(to right, #16a34a, #eab308, #dc2626)', zIndex: 0 }}></div>
                            
                            {[
                                { label: 'Normal / Healthy', desc: 'Baseline clinical state', color: '#16a34a' },
                                { label: 'Pre-Condition', desc: 'Early markers detected', color: '#eab308' },
                                { label: 'Managed Diagnosis', desc: 'Active treatment cycle', color: '#f97316' },
                                { label: 'Advanced Stage', desc: 'Systemic involvement', color: '#dc2626' },
                                { label: 'Complications', desc: 'Acute secondary events', color: '#7f1d1d' }
                            ].map((step, idx) => (
                                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1 }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'white', border: `4px solid ${step.color}`, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: step.color, fontWeight: 800 }}>{idx+1}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{step.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '100px' }}>{step.desc}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <h5>🔍 Critical Transition Markers</h5>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                                The transition from <strong>Stage 2 (Pre-Condition)</strong> to <strong>Stage 3 (Managed Diagnosis)</strong> is where guideline drifts most commonly occur. 
                                Our system monitors for semantic shifts in threshold definitions to prevent late diagnosis.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'parameters' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin:0 }}>Standard Clinical Ranges</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reference: WHO/Global Standards</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.parameters.map(param => (
                                <div key={param.label} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderLeft: `5px solid ${param.color}` }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{param.label}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{param.range}</div>
                                    </div>
                                    <div style={{ width: '40px', height: '10px', borderRadius: '999px', backgroundColor: param.color }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'protocols' && (
                    <div>
                        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} /> Screening Guidelines</h4>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#15803d' }}>{data.screening}</p>
                        </div>
                        
                        <h4>Standard Treatment Protocols</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {data.protocols.map(p => (
                                <div key={p} className="glass-card" style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--primary)', border: '1px solid var(--primary-light)' }}>
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
