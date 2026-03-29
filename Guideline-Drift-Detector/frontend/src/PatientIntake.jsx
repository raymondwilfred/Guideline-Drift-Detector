import React, { useState } from 'react';
import { analyzePatientData as analyzePatient, simulateSwap, fetchAIRationale } from './apiService';
import { Activity, User, CheckCircle, AlertCircle, ShieldCheck, Microscope, Zap, Brain, RefreshCw, BarChart3, ChevronDown, ChevronUp, Clipboard, Plus, Trash2 } from 'lucide-react';

export default function PatientIntake() {
    const [patient, setPatient] = useState({
        name: '',
        age: '',
        symptoms: [],
        vitals: { bp_systolic: '', blood_sugar: '' },
        history: []
    });
    
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rationale, setRationale] = useState(null);
    const [simulation, setSimulation] = useState(null);
    const [showRationale, setShowRationale] = useState(false);
    const [newSymptom, setNewSymptom] = useState('');
    const [newHistory, setNewHistory] = useState('');

    const handleSymptomAdd = () => {
        if (newSymptom && !patient.symptoms.includes(newSymptom)) {
            setPatient({...patient, symptoms: [...patient.symptoms, newSymptom]});
            setNewSymptom('');
        }
    };
    const handleHistoryAdd = () => {
        if (newHistory && !patient.history.includes(newHistory)) {
            setPatient({...patient, history: [...patient.history, newHistory]});
            setNewHistory('');
        }
    };

    const handleGetRationale = async () => {
        if (!analysis) return;
        try {
            const res = await fetchAIRationale(patient, analysis.risk_level);
            setRationale(res);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSimulateSwap = async (targetId) => {
        if (!targetId || !analysis) return;
        try {
            const res = await simulateSwap(patient, analysis.risk_level, targetId);
            setSimulation(res);
        } catch (e) {
            console.error(e);
        }
    };

    const loadExample = () => {
        setPatient({
            name: 'Robert Smith',
            age: '62',
            symptoms: ['Chest Pain', 'Dizziness', 'Shortness of breath'],
            vitals: { bp_systolic: '155', blood_sugar: '210' },
            history: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol']
        });
        setAnalysis(null);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const result = await analyzePatient({
                ...patient,
                age: patient.age ? parseInt(patient.age) : null,
                vitals: {
                    bp_systolic: patient.vitals.bp_systolic ? parseFloat(patient.vitals.bp_systolic) : 0,
                    blood_sugar: patient.vitals.blood_sugar ? parseFloat(patient.vitals.blood_sugar) : 0
                }
            });
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-grid" style={{ gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                    <Clipboard color="var(--primary)" /> Smart EMR Intake
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Patient Name</label>
                            <input 
                                type="text" className="search-input" style={{ paddingLeft: '15px' }} placeholder="John Doe"
                                value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Age</label>
                            <input 
                                type="number" className="search-input" style={{ paddingLeft: '15px' }} placeholder="45"
                                value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Vital Signs</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input 
                                type="number" className="search-input" style={{ paddingLeft: '15px' }} placeholder="Systolic BP (mmHg)"
                                value={patient.vitals.bp_systolic} onChange={e => setPatient({...patient, vitals: {...patient.vitals, bp_systolic: e.target.value}})}
                            />
                            <input 
                                type="number" className="search-input" style={{ paddingLeft: '15px' }} placeholder="Blood Sugar (mg/dL)"
                                value={patient.vitals.blood_sugar} onChange={e => setPatient({...patient, vitals: {...patient.vitals, blood_sugar: e.target.value}})}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Active Symptoms</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input 
                                type="text" className="search-input" style={{ paddingLeft: '15px' }} placeholder="e.g. Dizziness" 
                                value={newSymptom} onChange={e => setNewSymptom(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSymptomAdd()}
                            />
                            <button onClick={handleSymptomAdd} style={{ padding: '0 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Plus size={20} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {patient.symptoms.map(s => (
                                <span key={s} style={{ backgroundColor: '#eff6ff', color: 'var(--primary)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {s} <Trash2 size={14} style={{ cursor: 'pointer' }} onClick={() => setPatient({...patient, symptoms: patient.symptoms.filter(x => x !== s)})} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Medical History (Chronic Conditions)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input 
                                type="text" className="search-input" style={{ paddingLeft: '15px' }} placeholder="e.g. Type 2 Diabetes" 
                                value={newHistory} onChange={e => setNewHistory(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleHistoryAdd()}
                            />
                            <button onClick={handleHistoryAdd} style={{ padding: '0 1rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Plus size={20} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {patient.history.map(h => (
                                <span key={h} style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {h} <Trash2 size={14} style={{ cursor: 'pointer' }} onClick={() => setPatient({...patient, history: patient.history.filter(x => x !== h)})} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={handleAnalyze} disabled={loading}
                            style={{ flex: 3, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {loading ? 'Analyzing Clinical Context...' : <>Generate Predictive Analysis <Activity size={20} /></>}
                        </button>
                        <button 
                            onClick={loadExample}
                            style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: 'var(--text-muted)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Load Pro Demo
                        </button>
                    </div>
                </div>
            </div>

            <div className="sidebar-sticky">
                {analysis ? (
                    <div className="glass-card" style={{ padding: '2rem', animation: 'slideUp 0.4s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Intelligent Report</h3>
                            <div style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: analysis.risk_level === 'High' ? '#fee2e2' : '#f0fdf4', color: analysis.risk_level === 'High' ? '#dc2626' : '#16a34a', fontWeight: 700, fontSize: '0.8rem' }}>
                                {analysis.risk_level} RISK
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Profile Completeness</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{analysis.completeness_score}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${analysis.completeness_score}%`, backgroundColor: 'var(--primary)', transition: 'width 1s ease-in-out' }} />
                            </div>
                        </div>

                        {analysis.missing_data.length > 0 && (
                            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertCircle size={16} /> DATA GAP DETECTED
                                </p>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#92400e' }}>
                                    {analysis.missing_data.map(m => <li key={m}>Missing: {m}</li>)}
                                </ul>
                            </div>
                        )}

                        {analysis.alerts.map(a => (
                            <div key={a} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>
                                {a}
                            </div>
                        ))}

                        {analysis.follow_ups.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>CONTEXTUAL FOLLOW-UPS</p>
                                {analysis.follow_ups.map(f => (
                                    <div key={f} style={{ padding: '10px', backgroundColor: '#f8fafc', borderLeft: '3px solid var(--primary)', marginBottom: '8px', fontSize: '0.85rem' }}>{f}</div>
                                ))}
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>CLINICAL SUGGESTIONS</p>
                            {analysis.suggestions.map(s => (
                                <div key={s} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', marginBottom: '6px' }}>
                                    <CheckCircle size={16} color="#16a34a" /> {s}
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>AI RATIONALE CONSOLE</p>
                                <button 
                                    onClick={handleGetRationale}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    {rationale ? <RefreshCw size={14}/> : <Brain size={14}/>} {rationale ? 'Refresh Rationale' : 'Generate AI Rationale'}
                                </button>
                            </div>
                            
                            {rationale && (
                                <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #bae6fd', animation: 'fadeIn 0.3s' }}>
                                    {rationale.rationale.map((line, i) => (
                                        <p key={i} style={{ fontSize: '0.8rem', color: '#0369a1', margin: '0 0 8px 0', lineHeight: 1.5 }}>• {line}</p>
                                    ))}
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0f2fe', paddingTop: '8px' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#0ea5e9' }}>AI Confidence: {(rationale.confidence_score * 100).toFixed(0)}%</span>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {rationale.source_references.map(s => <span key={s} style={{ fontSize: '0.65rem', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>TREATMENT PARADOX SIMULATOR (SWAP)</p>
                            <select 
                                onChange={(e) => handleSimulateSwap(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.85rem', marginBottom: '1rem' }}
                            >
                                <option value="">Select Target Standard...</option>
                                <option value="1">WHO Diabetes Upgrade (2024)</option>
                                <option value="2">NICE Hypertension Stricter (2023)</option>
                            </select>

                            {simulation && (
                                <div style={{ padding: '15px', borderRadius: '12px', backgroundColor: simulation.simulated_risk === 'High' ? '#fef2f2' : '#f0fdf4', border: '1px solid var(--card-border)', animation: 'slideUp 0.3s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Simulated Result:</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: simulation.simulated_risk === 'High' ? '#dc2626' : '#16a34a' }}>{simulation.simulated_risk} RISK</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{simulation.reclassification}</div>
                                    {simulation.delta > 0 && <div style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '4px' }}>+Risk Sensitivity Increased by {simulation.delta}%</div>}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={() => window.alert("Generating Official Clinical Checklist Based on Guidelines...")}
                                className="btn-primary" 
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <ShieldCheck size={20} /> Generate Clinical Checklist
                            </button>
                            <button 
                                className="btn-secondary" 
                                style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Microscope size={18} /> Order Lab Panel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ShieldCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>Complete the intake form to trigger the <strong>CCI Automated Inference Layer</strong>.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
