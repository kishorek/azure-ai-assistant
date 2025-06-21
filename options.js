// Saves options to chrome.storage
function saveOptions() {
    const endpoint = document.getElementById("endpoint").value;
    const apiKey = document.getElementById("apiKey").value;
    const deploymentName = document.getElementById("deploymentName").value;

    chrome.storage.sync.set({
            azureEndpoint: endpoint,
            azureApiKey: apiKey,
            azureDeploymentName: deploymentName,
        },
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById("status");
            status.textContent = "Settings saved.";
            setTimeout(() => {
                status.textContent = "";
            }, 1500);
        }
    );
}

// Restores form options from chrome.storage
function restoreOptions() {
    chrome.storage.sync.get({
            azureEndpoint: "",
            azureApiKey: "",
            azureDeploymentName: "",
        },
        (items) => {
            document.getElementById("endpoint").value = items.azureEndpoint;
            document.getElementById("apiKey").value = items.azureApiKey;
            document.getElementById("deploymentName").value =
                items.azureDeploymentName;
        }
    );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);