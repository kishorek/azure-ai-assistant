# Azure AI Assistant - Chrome Extension

A powerful Chrome extension that connects your browser to your Azure OpenAI service. Select any text for analysis or take a screenshot of the visible tab, and get an AI-generated response copied directly to your clipboard.

---

## Features

-   **Contextual Analysis:** Get insights on any content you're browsing.
-   **Dual Mode Operation:**
    -   **Text Mode:** Highlight any text on a webpage to send it for analysis.
    -   **Vision Mode:** If no text is selected, the extension takes a screenshot of the visible part of the page and sends it for visual analysis.
-   **Powered by Azure OpenAI:** Leverages the power of your own secure Azure OpenAI endpoint, supporting multimodal models like.
-   **Seamless Workflow:** The AI-generated response is automatically and silently copied to your clipboard.
-   **User Feedback:** The extension icon badge provides real-time status updates (processing, success, or error).
-   **Secure Configuration:** Your Azure credentials are stored securely using Chrome's storage API and are never hardcoded.

## How It Works

1.  The user clicks the extension icon in the Chrome toolbar.
2.  The background script checks if any text is selected on the active page.
    -   **If text is selected**, it's used as the input.
    -   **If no text is selected**, the extension captures the visible tab as a JPEG image.
3.  The text or image is sent to your configured Azure OpenAI endpoint along with a simple prompt.
4.  The AI model processes the request and generates a response.
5.  The extension receives the response text.
6.  To reliably copy the text to the clipboard without focus issues, the extension briefly creates a hidden **Offscreen Document**.
7.  The response text is sent to this hidden page, which performs the copy operation.
8.  The result is now in your clipboard, ready to be pasted anywhere!

## Installation

Since this is an unpacked extension, you need to load it manually.

1.  **Download:** Clone this repository or download the source code as a ZIP file and extract it.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** In the top-right corner of the Extensions page, toggle on **"Developer mode"**.
4.  **Load the Extension:** Click the **"Load unpacked"** button that appears on the top-left.
5.  **Select the Folder:** In the file dialog, select the root folder of the extension (the one containing `manifest.json`).

The "Azure AI Assistant" icon should now appear in your Chrome toolbar. You may need to click the puzzle piece icon to pin it.

## Configuration

**This step is required.** Before you can use the extension, you must provide your Azure OpenAI credentials.

1.  Right-click the "Azure AI Assistant" icon in your toolbar and select **"Options"**.
2.  This will open the settings page. Fill in the following fields:

    | Field               | Description                                                                                                       | Example                                           |
    | ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
    | **Azure Endpoint**  | The base URL for your Azure OpenAI resource. You can find this in the Azure portal under "Keys and Endpoint".       | `https://your-resource-name.openai.azure.com/`    |
    | **API Key**         | One of the secret keys for your Azure OpenAI resource. Treat this like a password.                                | `a1b2c3d4e5f67890a1b2c3d4e5f67890`                |
    | **Deployment Name** | The specific name of your model deployment in Azure AI Studio. **This must be a vision-capable model.**             | `model`                            |

3.  Click **"Save Settings"**. The extension is now ready to use.

## Usage

Using the assistant is designed to be fast and simple.

-   **To Analyze Text:**
    1.  On any webpage, highlight the text you want to analyze.
    2.  Click the "Azure AI Assistant" icon.
    3.  The icon will show "..." while processing, then "✓" upon success.
    4.  The AI's response is now in your clipboard. Paste it (`Ctrl+V` or `Cmd+V`) wherever you like.

-   **To Analyze a Screenshot:**
    1.  On any webpage, make sure no text is selected (click on a blank area of the page if needed).
    2.  Click the "Azure AI Assistant" icon.
    3.  The icon will show "..." while processing, then "✓" upon success.
    4.  The AI's description of the screenshot is now in your clipboard.

## Project Structure

```
/
├── manifest.json         # Defines the extension's permissions, scripts, and metadata.
├── background.js         # The main service worker; handles all core logic.
├── options.html          # The HTML for the settings page.
├── options.js            # The JavaScript for saving and loading settings.
├── offscreen.html        # A minimal, hidden HTML page for clipboard access.
├── offscreen.js          # The script for the offscreen page that performs the copy action.
└── icons/                # Directory for extension icons.
```

## Permissions Explained

This extension requires a few permissions to function correctly. Here’s why each one is needed:

-   `activeTab` & `scripting`: To get the user's selected text and to take a screenshot of the current tab.
-   `storage`: To securely save your Azure API credentials.
-   `clipboardWrite` & `offscreen`: To reliably copy the AI response to the user's clipboard, even when the browser window is not in focus.
-   `host_permissions`: To allow the extension to make API calls specifically to your Azure OpenAI endpoint.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.