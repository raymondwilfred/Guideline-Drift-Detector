import React, { useEffect, useState } from 'react';
import { fetchDiffs } from './apiService';
import ComparisonView from './ComparisonView';
import ImpactChart from './ImpactChart';

export default function TimelineView({ guidelineId }) {
    const [diffs, setDiffs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (guidelineId) {
            setLoading(true);
            fetchDiffs(guidelineId).then(data => {
                setDiffs(data);
                setLoading(false);
            });
        }
    }, [guidelineId]);

    if (loading) return <p style={{ color: '#64748b' }}>Loading drift timeline...</p>;
    if (!diffs || !diffs.length) return <p style={{ color: '#64748b' }}>No drift data available for this guideline.</p>;

    return (
        <div className="timeline-view">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Drift Timeline & Semantic Updates</h2>
            <ImpactChart diffs={diffs} />
            
            <div className="diff-list" style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '15px' }}>Detailed Changes</h3>
                {diffs.map(diff => (
                    <ComparisonView key={diff.id} diff={diff} />
                ))}
            </div>
        </div>
    );
}
