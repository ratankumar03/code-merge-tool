// Coder: Nick
function initMerge() {
    const downloadBtn = document.getElementById("download-btn");
    const newCompareBtn = document.getElementById("new-compare-btn");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const mergeData = window.currentMergeData;
            if (!mergeData || !mergeData.merge) {
                alert("No merge available to download yet.");
                return;
            }

            const href = mergeData.merge.merged_url || downloadBtn.dataset.href;
            const filename =
                mergeData.merge.merged_filename ||
                downloadBtn.dataset.filename ||
                "merged_output";

            if (href) {
                const link = document.createElement("a");
                link.href = href;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (mergeData.merge.merged_path) {
                alert(
                    "Merged file is ready at:\n" +
                    mergeData.merge.merged_path +
                    "\n\nServe media files to enable browser download."
                );
            } else {
                alert("Download link unavailable. Please try merging again.");
            }
        });
    }

    if (newCompareBtn) {
        newCompareBtn.addEventListener("click", () => {
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
            document.getElementById("upload-section").scrollIntoView({ behavior: "smooth" });

            window.currentComparisonSession = null;
            window.currentComparisonData = null;
            window.currentMergeData = null;
        });
    }
}
