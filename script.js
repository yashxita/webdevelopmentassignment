let weatherCondition = "clear";
const weatherMoods = {
  rainy: {
    moods: ["romantic", "gloomy", "chill"],
    activities: [
      "Read a book",
      "Watch a movie",
      "Sip hot cocoa",
      "Listen to lo-fi music",
      "Paint or sketch",
    ],
    food: [
      "Soup",
      "Hot chocolate",
      "Pasta",
      "Grilled cheese sandwich",
      "Mug cake",
    ],
  },
  clear: {
    moods: ["happy", "energetic", "relaxed"],
    activities: [
      "Go for a walk",
      "Play outdoor sports",
      "Picnic in the park",
      "Photography",
      "Try a new café",
    ],
    food: [
      "Salad",
      "Smoothies",
      "Grilled chicken",
      "Fresh fruit bowl",
      "Iced coffee",
    ],
  },
  cloudy: {
    moods: ["melancholic", "thoughtful", "calm"],
    activities: [
      "Journaling",
      "Listen to jazz",
      "Go to a café",
      "Read poetry",
      "Solve puzzles",
    ],
    food: ["Coffee", "Pastries", "Warm tea", "Soup dumplings", "Garlic bread"],
  },
  snow: {
    moods: ["cozy", "peaceful", "nostalgic"],
    activities: [
      "Sit by the fireplace",
      "Bake cookies",
      "Watch old movies",
      "Knit or crochet",
      "Write a letter",
    ],
    food: [
      "Hot chocolate",
      "Cookies",
      "Stew",
      "Mac and cheese",
      "Cinnamon rolls",
    ],
  },
  thunderstorm: {
    moods: ["intense", "moody", "deep"],
    activities: [
      "Write poetry",
      "Watch a thriller",
      "Play video games",
      "Listen to heavy metal",
      "Meditate",
    ],
    food: [
      "Spicy ramen",
      "Grilled cheese",
      "Dark chocolate",
      "Nachos with dip",
      "Chili",
    ],
  },
  sunny: {
    moods: ["energetic", "playful", "happy"],
    activities: [
      "Go to the beach",
      "Bike ride",
      "Do yoga outdoors",
      "Go hiking",
      "Try a water sport",
    ],
    food: ["Ice cream", "Fruit salad", "Grilled fish", "Lemonade", "Tacos"],
  },
};
async function fetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "4dfc4a92c72b4af1a25114812252602";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        weatherCondition = data.current.condition.text.toLowerCase();
        updateMoodOptions();
        applyWeatherTheme(weatherCondition);
        displayRecommendations();
        document.getElementById("weather").innerHTML = `
          <div class="weather-box">
            <h3 class="weather-title">${data.location.name}, ${data.location.country}</h3>
            <div class="weather-details">
              <div class="weather-left">
                <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
                <p><strong>Feels Like:</strong> ${data.current.feelslike_c}°C</p>
                <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
              </div>
              <div class="weather-right">
                <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h</p>
                <p><strong>Wind Direction:</strong> ${data.current.wind_dir}</p>
                <p><strong>Pressure:</strong> ${data.current.pressure_mb} mb</p>
                <p><strong>Visibility:</strong> ${data.current.vis_km} km</p>
              </div>
            </div>
          </div>
        `;
      } catch (error) {
        document.getElementById("weather").textContent =
          "Unable to fetch weather data.";
      }
    });
  }
}
function updateMoodOptions() {
  const moodSelect = document.getElementById("mood");
  let selectedKey = "clear";
  for (const key in weatherMoods) {
    if (weatherCondition.includes(key)) {
      selectedKey = key;
      break;
    }
  }
  const moods = weatherMoods[selectedKey]?.moods || ["happy"];
  moodSelect.innerHTML = ""; 
  for (let i = 0; i < moods.length; i++) {
    const option = document.createElement("option");
    option.value = moods[i];
    option.textContent = moods[i].charAt(0).toUpperCase() + moods[i].slice(1);
    moodSelect.appendChild(option);
  }
}
function displayRecommendations() {
  const recommendationsDiv = document.getElementById("recommendations");
  let moodKey = "clear";
  for (const key in weatherMoods) {
    if (weatherCondition.includes(key)) {
      moodKey = key;
      break;
    }
  }
  const { activities = ["Relax at home"], food = ["Comfort food"] } =
    weatherMoods[moodKey] || {};
  recommendationsDiv.innerHTML = `
    <h3>Recommended</h3>
    <div class="recommendation-columns">
      <div class="column left-align">
        <strong>Activities</strong>
        <div class="text-list">
          ${activities
            .slice(0, 5)
            .map((activity) => `<p>${activity}</p>`)
            .join("")}
        </div>
      </div>
      <div class="column right-align">
        <strong>Food</strong>
        <div class="text-list">
          ${food
            .slice(0, 5)
            .map((item) => `<p>${item}</p>`)
            .join("")}
        </div>
      </div>
    </div>
  `;
}
function applyWeatherTheme(condition) {
  document.body.className = "";
  const audioElement = document.getElementById("background-audio");
  if (!audioElement) {
    console.error("Audio element not found!");
    return;
  }
  let audioFile = "";
  condition = condition.toLowerCase();
  for (let key in weatherMoods) {
    if (condition.includes(key.toLowerCase())) {
      document.body.classList.add(key);
      audioFile = `./audio/${key}.mp3`;
      break;
    }
  }
  console.log("Selected Weather:", condition);
  console.log("Audio File Path:", audioFile);
  if (audioFile) {
    audioElement.src = audioFile;
    audioElement.load();
    audioElement
      .play()
      .then(() => console.log("Audio playing successfully"))
      .catch(() => {
        console.warn("Autoplay blocked, waiting for user interaction.");
        const enableAudio = () => {
          audioElement
            .play()
            .then(() => {
              console.log("Audio playing after user interaction");
              document.removeEventListener("click", enableAudio);
            })
            .catch((error) => console.error("Audio playback failed:", error));
        };
        document.addEventListener("click", enableAudio, { once: true });
      });
  } else {
    audioElement.pause();
    audioElement.src = "";
  }
}
let allSongs = [];
async function generatePlaylist() {
  const mood = document.getElementById("mood").value;
  const apiKey = "e2f7879c358811723f993dcc8b7b1e06";
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${apiKey}&format=json`;
  const playlistDiv = document.getElementById("playlist");
  playlistDiv.innerHTML = "";
  try {
    if (!allSongs.length || allSongs.mood !== mood) {
      const response = await fetch(url);
      const data = await response.json();
      if (data.tracks && data.tracks.track) {
        allSongs = { mood, songs: data.tracks.track };
      } else {
        playlistDiv.textContent = "No songs found for this mood.";
        return;
      }
    }
    let shuffledSongs = allSongs.songs.slice();
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = shuffledSongs[i];
      shuffledSongs[i] = shuffledSongs[j];
      shuffledSongs[j] = temp;
    }
    shuffledSongs = shuffledSongs.slice(0, 20);
    for (let i = 0; i < shuffledSongs.length; i++) {
      const song = shuffledSongs[i];
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <h4>${song.name}</h4>
                <p>${song.artist.name}</p>
            `;
      card.onclick = () => window.open(song.url, "_blank");
      playlistDiv.appendChild(card);
    }
  } catch (error) {
    playlistDiv.textContent = "Failed to generate playlist. Try again later.";
  }
}
function savePlaylist() {
  const songs = document.querySelectorAll(".playlist .card");
  if (songs.length === 0) {
    alert("No songs in the playlist to save.");
    return;
  }
  let playlistContent = "Your Personalized Playlist 🎵\n\n";
  songs.forEach((song, index) => {
    playlistContent += `${index + 1}. ${song.querySelector("h4").innerText} - ${
      song.querySelector("p").innerText
    }\n`;
  });
  const textarea = document.createElement("textarea");
  textarea.value = playlistContent;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Playlist copied to clipboard! Paste it into a text file and save.");
}
fetchWeather();
