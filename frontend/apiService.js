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
