import React, { useEffect, useState } from 'react';
import { fetchStats, fetchGuidelines } from './apiService';
import TimelineView from './TimelineView';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [guidelines, setGuidelines] = useState([]);
    const [selectedGuideline, setSelectedGuideline] = useState(null);

    useEffect(() => {
        fetchStats().then(setStats);
        fetchGuidelines().then(setGuidelines);
    }, []);

    return (
        <div className="dashboard" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Medical Guideline Diff & Drift Detector</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Tracking semantic changes and emerging patterns in public health recommendations.</p>
            
            {stats && (
                <div className="stats-cards" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                    <div className="card" style={{ flex: 1, padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0, color: '#64748b' }}>Total Guidelines</h3>
                        <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_guidelines}</p>
                    </div>
                    <div className="card" style={{ flex: 1, padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0, color: '#64748b' }}>Total Detected Diffs</h3>
                        <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_diffs}</p>
                    </div>
                    <div className="card" style={{ flex: 1, padding: '20px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                        <h3 style={{ margin: 0, color: '#dc2626' }}>Critical Changes</h3>
                        <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c' }}>{stats.critical_changes}</p>
                    </div>
                </div>
            )}
            
            <div className="layout" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <div className="guideline-list" style={{ flex: 1, minWidth: '300px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Monitored Guidelines</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {guidelines.map(g => (
                            <li 
                                key={g.id} 
                                onClick={() => setSelectedGuideline(g.id)} 
                                style={{ 
                                    cursor: 'pointer', 
                                    padding: '15px', 
                                    borderRadius: '8px',
                                    border: selectedGuideline === g.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                                    margin: '0 0 10px 0',
                                    background: selectedGuideline === g.id ? '#eff6ff' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>{g.title}</strong> 
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{g.organization} - Latest: {g.latest_version}</span>
                            </li>
                        ))}
                        {guidelines.length === 0 && <p style={{ color: '#94a3b8' }}>No guidelines found in database.</p>}
                    </ul>
                </div>
                <div className="guideline-details" style={{ flex: 2 }}>
                    {selectedGuideline ? (
                        <TimelineView guidelineId={selectedGuideline} />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                            <p>Select a guideline from the menu to view its changes over time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
