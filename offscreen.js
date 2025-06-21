// offscreen.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
    // Check if this message is for the 'offscreen-clipboard'
    if (message.target === "offscreen-clipboard") {
        // We are using the 'copy' command for maximum compatibility.
        const textToCopy = message.data;
        const clipboardHelper = document.getElementById("clipboard-helper");

        clipboardHelper.value = textToCopy;
        clipboardHelper.select();

        // The 'copy' command is a classic, reliable way to copy text.
        if (document.execCommand("copy")) {
            sendResponse(true);
        } else {
            console.error("Failed to copy text using document.execCommand.");
            sendResponse(false);
        }
    }
    // Return true to indicate you wish to send a response asynchronously
    return true;
}