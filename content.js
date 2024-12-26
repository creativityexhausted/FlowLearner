// Content script for additional functionality if needed.
// content.js

// Capture the current tab's URL and send it to the backend
chrome.runtime.sendMessage({ action: "getTabURL" });

// Function to extract text content from the current webpage
function getPageText() {
    const bodyText = document.body.innerText || "";
    return bodyText.replace(/\s+/g, " ").trim();
}

// Listener for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PAGE_TEXT") {
        const pageText = getPageText();
        sendResponse({ text: pageText });
    }
});

// Example: Injecting a highlight effect on the webpage for summarized text
function highlightText(summary) {
    const bodyHTML = document.body.innerHTML;
    const highlightedHTML = summary.split(". ").reduce((html, sentence) => {
        return html.replace(sentence, `<span style="background-color: yellow;">${sentence}</span>`);
    }, bodyHTML);

    document.body.innerHTML = highlightedHTML;
}

// Optional: Listen for commands to highlight the summary
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "HIGHLIGHT_SUMMARY") {
        highlightText(message.summary);
        sendResponse({ success: true });
    }
});
