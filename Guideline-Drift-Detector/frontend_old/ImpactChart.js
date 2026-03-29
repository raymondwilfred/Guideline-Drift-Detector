import React from 'react';

export default function ImpactChart({ diffs }) {
    const criticalCount = diffs.filter(d => d.risk_level === 'Critical').length;
    const moderateCount = diffs.filter(d => d.risk_level === 'Moderate').length;
    const minorCount = diffs.filter(d => d.risk_level === 'Minor').length;
    
    return (
        <div className="impact-chart" style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '1.1rem' }}>Overall Update Impact Assessment</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, padding: '10px 15px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#991b1b', fontWeight: 'bold' }}>Critical Risk</span>
                    <strong style={{ color: '#7f1d1d' }}>{criticalCount} changes</strong>
                </div>
                <div style={{ flex: 1, padding: '10px 15px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#92400e', fontWeight: 'bold' }}>Moderate Risk</span>
                    <strong style={{ color: '#78350f' }}>{moderateCount} changes</strong>
                </div>
                <div style={{ flex: 1, padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#166534', fontWeight: 'bold' }}>Minor Checks</span>
                    <strong style={{ color: '#14532d' }}>{minorCount} changes</strong>
                </div>
            </div>
        </div>
    );
}
