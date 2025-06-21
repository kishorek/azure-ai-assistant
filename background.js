// background.js (FULL UPDATED FILE)

// Listens for the extension icon click
chrome.action.onClicked.addListener((tab) => {
    // First, get the saved settings
    chrome.storage.sync.get(
        ['azureEndpoint', 'azureApiKey', 'azureDeploymentName'],
        async(settings) => {
            if (!settings.azureEndpoint ||
                !settings.azureApiKey ||
                !settings.azureDeploymentName
            ) {
                chrome.runtime.openOptionsPage();
                return;
            }

            chrome.action.setBadgeText({ text: '...' });
            chrome.action.setBadgeBackgroundColor({ color: '#FFA500' });

            const selectionResult = await executeScriptOnTab(tab.id, getSelectedText);

            if (selectionResult && selectionResult[0].result) {
                const selectedText = selectionResult[0].result;
                console.log('Found selected text:', selectedText);
                const prompt = `Please analyze the following text and provide a concise summary or key takeaways:\n\n"${selectedText}"`;
                processWithAzureAI(settings, prompt, null);
            } else {
                console.log('No text selected, taking screenshot.');
                const screenshotUrl = await chrome.tabs.captureVisibleTab(
                    tab.windowId, { format: 'jpeg' },
                );
                const prompt = 'Describe what you see in this screenshot.';
                processWithAzureAI(settings, prompt, screenshotUrl);
            }
        }
    );
});

// Function to execute a script in the context of the active tab
function executeScriptOnTab(tabId, funcToInject) {
    return chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: funcToInject,
    });
}

// This function is injected into the page to get the selection
function getSelectedText() {
    return window.getSelection().toString().trim();
}

// Main function to call Azure OpenAI API
async function processWithAzureAI(settings, prompt, base64ImageUrl) {
    const { azureEndpoint, azureApiKey, azureDeploymentName } = settings;
    const apiVersion = '2023-12-01-preview';
    const apiUrl = `${azureEndpoint}openai/deployments/${azureDeploymentName}/chat/completions?api-version=${apiVersion}`;

    const messages = [{
        role: 'user',
        content: [{ type: 'text', text: prompt }],
    }, ];

    if (base64ImageUrl) {
        messages[0].content.push({
            type: 'image_url',
            image_url: { url: base64ImageUrl },
        });
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': azureApiKey,
            },
            body: JSON.stringify({
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(
                `API Error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorBody)}`,
            );
        }

        const data = await response.json();
        // prettier-ignore
        const responseText = data.choices[0].message.content;

        if (responseText) {
            await copyToClipboard(responseText); // Use the new function
        } else {
            throw new Error('No response text found in API result.');
        }
    } catch (error) {
        console.error('Error calling Azure OpenAI:', error);
        chrome.action.setBadgeText({ text: 'X' });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
        setTimeout(() => chrome.action.setBadgeText({ text: '' }), 3000);
    }
}

// --- NEW AND IMPROVED copyToClipboard FUNCTION ---

// A helper function to check if an offscreen document is already active
async function hasOffscreenDocument() {
    // Check all clients for an offscreen document
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        if (client.url.endsWith('/offscreen.html')) {
            return true;
        }
    }
    return false;
}

async function copyToClipboard(text) {
    // Ensure an offscreen document is available
    if (!(await hasOffscreenDocument())) {
        // Create an offscreen document if one doesn't exist.
        // Reason 'CLIPBOARD' is the most appropriate here.
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['CLIPBOARD'],
            justification: 'Required to write to the clipboard.',
        });
    }

    // Send a message to the offscreen document to perform the copy
    chrome.runtime.sendMessage({
            target: 'offscreen-clipboard',
            data: text,
        },
        (response) => {
            if (response) {
                console.log('Response copied to clipboard successfully.');
                chrome.action.setBadgeText({ text: '✓' });
                chrome.action.setBadgeBackgroundColor({ color: '#008000' });
            } else {
                console.error('Failed to copy to clipboard via offscreen document.');
                chrome.action.setBadgeText({ text: 'X' });
                chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
            }

            // Close the offscreen document and clear the badge after a delay
            setTimeout(() => {
                chrome.offscreen.close();
                chrome.action.setBadgeText({ text: '' });
            }, 3000);
        },
    );
}