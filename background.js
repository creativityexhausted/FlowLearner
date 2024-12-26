// Background script for managing extension lifecycle or background tasks.
// background.js

// Listener for any runtime events or messages from the popup or content scripts
chrome.runtime.onInstalled.addListener(() => {
    console.log("Text Summary1 Extension installed!");
});

// Example message listener (can be customized as needed)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "LOG_EVENT") {
        console.log("Event logged:", message.payload);
        sendResponse({ success: true });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabURL") {
      // Get the currently active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
          sendURLToBackend(currentTab.url); // Send URL to the backend
        }
      });
    }
  });
  
  const sendURLToBackend = async (url) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), // Send the current tab's URL
      });
      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error sending URL:', error);
    }
  };
