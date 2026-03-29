import React from 'react';

export default function ComparisonView({ diff }) {
    const getRiskColor = (risk) => {
        if (risk === 'Critical') return { bg: '#fee2e2', border: '#fca5a5' };
        if (risk === 'Moderate') return { bg: '#fef3c7', border: '#fcd34d' };
        return { bg: '#dcfce7', border: '#86efac' };
    };

    const colors = getRiskColor(diff.risk_level);

    return (
        <div className="comparison-view" style={{ 
            border: `1px solid ${colors.border}`, 
            padding: '20px', 
            marginBottom: '20px', 
            borderRadius: '12px',
            backgroundColor: colors.bg
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{diff.change_type}</h3>
                <span style={{ 
                    fontWeight: 'bold', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    color: '#334155'
                }}>
                    Risk: {diff.risk_level}
                </span>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
                <strong>AI Explanation:</strong>
                <p style={{ margin: '8px 0 0 0', lineHeight: 1.5 }}>{diff.explanation}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div className="code-block" style={{ flex: 1, backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#ef4444', fontSize: '0.9rem' }}>Old Recommendation</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#475569' }}>{diff.old_text_snippet}</p>
                </div>
                <div className="code-block" style={{ flex: 1, backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#22c55e', fontSize: '0.9rem' }}>New Recommendation</p>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#475569' }}>{diff.new_text_snippet}</p>
                </div>
            </div>
        </div>
    );
}
