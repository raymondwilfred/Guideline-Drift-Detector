import React, { useEffect, useState, useMemo } from 'react';
import { fetchStats, fetchGuidelines } from './apiService';
import TimelineView from './TimelineView';
import ConflictEngine from './ConflictEngine';
import Chatbot from './Chatbot';
import SearchPalette from './SearchPalette';
import PatientIntake from './PatientIntake';
import DiseaseDeepView from './DiseaseDeepView';
import ComparisonEngine from './ComparisonEngine';
import PopulationHeatmap from './PopulationHeatmap';
import { Activity, FileText, AlertTriangle, ShieldAlert, ChevronRight, FileSearch, Search, Filter, History, Network, Command, UserPlus, BrainCircuit, Microscope, GitCompare, BarChart3, Users } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [guidelines, setGuidelines] = useState([]);
    const [selectedGuideline, setSelectedGuideline] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeTab, setActiveTab] = useState('drift'); // drift, simulation, conflicts, intake, disease_deep, comparison

    const tabs = [
        { id: 'drift', label: 'Guideline Evolution', icon: History, activeColor: 'var(--primary)' },
        { id: 'conflicts', label: 'Global Conflicts', icon: Network, activeColor: '#8b5cf6' },
        { id: 'comparison', label: 'Contrast Engine', icon: GitCompare, activeColor: '#f59e0b' },
        { id: 'intake', label: 'Smart Intake', icon: UserPlus, activeColor: '#10b981' },
        { id: 'heatmap', label: 'Cohort Heatmap', icon: Users, activeColor: '#0ea5e9' },
    ];

    useEffect(() => {
        fetchStats().then(setStats).catch(console.error);
        fetchGuidelines().then(data => {
            setGuidelines(data || []);
            if (data && data.length > 0) {
                // Auto-select the first one to avoid blank space
                setSelectedGuideline(data[0].id);
            }
        }).catch(console.error);
    }, []);

    // Extract unique categories for the filter
    const categories = useMemo(() => {
        const cats = new Set(guidelines.map(g => g.disease_category || 'General'));
        return ["All", ...Array.from(cats)].filter(c => c);
    }, [guidelines]);

    // Filter guidelines
    const filteredGuidelines = useMemo(() => {
        return guidelines.filter(g => {
            const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  g.organization.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = selectedCategory === "All" || g.disease_category === selectedCategory;
            return matchesSearch && matchesCat;
        });
    }, [guidelines, searchQuery, selectedCategory]);

    return (
        <div className="app-container fade-in">
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>
                            <Activity size={32} color="white" />
                        </div>
                        <h1 className="header-title" style={{ margin: 0 }}>Drift Detector AI</h1>
                    </div>
                    <p className="header-subtitle" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Advanced Semantic Change Tracking & Medical NLP Intelligence.
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Command size={12}/>+K for Global Search
                        </span>
                    </p>
                </div>
            </header>
            
            {stats && stats.critical_changes > 0 && (
                <div className="insight-panel">
                    <div style={{ backgroundColor: '#bfdbfe', padding: '8px', borderRadius: '50%' }}>
                        <AlertTriangle size={24} color="#1d4ed8" />
                    </div>
                    <div>
                        <div className="insight-text">Action Required: {stats.critical_changes} Critical Guideline Shifts Detected</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                            Prioritize review of recent threshold classifications. Unreviewed critical shifts significantly increase compliance and clinical risk across active patient cohorts.
                        </div>
                    </div>
                </div>
            )}

            <SearchPalette
                guidelines={guidelines}
                onSelect={(id, type) => {
                    if (type === 'Disease') {
                        const g = guidelines.find(gl => gl.disease_category.toLowerCase().includes(id.toLowerCase()));
                        if (g) setSelectedGuideline(g.id);
                        setActiveTab('disease_deep');
                    } else {
                        setSelectedGuideline(id);
                        setActiveTab('drift');
                    }
                }}
            />
            {stats ? (
                <div className="stats-grid slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="glass-card stat-item">
                        <div className="stat-title"><FileText size={16} /> Total Analyzed Guidelines</div>
                        <div className="stat-value">{stats.total_guidelines}</div>
                    </div>
                    <div className="glass-card stat-item">
                        <div className="stat-title"><AlertTriangle size={16} /> Automated Diffs Detected</div>
                        <div className="stat-value">{stats.total_diffs}</div>
                    </div>
                    <div className="glass-card stat-item stat-critical" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                            <ShieldAlert size={100} />
                        </div>
                        <div className="stat-title"><ShieldAlert size={16} /> Critical Semantic Shifts</div>
                        <div className="stat-value">{stats.critical_changes}</div>
                    </div>
                </div>
            ) : (
                <div className="stats-grid" style={{ opacity: 0.5 }}>
                    <div className="glass-card stat-item pulse-loading"></div>
                    <div className="glass-card stat-item pulse-loading"></div>
                    <div className="glass-card stat-item pulse-loading"></div>
                </div>
            )}
            
            <div className="dashboard-grid slide-up" style={{ animationDelay: '0.2s' }}>
                <aside className="sidebar sidebar-sticky">
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                placeholder="Search guidelines..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={16} color="var(--text-muted)" />
                            <select 
                                value={selectedCategory} 
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="category-select"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filteredGuidelines.map(g => (
                                <li 
                                    key={g.id} 
                                    onClick={() => setSelectedGuideline(g.id)} 
                                    className={`guideline-item ${selectedGuideline === g.id ? 'active' : ''}`}
                                >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <strong className="guideline-item-title">{g.title}</strong>
                                                    {selectedGuideline === g.id && <div className="active-dot"></div>}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                    <div className="guideline-item-meta">
                                                        <span>{g.organization}</span>
                                                        <span style={{ margin: '0 6px', color: '#cbd5e1' }}>|</span>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{g.disease_category}</span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setActiveTab('disease_deep'); setSelectedGuideline(g.id); }}
                                                        className="deep-intel-btn elite-glow" 
                                                        title="Launch Disease Intelligence Layer"
                                                    >
                                                        <BrainCircuit size={16} />
                                                        <span style={{ fontSize: '10px', fontWeight: 800, marginLeft: '4px' }}>INTEL</span>
                                                    </button>
                                                </div>
                                            </div>
                                    <ChevronRight size={18} color={selectedGuideline === g.id ? 'var(--primary)' : '#cbd5e1'} style={{ marginLeft: '10px' }} />
                                </li>
                            ))}
                            {filteredGuidelines.length === 0 && (
                                <div className="glass-card" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <FileSearch size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                    No matching guidelines found.
                                </div>
                            )}
                        </ul>
                    </div>
                </aside>
                
                <main className="main-content">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.4)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                        {tabs.map(tab => {
                            const IconComponent = tab.icon;
                            return (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{ 
                                        flex: 1, 
                                        padding: '0.75rem', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        gap: '0.5rem', 
                                        background: activeTab === tab.id ? '#fff' : 'transparent', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer', 
                                        fontWeight: 600, 
                                        color: activeTab === tab.id ? tab.activeColor : 'var(--text-muted)', 
                                        boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none', 
                                        transition: 'all 0.2s' 
                                    }}
                                >
                                    <IconComponent size={18} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === 'drift' ? (
                        selectedGuideline ? (
                            <div className="glass-card" style={{ padding: '2.5rem', minHeight: '600px', position: 'relative' }}>
                                <TimelineView guidelineId={selectedGuideline} />
                            </div>
                        ) : (
                            <div className="empty-state glass-card">
                                <History size={48} />
                                <p>Select a guideline from the sidebar to view its clinical evolution & semantic drift.</p>
                            </div>
                        )
                    ) : null}

                    {activeTab === 'conflicts' && (
                        <div className="fade-in">
                            <ConflictEngine />
                        </div>
                    )}

                    {activeTab === 'intake' && (
                        <div className="fade-in">
                            <PatientIntake />
                        </div>
                    )}

                    {activeTab === 'disease_deep' && (
                        <div className="fade-in">
                            <DiseaseDeepView category={guidelines.find(g => g.id === selectedGuideline)?.disease_category || "Hypertension"} />
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="fade-in">
                            <ComparisonEngine guidelines={guidelines} />
                        </div>
                    )}

                    {activeTab === 'heatmap' && (
                        <div className="fade-in">
                            <PopulationHeatmap 
                                guidelineId={selectedGuideline} 
                                guidelineTitle={guidelines.find(g => g.id === selectedGuideline)?.title}
                            />
                        </div>
                    )}
                </main>
            </div>
            
            <Chatbot />
            
            <style>{`
                .search-input { width: 100%; padding: 10px 10px 10px 38px; border: 1px solid var(--card-border); border-radius: 8px; font-family: inherit; font-size: 0.95rem; background: rgba(255,255,255,0.7); outline: none; transition: all 0.2s; }
                .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); background: #fff; }
                .category-select { flex: 1; padding: 8px 12px; border: 1px solid var(--card-border); border-radius: 8px; font-family: inherit; font-size: 0.9rem; background: rgba(255,255,255,0.7); outline: none; cursor: pointer; }
                .category-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .active-dot { width: 8px; height: 8px; background-color: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); }
                .empty-state-icon { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-bottom: 20px; color: var(--primary); box-shadow: 0 10px 25px -5px rgba(59,130,246,0.2); }
                .deep-intel-btn { background: var(--primary-light); color: var(--primary); border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer; display: flex; alignItems: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.8; box-shadow: 0 2px 4px rgba(59,130,246,0.1); }
                .deep-intel-btn:hover { background: var(--primary); color: white; opacity: 1; transform: translateY(-2px) scale(1.05); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
                .elite-glow { animation: softGlow 2s infinite ease-in-out; }
                @keyframes softGlow { 0% { box-shadow: 0 0 0px var(--primary-light); } 50% { box-shadow: 0 0 10px var(--primary-light); } 100% { box-shadow: 0 0 0px var(--primary-light); } }
                .pulse-loading { height: 100px; animation: pulse 2s infinite ease-in-out; }
                
                @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
                .fade-in { animation: fadeIn 0.6s ease-out forwards; }
                .slide-up { opacity: 0; animation: slideUp 0.6s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
