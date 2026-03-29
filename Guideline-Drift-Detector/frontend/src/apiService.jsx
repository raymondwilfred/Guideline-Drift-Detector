const API_BASE = "http://localhost:8000/api";

export const fetchGuidelines = async () => {
    try {
        const response = await fetch(`${API_BASE}/guidelines`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return [];
    }
};

export const fetchDiseaseDetails = async (category) => {
    try {
        const response = await fetch(`${API_BASE}/diseases/${category}`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const fetchComparison = async (id1, id2) => {
    try {
        const response = await fetch(`${API_BASE}/compare/${id1}/${id2}`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const simulateSwap = async (patient, currentRisk, targetId) => {
    try {
        const response = await fetch(`${API_BASE}/patient/simulate_swap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient, current_risk: currentRisk, target_guideline_id: targetId })
        });
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const fetchAIRationale = async (patient, riskLevel) => {
    try {
        const response = await fetch(`${API_BASE}/ai/explain_risk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient, risk_level: riskLevel })
        });
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const fetchDiffs = async (guidelineId) => {
    try {
        const response = await fetch(`${API_BASE}/guidelines/${guidelineId}/diffs`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return [];
    }
};

export const fetchStats = async () => {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const fetchImpactSimulation = async (diffId) => {
    try {
        const response = await fetch(`${API_BASE}/simulate_impact/${diffId}`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return null;
    }
};

export const analyzePatientData = async (patientData) => {
    try {
        const response = await fetch(`${API_BASE}/patient/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        return await response.json();
    } catch(e) {
        console.error(e);
        return { error: "Service Unavailable" };
    }
};

export const fetchConflicts = async () => {
    try {
        const response = await fetch(`${API_BASE}/conflicts`);
        return await response.json();
    } catch(e) {
        console.error(e);
        return [];
    }
};

export const sendChatMessage = async (query) => {
    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        return data.answer;
    } catch(e) {
        console.error(e);
        return "Sorry, I am having trouble connecting to the knowledge base right now.";
    }
};
