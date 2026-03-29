import React, { useState, useEffect } from 'react';
import { fetchComparison } from './apiService';
import { GitCompare, AlertTriangle, CheckCircle2, Info, ChevronRight, Scale, ShieldAlert, ArrowRightLeft } from 'lucide-react';

export default function ComparisonEngine({ guidelines = [] }) {
    const [selection, setSelection] = useState({ g1: '', g2: '' });
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompare = async () => {
        if (!selection.g1 || !selection.g2) return;
        setLoading(true);
        const data = await fetchComparison(selection.g1, selection.g2);
        setComparison(data);
        setLoading(false);
    };

    return (
        <div className="comparison-engine fade-in">
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: 'white' }}>
                        <GitCompare size={24} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>Multi-Guideline Contrast Engine</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Detect clinical conflicts across different organizational standards.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Source Standard A</label>
                        <select 
                            value={selection.g1} 
                            onChange={(e) => setSelection({...selection, g1: e.target.value})}
                            className="category-select"
                            style={{ width: '100%' }}
                        >
                            <option value="">Select Guideline...</option>
                            {guidelines.map(g => <option key={g.id} value={g.id}>{g.title} ({g.organization})</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Source Standard B</label>
                        <select 
                            value={selection.g2} 
                            onChange={(e) => setSelection({...selection, g2: e.target.value})}
                            className="category-select"
                            style={{ width: '100%' }}
                        >
                            <option value="">Select Guideline...</option>
                            {guidelines.map(g => <option key={g.id} value={g.id}>{g.title} ({g.organization})</option>)}
                        </select>
                    </div>
                    <button 
                        onClick={handleCompare}
                        disabled={!selection.g1 || !selection.g2 || loading}
                        className="btn-primary"
                        style={{ height: '42px', padding: '0 2rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? 'Analyzing...' : <><ArrowRightLeft size={18}/> Compare</>}
                    </button>
                </div>
            </div>

            {comparison && (
                <div className="comparison-results slide-up">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Standard A</div>
                            <h3 style={{ margin: 0 }}>{comparison.g1.title}</h3>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{comparison.g1.org}</div>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Standard B</div>
                            <h3 style={{ margin: 0 }}>{comparison.g2.title}</h3>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{comparison.g2.org}</div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={20} color="var(--primary)"/> Identified Conflicts & Discrepancies
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comparison.conflicts.map((c, i) => (
                                <div key={i} style={{ border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: '#f8fafc', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)' }}>
                                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Scale size={16} color="var(--primary)"/> {c.parameter}
                                        </div>
                                        <div style={{ 
                                            padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800,
                                            backgroundColor: c.severity === 'Critical' ? '#fee2e2' : '#fef9c3',
                                            color: c.severity === 'Critical' ? '#dc2626' : '#a16207'
                                        }}>
                                            {c.severity} Severity
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--card-border)' }}>
                                        <div style={{ padding: '20px', backgroundColor: 'white' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Standard A Value</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{c.g1_value}</div>
                                        </div>
                                        <div style={{ padding: '20px', backgroundColor: 'white' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Standard B Value</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{c.g2_value}</div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '15px 20px', backgroundColor: '#f0f9ff', color: '#0369a1', fontSize: '0.9rem', display: 'flex', gap: '10px' }}>
                                        <Info size={18} style={{ flexShrink: 0 }}/>
                                        <div><strong>Clinical Impact:</strong> {c.clinical_note}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
