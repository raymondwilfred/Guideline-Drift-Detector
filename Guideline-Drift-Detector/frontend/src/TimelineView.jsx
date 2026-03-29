import React, { useEffect, useState } from 'react';
import { fetchDiffs } from './apiService';
import ComparisonView from './ComparisonView';
import ImpactChart from './ImpactChart';
import { History, GitCommit, Loader2 } from 'lucide-react';

export default function TimelineView({ guidelineId }) {
    const [diffs, setDiffs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (guidelineId) {
            setLoading(true);
            fetchDiffs(guidelineId).then(data => {
                setDiffs(data || []);
                setLoading(false);
            }).catch(e => {
                console.error(e);
                setDiffs([]);
                setLoading(false);
            });
        }
    }, [guidelineId]);

    if (loading) return (
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
            <Loader2 size={32} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p>Analyzing semantic drift timeline...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    
    if (!diffs || !diffs.length) return (
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
            <History size={48} opacity={0.5} />
            <p>No drift data available for this guideline version.</p>
        </div>
    );

    return (
        <div className="timeline-view fade-in" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <History size={24} color="var(--primary)" /> Drift Timeline & Semantic Updates
            </h2>
            
            <ImpactChart diffs={diffs} />
            
            <div className="diff-list" style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <GitCommit size={18} /> Detailed Change Log
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {diffs.map(diff => (
                        <ComparisonView key={diff.id} diff={diff} />
                    ))}
                </div>
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
