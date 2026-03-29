import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, Dot } from 'recharts';
import { Users, AlertCircle, Heart, Shield } from 'lucide-react';

export default function PopulationHeatmap({ guidelineId, guidelineTitle }) {
    // Simple seeded random to keep it deterministic per guideline
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // A slightly more aggressive seed to ensure visual difference
    const getMultipliedSeed = (id) => (Number(id) * 1337) % 2147483647;

    // Generate 100 mock patients for cohort simulation
    const cohort = useMemo(() => {
        const seed = getMultipliedSeed(guidelineId || 42);
        console.log("Generating cohort heatmap for guidelineId:", guidelineId, "with composite seed:", seed);
        return Array.from({ length: 100 }, (_, i) => {
            const r1 = seededRandom(seed + i);
            const r2 = seededRandom(seed + i + 100);
            const r3 = seededRandom(seed + i + 200);
            
            return {
                id: i,
                x: Math.floor(r1 * 100), // Age
                y: 90 + Math.floor(r2 * 80), // Sys BP
                risk: r3 > 0.7 ? 'High' : (r3 > 0.4 ? 'Moderate' : 'Low'),
                comorbidities: Math.floor(r1 * r2 * 3)
            };
        });
    }, [guidelineId]);

    const stats = useMemo(() => {
        const high = cohort.filter(p => p.risk === 'High').length;
        const moderate = cohort.filter(p => p.risk === 'Moderate').length;
        const low = cohort.filter(p => p.risk === 'Low').length;
        return { high, moderate, low };
    }, [cohort]);

    const getColor = (risk) => {
        if (risk === 'High') return '#dc2626';
        if (risk === 'Moderate') return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="population-heatmap fade-in">
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={28} color="var(--primary)"/> Cohort Risk: {guidelineTitle || "Global Standard"} (n=100)
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Simulated population impact after 2024 {guidelineTitle || "Guideline"} Drift application.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="badge badge-critical">{stats.high}% Critical Drift</div>
                        <div className="badge badge-minor">{100 - stats.high}% Stable</div>
                    </div>
                </div>

                <div style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="x" name="Age" unit="y" label={{ value: 'Patient Age', position: 'bottom', offset: 0 }} />
                            <YAxis type="number" dataKey="y" name="BP" unit="mmHg" label={{ value: 'Systolic BP', angle: -90, position: 'left' }} />
                            <ZAxis type="number" dataKey="comorbidities" range={[50, 400]} name="Comorbidities" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Patients" data={cohort}>
                                {cohort.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.risk)} fillOpacity={0.6} stroke={getColor(entry.risk)} strokeWidth={2} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 700, marginBottom: '5px' }}>
                            <AlertCircle size={18}/> High Risk Zone
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.high} Patients</div>
                        <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>+{Math.floor(stats.high/2)}% since 2023 Guideline Update</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, marginBottom: '5px' }}>
                            <Shield size={18}/> Managed Risk
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.moderate} Patients</div>
                        <div style={{ fontSize: '0.8rem', color: '#b45309' }}>Recalibrating follow-up cycles</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '5px' }}>
                            <Heart size={18}/> Stable Cohort
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.low} Patients</div>
                        <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Optimum adherence detected</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
