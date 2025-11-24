// Coder: Nick
function initComparison() {
    const mergeBtn = document.getElementById("merge-btn");
    const resetBtn = document.getElementById("reset-btn");
    const loadingModal = document.getElementById("loading-modal");

    mergeBtn.addEventListener("click", async () => {
        const sessionId = window.currentComparisonSession;
        if (!sessionId) {
            showAlert("No comparison session found.", "danger");
            return;
        }

        mergeBtn.disabled = true;
        loadingModal.style.display = "flex";

        try {
            const data = await apiMergeSession(sessionId);
            window.currentMergeData = data;

            // Hide comparison section, show merge section
            document.getElementById("comparison-section").style.display = "none";
            document.getElementById("merge-section").style.display = "block";

            // Populate merge results
            populateMergeResults(data);

            // Scroll to results
            document
                .getElementById("merge-section")
                .scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            showAlert("Merge failed. Please try again.", "danger");
            console.error(err);
        } finally {
            loadingModal.style.display = "none";
            mergeBtn.disabled = false;
        }
    });

    resetBtn.addEventListener("click", () => {
        // Reset all sections
        document.getElementById("upload-section").style.display = "block";
        document.getElementById("comparison-section").style.display = "none";
        document.getElementById("merge-section").style.display = "none";

        // Clear form
        document.getElementById("upload-form").reset();
        document.getElementById("left-file-name").textContent = "No file selected";
        document.getElementById("left-file-name").classList.remove("active");
        document.getElementById("right-file-name").textContent = "No file selected";
        document.getElementById("right-file-name").classList.remove("active");

        // Scroll to upload section
        document
            .getElementById("upload-section")
            .scrollIntoView({ behavior: "smooth" });

        window.currentComparisonSession = null;
        window.currentComparisonData = null;
    });

    // Scroll to issues list when the issues stat card is clicked
    const issuesStatCard = document.getElementById("issues-stat-card");
    if (issuesStatCard) {
        issuesStatCard.style.cursor = "pointer";
        issuesStatCard.title = "Click to view issue details";
        issuesStatCard.addEventListener("click", () => {
            const issuesCard = document.getElementById("syntax-issues-card");
            if (issuesCard && issuesCard.style.display !== "none") {
                issuesCard.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                alert("No syntax/style issues found for this comparison.");
            }
        });
    }
}

function populateMergeResults(data) {
    const mergeInfo = document.getElementById("merge-info");
    const downloadBtn = document.getElementById("download-btn");

    if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.dataset.href = data.merge.merged_url || "";
        downloadBtn.dataset.filename = data.merge.merged_filename || "";
    }

    bindDiffControls();

    const linkHtml = data.merge.merged_url
        ? `<div style="margin-top: 0.75rem;"><a href="${data.merge.merged_url}" target="_blank" rel="noopener">Open merged file</a></div>`
        : "";

    let html = `
        <div class="merge-status-success">
            <i class="fas fa-check"></i>
            <span>Files have been successfully merged!</span>
        </div>

        <div class="merge-info-box">
            <p><strong>Merge Notes:</strong></p>
            <p>${data.merge.notes || "Merge completed successfully"}</p>
            <hr />
            <p><strong>Merged File Location:</strong></p>
            <code>${data.merge.merged_path}</code>
            ${linkHtml}
        </div>

        <div class="merge-notes">
            <strong><i class="fas fa-info-circle"></i> Merge Information:</strong>
            <p style="margin-top: 0.5rem; margin-bottom: 0;">
                - Merge strategy: Prefer right file version<br />
                - Conflicts are marked in comments<br />
                - File created at: ${new Date().toLocaleString()}
            </p>
        </div>
    `;

    mergeInfo.innerHTML = html;
}

function showAlert(message, type) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${type}`;
    alertContainer.innerHTML = `<i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-circle"
    }"></i> ${message}`;

    const uploadStatus = document.getElementById("upload-status");
    uploadStatus.innerHTML = "";
    uploadStatus.appendChild(alertContainer);

    if (type === "success") {
        setTimeout(() => {
            alertContainer.remove();
        }, 3000);
    }
}

// Diff toolbar actions
function bindDiffControls() {
    const diffOutput = document.getElementById("diff-output");
    const leftOutput = document.getElementById("diff-left");
    const rightOutput = document.getElementById("diff-right");

    const toggleWrapBtn = document.getElementById("toggle-wrap-btn");
    if (toggleWrapBtn) {
        toggleWrapBtn.onclick = () => {
            diffOutput?.classList.toggle("nowrap");
            leftOutput?.classList.toggle("nowrap");
            rightOutput?.classList.toggle("nowrap");
        };
    }

    const copyBtn = document.getElementById("copy-diff-btn");
    if (copyBtn) {
        copyBtn.onclick = async () => {
            try {
                const text = diffOutput?.textContent || "";
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = "Copied!";
                setTimeout(() => (copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i> Copy Diff'), 1200);
            } catch (e) {
                alert("Copy failed. Please copy manually.");
            }
        };
    }

    const downloadBtn = document.getElementById("download-diff-btn");
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const blob = new Blob([diffOutput?.textContent || ""], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "diff.patch";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }
}
