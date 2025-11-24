// Coder: Nick
function handleUploadForm() {
    const form = document.getElementById("upload-form");
    const leftFileInput = document.getElementById("left-file");
    const rightFileInput = document.getElementById("right-file");
    const leftFileName = document.getElementById("left-file-name");
    const rightFileName = document.getElementById("right-file-name");
    const statusBox = document.getElementById("upload-status");
    const loadingModal = document.getElementById("loading-modal");

    // Handle file selection display
    leftFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            leftFileName.textContent = `✓ ${e.target.files[0].name}`;
            leftFileName.classList.add("active");
        } else {
            leftFileName.textContent = "No file selected";
            leftFileName.classList.remove("active");
        }
    });

    rightFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            rightFileName.textContent = `✓ ${e.target.files[0].name}`;
            rightFileName.classList.add("active");
        } else {
            rightFileName.textContent = "No file selected";
            rightFileName.classList.remove("active");
        }
    });

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const leftFile = leftFileInput.files[0];
        const rightFile = rightFileInput.files[0];

        if (!leftFile || !rightFile) {
            showStatus(
                '<i class="fas fa-exclamation-circle"></i> Please select both files.',
                "danger"
            );
            return;
        }

        // Validate file types
        const allowedExtensions = [".py", ".js", ".ts", ".java", ".cs", ".php", ".html", ".css"];
        const leftExt = leftFile.name.substring(leftFile.name.lastIndexOf(".")).toLowerCase();
        const rightExt = rightFile.name.substring(rightFile.name.lastIndexOf(".")).toLowerCase();

        if (!allowedExtensions.includes(leftExt) || !allowedExtensions.includes(rightExt)) {
            showStatus(
                '<i class="fas fa-ban"></i> Invalid file type. Allowed: ' + allowedExtensions.join(", "),
                "danger"
            );
            return;
        }

        showStatus(
            '<i class="fas fa-spinner fa-spin"></i> Uploading and comparing...',
            "info"
        );
        loadingModal.style.display = "flex";

        const formData = new FormData();
        formData.append("left_file", leftFile);
        formData.append("right_file", rightFile);

        try {
            const data = await apiCompareFiles(formData);
            window.currentComparisonSession = data.session.id;
            window.currentComparisonData = data;

            showStatus(
                '<i class="fas fa-check-circle"></i> Comparison completed successfully!',
                "success"
            );

            // Show comparison section
            document.getElementById("upload-section").style.display = "none";
            document.getElementById("comparison-section").style.display = "block";

            // Populate comparison data
            populateComparisonResults(data);

            // Scroll to results
            document.getElementById("comparison-section").scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            showStatus(
                '<i class="fas fa-times-circle"></i> Error during comparison. Please try again.',
                "danger"
            );
            console.error(err);
        } finally {
            loadingModal.style.display = "none";
        }
    });

    function showStatus(message, type) {
        statusBox.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }
}

function populateComparisonResults(data) {
    // Extract stats from diff
    const diffLines = data.diff.split("\n");
    const added = diffLines.filter(l => l.startsWith("+") && !l.startsWith("+++")).length;
    const removed = diffLines.filter(l => l.startsWith("-") && !l.startsWith("---")).length;

    // Calculate similarity percentage using backend ratio if provided
    let similarity = 100;
    if (typeof data.similarity === "number") {
        similarity = Math.max(0, Math.min(100, data.similarity));
    } else {
        const total = added + removed;
        similarity = total === 0 ? 100 : Math.max(0, 100 - total * 5);
    }

    // Update stat cards
    document.getElementById("stat-added").textContent = added;
    document.getElementById("stat-removed").textContent = removed;
    document.getElementById("stat-similarity").textContent = Math.round(similarity) + "%";
    document.getElementById("stat-issues").textContent = data.syntax_issues?.length || 0;

    // Populate diff viewer (unified and split)
    const unifiedDiff = data.diff || "No differences found";
    document.getElementById("diff-output").textContent = unifiedDiff;

    // If backend ever provides split views, use them; otherwise reuse unified
    document.getElementById("diff-left").textContent = data.left_content || unifiedDiff;
    document.getElementById("diff-right").textContent = data.right_content || unifiedDiff;

    // Populate AI summary
    document.getElementById("ai-summary").textContent = data.ai_summary || "Analysis complete";

    // Populate syntax issues if any
    if (data.syntax_issues && data.syntax_issues.length > 0) {
        const issuesList = document.getElementById("issues-list");
        issuesList.innerHTML = "";
        data.syntax_issues.forEach(issue => {
            const li = document.createElement("li");
            li.textContent = issue;
            issuesList.appendChild(li);
        });
        document.getElementById("syntax-issues-card").style.display = "block";
        document.getElementById("issues-stat-card")?.classList.add("has-issues");
    } else {
        document.getElementById("syntax-issues-card").style.display = "none";
        document.getElementById("issues-stat-card")?.classList.remove("has-issues");
    }

    // Enable merge button
    document.getElementById("merge-btn").disabled = false;
}
