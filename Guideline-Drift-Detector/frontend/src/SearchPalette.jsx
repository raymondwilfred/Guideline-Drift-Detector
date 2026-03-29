import React, { useEffect, useState, useRef } from 'react';
import { Search, Command, FileText, ChevronRight, BrainCircuit, Activity } from 'lucide-react';

export default function SearchPalette({ guidelines = [], onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    const diseases = [
        "Hypertension", "Diabetes", "Asthma", "Stroke", "Alzheimer's", 
        "COPD", "Anemia", "CKD", "Atrial Fibrillation", "CVD"
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        } else {
            setQuery('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredGuidelines = (guidelines || []).filter(g => 
        g.title.toLowerCase().includes(query.toLowerCase()) || 
        g.organization.toLowerCase().includes(query.toLowerCase())
    ).map(g => ({ id: g.id, type: 'Guideline', text: g.title, subtext: g.organization }));

    const filteredDiseases = diseases.filter(d => 
        d.toLowerCase().includes(query.toLowerCase())
    ).map(d => ({ id: d, type: 'Disease', text: `Deep Intelligence: ${d}`, subtext: 'Pathophysiology & Protocols' }));

    const results = [...filteredGuidelines, ...filteredDiseases];

    const handleSelect = (item) => {
        if (onSelect) onSelect(item.id, item.type);
        setIsOpen(false);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '15vh',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setIsOpen(false)}>
            <div 
                style={{ 
                    width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-color)', 
                    borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                    overflow: 'hidden', animation: 'slideUp 0.3s ease-out', border: '1px solid var(--card-border)' 
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                    <Search size={20} color="var(--text-muted)" style={{ marginRight: '1rem' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search Stroke, Diabetes, NICE, WHO..."
                        style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '1.25rem', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <Command size={12} /> K
                    </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
                    {query.trim() === '' ? (
                        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Recent Intelligent Clinical Searches:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                {['Diabetes', 'Stroke', 'NICE', 'Lipid Thresholds'].map(s => (
                                    <span key={s} onClick={() => setQuery(s)} style={{ padding: '4px 12px', backgroundColor: '#eff6ff', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {results.map((r, idx) => (
                                <li key={`${r.type}-${r.id}-${idx}`} 
                                    onClick={() => handleSelect(r)}
                                    style={{ 
                                        padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }} 
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)'} 
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ backgroundColor: r.type === 'Disease' ? 'rgba(59,130,246,0.1)' : 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                            {r.type === 'Disease' ? <BrainCircuit size={16} color="var(--primary)" /> : <FileText size={16} color="var(--primary)" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{r.text}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.type} • {r.subtext}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="var(--text-muted)" />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', margin: '2rem 0' }}>No clinical context found for "{query}". Try searching by disease category.</p>
                    )}
                </div>
                
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>Enter to Select</span>
                        <span>Esc to Dismiss</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={14}/> Intelligent Search v2.0</span>
                </div>
            </div>
        </div>
    );
}
