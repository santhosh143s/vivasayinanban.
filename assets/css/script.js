let model;

// Load AI Model
async function loadModel() {
  model = await tf.loadLayersModel('model/model.json');
  console.log("Model Loaded");
}
loadModel();

// Image Upload
document.getElementById("imageUpload").addEventListener("change", async function(event) {
  const file = event.target.files[0];
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    const prediction = await model.predict(tensor).data();

    const diseases = ["Healthy", "Leaf Spot", "Blight", "Rust"];
    const solutions = [
      "பயிர் நலமாக உள்ளது",
      "பூச்சிக்கொல்லி பயன்படுத்தவும்",
      "பயிர் பாதிக்கப்பட்டது - மருந்து தேவை",
      "உடனடி கவனம் தேவை"
    ];

    const index = prediction.indexOf(Math.max(...prediction));

    document.getElementById("result").innerText =
      "நோய்: " + diseases[index] + "\nதீர்வு: " + solutions[index];
  };
});

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Voice Tamil Input
function startVoice() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ta-IN";

  recognition.onresult = function(event) {
    document.getElementById("voiceText").innerText =
      event.results[0][0].transcript;
  };

  recognition.start();
}

// Location
navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  document.getElementById("location").innerText =
    "📍 Location: " + lat + ", " + lon;
});

// Analytics (local)
let count = localStorage.getItem("usage") || 0;
count++;
localStorage.setItem("usage", count);

document.getElementById("visits").innerText =
  "📊 Total Visits: " + count;

// Multi Language
function changeLang(lang) {
  if (lang === "en") {
    document.getElementById("title").innerText = "Farmer Friend AI";
  } else {
    document.getElementById("title").innerText = "🌱 விவசாயி நண்பன் AI";
  }
}
