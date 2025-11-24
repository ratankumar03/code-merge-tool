// Coder: Nick
// Global state
window.currentComparisonSession = null;
window.currentComparisonData = null;
window.currentMergeData = null;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all modules
    handleUploadForm();
    initComparison();
    initMerge();

    startPaletteCycler();
    console.log("CodeMerge Tool initialized");
    console.log("API Base:", "http://127.0.0.1:8000/api");
});

// Handle page visibility to pause/resume operations
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log("App hidden");
    } else {
        console.log("App visible");
    }
});

function startPaletteCycler() {
    const palettes = [
        {
            primary: "#6366f1",
            accent: "#ec4899",
            success: "#10b981",
            danger: "#ef4444",
            warning: "#f59e0b",
            info: "#06b6d4",
            bg1: "rgba(99, 102, 241, 0.28)",
            bg2: "rgba(236, 72, 153, 0.22)",
            bg3: "rgba(16, 185, 129, 0.22)",
            bg4: "rgba(250, 204, 21, 0.18)",
            base1: "#0b1021",
            base2: "#0f172a",
            base3: "#0a1a2f",
        },
        {
            primary: "#0ea5e9",
            accent: "#a855f7",
            success: "#22c55e",
            danger: "#f43f5e",
            warning: "#eab308",
            info: "#38bdf8",
            bg1: "rgba(14, 165, 233, 0.28)",
            bg2: "rgba(168, 85, 247, 0.22)",
            bg3: "rgba(34, 197, 94, 0.2)",
            bg4: "rgba(234, 179, 8, 0.18)",
            base1: "#0a0f1f",
            base2: "#0b162a",
            base3: "#0c1c32",
        },
        {
            primary: "#f97316",
            accent: "#22c55e",
            success: "#16a34a",
            danger: "#e11d48",
            warning: "#f59e0b",
            info: "#06b6d4",
            bg1: "rgba(249, 115, 22, 0.25)",
            bg2: "rgba(34, 197, 94, 0.2)",
            bg3: "rgba(6, 182, 212, 0.2)",
            bg4: "rgba(236, 72, 153, 0.2)",
            base1: "#120c1c",
            base2: "#141728",
            base3: "#0f1f2f",
        },
    ];

    const root = document.documentElement;
    let idx = 0;

    const applyPalette = (p) => {
        root.style.setProperty("--primary", p.primary);
        root.style.setProperty("--primary-light", p.primary);
        root.style.setProperty("--primary-dark", p.primary);
        root.style.setProperty("--accent", p.accent);
        root.style.setProperty("--accent-light", p.accent);
        root.style.setProperty("--success", p.success);
        root.style.setProperty("--danger", p.danger);
        root.style.setProperty("--warning", p.warning);
        root.style.setProperty("--info", p.info);
        root.style.setProperty("--bg1", p.bg1);
        root.style.setProperty("--bg2", p.bg2);
        root.style.setProperty("--bg3", p.bg3);
        root.style.setProperty("--bg4", p.bg4);
        root.style.setProperty("--bg-base1", p.base1);
        root.style.setProperty("--bg-base2", p.base2);
        root.style.setProperty("--bg-base3", p.base3);
    };

    applyPalette(palettes[idx]);
    setInterval(() => {
        idx = (idx + 1) % palettes.length;
        applyPalette(palettes[idx]);
    }, 5000);
}
