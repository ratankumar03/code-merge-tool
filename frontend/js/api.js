// Coder: Nick
const API_BASE = "http://127.0.0.1:8000/api";

async function apiCompareFiles(formData) {
    try {
        const res = await fetch(`${API_BASE}/comparison/compare/`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Comparison failed");
        }

        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function apiMergeSession(sessionId) {
    try {
        const res = await fetch(`${API_BASE}/merge/${sessionId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Merge failed");
        }

        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function apiGetHistory(type = "comparison") {
    try {
        const endpoint = type === "comparison" ? "history" : `merge/history`;
        const res = await fetch(`${API_BASE}/comparison/${endpoint}/`);

        if (!res.ok) {
            throw new Error(`Failed to fetch ${type} history`);
        }

        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}