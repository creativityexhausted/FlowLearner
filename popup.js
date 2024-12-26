document.getElementById('summarize-button').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: summarizePage
  }, async (results) => {
    const summary = results[0].result;
    document.getElementById('summary').textContent = summary;

    const images = await fetchImages(summary);
    displayImages(images);

    const sentiment = await analyzeSentiment(summary);
    document.getElementById('sentiment').textContent = sentiment;

  });
});

document.getElementById('read-aloud-button').addEventListener('click', () => {
  const summary = document.getElementById('summary').textContent;
  
  if (summary.trim() !== "") {
    const speech = new SpeechSynthesisUtterance(summary);
    window.speechSynthesis.speak(speech);
  } else {
    alert("No summary available to read aloud.");
  }
});

function summarizePage() {
  const text = document.body.innerText;
  const sentences = text.split('. ');
  const summtext=sentences.slice(1, 10).join('. ') + '.';
  return summtext;
}

async function analyzeSentiment(text) {
  const response = await fetch('scripts/sentiment.js', { method: 'POST', body: JSON.stringify({ text }) });
  const data = await response.json();
  return data.sentiment;
}

async function fetchImages(query) {
  const response = await fetch("https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=P5za8BSToQDAzaMDP9iBUTYDyINjyh8E4BjNBGX1X14");
  const data = await response.json();
  return data.results.map(img => img.urls.small);
}

function displayImages(images) {
  const imagesDiv = document.getElementById('images');
  imagesDiv.innerHTML = '';
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    imagesDiv.appendChild(img);
  });
}
