/**
 * WeatherBot — script.js
 * Modularny silnik chatbota pogodowego
 * Technologie: Vanilla JS (ES6+), Fetch API, LocalStorage
 */

'use strict';

/* ============================================================
   MODUŁ: Konfiguracja
   ============================================================ */
const CONFIG = {
  TYPING_DELAY_MIN: 700,   // ms — minimalne opóźnienie odpowiedzi bota
  TYPING_DELAY_MAX: 1600,  // ms — maksymalne opóźnienie odpowiedzi bota
  HISTORY_KEY: 'weatherbot_history',
  DARK_MODE_KEY: 'weatherbot_dark',
  API_KEY_STORAGE: 'weatherbot_api_key',
  OPENWEATHER_URL: 'https://api.openweathermap.org/data/2.5/weather',
};

/* ============================================================
   MODUŁ: Baza wiedzy — ubiór do pogody
   ============================================================ */

/**
 * Zwraca rekomendacje ubioru na podstawie temperatury i warunków pogodowych.
 * @param {number|null} temp  — temperatura w °C (null = nieznana)
 * @param {Object}       cond — flagi warunków {rain, snow, wind, fog, sun, storm, hot}
 * @returns {Object} obiekt z sekcjami: stroj, dodatki, ochrona, styl
 */
function getClothingRecommendation(temp, cond) {
  const rec = {
    intro: '',
    stroj: [],
    dodatki: [],
    ochrona: [],
    styl: '',
    emoji: '🌡️',
  };

  // ---------- Temperatura ----------
  if (temp !== null) {
    if (temp <= -15) {
      rec.emoji = '🥶';
      rec.intro = `Ekstremalne zimno (${temp}°C)! Ubierz się bardzo ciepło.`;
      rec.stroj = ['Gruba kurtka zimowa (puchowa lub wełniana)', 'Bielizna termiczna (góra i dół)', 'Grube spodnie lub ocieplane jeansy', 'Gruby sweter lub bluza polarowa'];
      rec.dodatki = ['Czapka zakrywająca uszy', 'Szalik lub komin', 'Grube rękawice lub rękawiczki', 'Ciepłe skarpety wełniane', 'Ocieplane buty/śniegowce'];
      rec.styl = 'Layering — wielowarstwowość to klucz. Styl: sporty zimowe lub urban parka.';
    } else if (temp <= 0) {
      rec.emoji = '❄️';
      rec.intro = `Mróz (${temp}°C) — ubierz się bardzo ciepło.`;
      rec.stroj = ['Kurtka zimowa z podszewką', 'Sweter lub bluza', 'Termiczne lub grube spodnie', 'Bielizna termiczna polecana'];
      rec.dodatki = ['Czapka i szalik', 'Rękawiczki', 'Grube skarpety', 'Buty zimowe lub śniegowce'];
      rec.styl = 'Klasyczny styl zimowy: monochromatyczny lub parki z futrzanym kapturem.';
    } else if (temp <= 5) {
      rec.emoji = '🧥';
      rec.intro = `Bardzo chłodno (${temp}°C) — ciepła kurtka obowiązkowa.`;
      rec.stroj = ['Ciepła kurtka (zimowa lub jesienno-zimowa)', 'Sweter lub bluza z kapturem', 'Długie spodnie (jeansy lub dresowe)'];
      rec.dodatki = ['Czapka', 'Szalik', 'Lekkie rękawiczki', 'Ciepłe buty'];
      rec.styl = 'Casual-warm: oversized sweter, kurtka bomber lub parka.';
    } else if (temp <= 10) {
      rec.emoji = '🧤';
      rec.intro = `Chłodno (${temp}°C) — zadbaj o warstwy.`;
      rec.stroj = ['Kurtka jesienno-zimowa lub płaszcz', 'Długa bluzka lub sweter', 'Długie spodnie'];
      rec.dodatki = ['Lekka czapka lub czapka z daszkiem', 'Szalik', 'Buty jesienne'];
      rec.styl = 'Smart-casual: płaszcz wełniany, sweter z golfem, botki.';
    } else if (temp <= 15) {
      rec.emoji = '🍂';
      rec.intro = `Umiarkowanie chłodno (${temp}°C) — lekka kurtka wystarczy.`;
      rec.stroj = ['Lekka kurtka lub kurtka przejściowa', 'Bluza lub sweter', 'Długie spodnie lub jeansy'];
      rec.dodatki = ['Ewentualnie lekki szalik', 'Trampki lub buty casual'];
      rec.styl = 'Casual: bluza z jeansami, sneakersy — komfortowo i stylowo.';
    } else if (temp <= 20) {
      rec.emoji = '🌤️';
      rec.intro = `Przyjemna temperatura (${temp}°C) — bez przesady z warstwami.`;
      rec.stroj = ['Koszulka z długim rękawem lub lekka bluzka', 'Lekka kurtka lub kardigan (na wieczór)', 'Jeansy lub spodnie casual'];
      rec.dodatki = ['Trampki lub buty casualowe'];
      rec.styl = 'Street style: t-shirt, jeansy, lekka kurtka dżinsowa lub bomber.';
    } else if (temp <= 26) {
      rec.emoji = '☀️';
      rec.intro = `Ciepło (${temp}°C) — idealny dzień na lekkie ubrania.`;
      rec.stroj = ['T-shirt lub koszulka', 'Szorty lub lekkie spodnie', 'Sukienka / lekka spódnica (opcja)'];
      rec.dodatki = ['Okulary przeciwsłoneczne', 'Lekki krem SPF 30+', 'Sandały lub trampki'];
      rec.styl = 'Summer casual: jasne kolory, naturalne tkaniny (bawełna, len).';
    } else {
      rec.emoji = '🔥';
      rec.intro = `Gorąco (${temp}°C)! Ubierz się lekko i chroń przed słońcem.`;
      rec.stroj = ['Bardzo lekka koszulka lub top', 'Szorty lub lekka spódnica', 'Materiały: bawełna, len, bambus'];
      rec.dodatki = ['Okulary przeciwsłoneczne', 'Kapelusz lub czapka z daszkiem', 'Krem SPF 50+', 'Butelka wody!'];
      rec.ochrona = ['Unikaj wychodzenia w godzinach 11:00–15:00', 'Pij dużo wody', 'Noś jasne kolory odbijające słońce'];
      rec.styl = 'Beach vibes: lekkie, przewiewne, jasne kolory. Minimalizm.';
    }
  } else {
    rec.intro = 'Nie podałeś temperatury — oto ogólne wskazówki:';
    rec.stroj = ['Sprawdź aktualną temperaturę na zewnątrz'];
    rec.styl = 'Dobierz ubiór do warunków pogodowych.';
  }

  // ---------- Warunki pogodowe (nakładają się na temperaturę) ----------
  if (cond.rain) {
    rec.emoji = '🌧️';
    rec.ochrona.push('Kurtka lub peleryna przeciwdeszczowa');
    rec.ochrona.push('Parasol (składany do plecaka)');
    rec.ochrona.push('Wodoodporne buty lub kalosze');
    if (!rec.intro.includes('deszcz')) {
      rec.intro += ' Pada deszcz — weź parasol i wodoodporne obuwie.';
    }
  }

  if (cond.snow) {
    rec.emoji = '❄️';
    rec.ochrona.push('Śniegowce lub buty z ociepleniem');
    rec.ochrona.push('Nieprzemakalny kombinezon lub spodnie');
    if (!rec.stroj.some(s => s.toLowerCase().includes('śnieg'))) {
      rec.ochrona.push('Uważaj na oblodzone chodniki!');
    }
  }

  if (cond.wind) {
    rec.ochrona.push('Kurtka wiatroodporna lub softshell');
    rec.ochrona.push('Szalik lub komin chroniący szyję');
    if (!rec.intro.includes('wia')) {
      rec.intro += ' Silny wiatr — załóż wiatrówkę.';
    }
  }

  if (cond.fog) {
    rec.ochrona.push('Noś odblaskowe lub jasne elementy odzieży');
    rec.intro += ' Mgła — zadbaj o widoczność!';
  }

  if (cond.storm) {
    rec.emoji = '⛈️';
    rec.ochrona.push('Zostań w domu jeśli możesz');
    rec.ochrona.push('Jeśli musisz wyjść: wodoodporna kurtka, unikaj otwartych terenów');
    rec.intro = `⚠️ Burza! Zachowaj ostrożność. ${rec.intro}`;
  }

  if (cond.sun && temp !== null && temp > 20) {
    rec.dodatki.push('Krem z filtrem UV obowiązkowy!');
  }

  return rec;
}

/* ============================================================
   MODUŁ: Analizator wiadomości
   ============================================================ */

/**
 * Wyciąga temperaturę z tekstu użytkownika.
 * Obsługuje formy: "5 stopni", "-3°C", "5 st.", "temperatura 10", "20 degrees"
 * @param {string} text
 * @returns {number|null}
 */
function parseTemperature(text) {
  const normalized = text
    .replace(/minus\s*/gi, '-')
    .replace(/plus\s*/gi, '')
    .replace(/poniżej zera/gi, '-');

  // Wzorce: liczba + stopni/°C/st/degrees
  const patterns = [
    /([+-]?\d+(?:[.,]\d+)?)\s*°?\s*c\b/i,
    /([+-]?\d+(?:[.,]\d+)?)\s*stopni/i,
    /([+-]?\d+(?:[.,]\d+)?)\s*st\b/i,
    /temperatura[:\s]+([+-]?\d+(?:[.,]\d+)?)/i,
    /jest\s+([+-]?\d+(?:[.,]\d+)?)\s*(?:stopni|°|st)?/i,
    /([+-]?\d+(?:[.,]\d+)?)\s*degrees?/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
  }
  return null;
}

/**
 * Wykrywa warunki pogodowe z tekstu.
 * @param {string} text
 * @returns {Object} flagi warunków
 */
function parseWeatherConditions(text) {
  const t = text.toLowerCase();
  return {
    rain:  /deszcz|pada|mżawka|ulewa|rain|drizzle|shower/.test(t),
    snow:  /śnieg|sypie|śnieży|zasp|snow|blizzard/.test(t),
    wind:  /wiatr|wietrzno|wieje|podmuchy|wind|gusty|breez/.test(t),
    fog:   /mgła|mglisty|fog|mist/.test(t),
    sun:   /słońce|słonecznie|ładna pogoda|bezchmurnie|sunny|clear/.test(t),
    storm: /burza|grzmot|pioruny|storm|thunder/.test(t),
    hot:   /gorąco|upał|skwar|heat/.test(t),
    cold:  /zimno|mróz|lodowato|cold|freeze|icy/.test(t),
  };
}

/**
 * Sprawdza, czy pytanie dotyczy konkretnej kategorii ubioru.
 */
function detectSpecificQuery(text) {
  const t = text.toLowerCase();
  if (/buty|obuwie|shoe|boot/.test(t)) return 'shoes';
  if (/czapka|hat|cap/.test(t)) return 'hat';
  if (/kurtka|jacket|coat/.test(t)) return 'jacket';
  if (/parasol|umbrella/.test(t)) return 'umbrella';
  if (/rękawiczki|gloves/.test(t)) return 'gloves';
  return null;
}

/**
 * Główna funkcja analizująca wiadomość i budująca odpowiedź bota.
 * @param {string} userText
 * @returns {string} HTML z odpowiedzią bota
 */
function botResponse(userText) {
  const text = userText.trim();
  const lower = text.toLowerCase();

  // --- Powitania ---
  if (/^(cześć|hej|siema|hi|hello|witaj|dzień dobry|dobry wieczór)\b/i.test(lower)) {
    return buildHTML('👋', 'Cześć! Jestem WeatherBot — Twoim osobistym doradcą ubioru.',
      ['Opisz mi aktualną pogodę za oknem (np. <em>"Jest 8 stopni i pada deszcz"</em>)',
       'Możesz też kliknąć 🌍 <strong>Miasto</strong>, żebym pobrał pogodę automatycznie.'],
    );
  }

  // --- Pożegnania ---
  if (/\b(pa|do widzenia|żegnaj|bye|goodbye|na razie)\b/i.test(lower)) {
    return buildHTML('👋', 'Do zobaczenia! Ubieraj się zawsze odpowiednio do pogody 😊', []);
  }

  // --- Pomoc ---
  if (/\b(pomoc|help|co umiesz|co potrafisz|instrukcja)\b/i.test(lower)) {
    return buildHTML('ℹ️', 'Oto co potrafię:', [
      '🌡️ Analiza temperatury z Twojego opisu',
      '🌧️ Wykrywanie warunków: deszcz, śnieg, wiatr, mgła, burza',
      '👗 Rekomendacje: strój, dodatki, ochrona, styl',
      '🌍 Pobieranie pogody z OpenWeather API (kliknij przycisk Miasto)',
      '📜 Pamiętam historię Twojej rozmowy (LocalStorage)',
      'Przykład: <em>"Jest 7 stopni i pada deszcz"</em>',
    ]);
  }

  // --- Dziękuję ---
  if (/\b(dzięki|dziękuję|thanks|thx|super|świetnie|fajnie)\b/i.test(lower)) {
    const acks = [
      'Nie ma za co! Jeśli masz więcej pytań o pogodę — śmiało 😊',
      'Cieszę się, że mogłem pomóc! Ubieraj się stylowo 🧥',
      'Zawsze do usług! Sprawdź też przyciski szybkich sugestii poniżej 👇',
    ];
    return buildHTML('😊', acks[Math.floor(Math.random() * acks.length)], []);
  }

  // --- Pytanie o pogodę bez opisu ---
  if (/\b(jaka|jaka jest|jak|jaką|pogoda)\b.*\b(pogoda|temperatura|temperat)\b/i.test(lower)
      && !parseTemperature(text) && !parseWeatherConditions(text).rain) {
    return buildHTML('🤔', 'Nie mam dostępu do Twojej lokalizacji automatycznie.', [
      'Kliknij przycisk <strong>🌍 Miasto</strong> i wpisz nazwę miasta, żebym pobrał pogodę.',
      'Albo opisz mi pogodę słowami, np. <em>"Jest 12 stopni i zachmurzenie"</em>.',
    ]);
  }

  // --- Analiza pogody z tekstu ---
  const temp = parseTemperature(text);
  const cond = parseWeatherConditions(text);
  const hasWeatherInfo = temp !== null
    || cond.rain || cond.snow || cond.wind || cond.fog || cond.storm || cond.hot || cond.cold;

  if (!hasWeatherInfo) {
    return buildHTML('🤷', 'Hmm, nie rozumiem pytania o pogodę.', [
      'Opisz pogodę, np.: <em>"Jest 5 stopni i pada deszcz"</em>',
      'Lub kliknij jedno z gotowych scenariuszy poniżej ⬇️',
    ]);
  }

  const rec = getClothingRecommendation(temp, cond);
  return formatRecommendation(rec);
}

/**
 * Formatuje rekomendację jako HTML wiadomości bota.
 */
function formatRecommendation(rec) {
  let html = `<span class="emoji-tag">${rec.emoji}</span> <strong>${rec.intro}</strong>`;

  if (rec.stroj.length > 0) {
    html += `<div class="rec-section"><strong>👗 Strój</strong><ul>`;
    rec.stroj.forEach(item => { html += `<li>${item}</li>`; });
    html += `</ul></div>`;
  }

  if (rec.dodatki.length > 0) {
    html += `<div class="rec-section"><strong>🎒 Dodatki</strong><ul>`;
    rec.dodatki.forEach(item => { html += `<li>${item}</li>`; });
    html += `</ul></div>`;
  }

  if (rec.ochrona.length > 0) {
    html += `<div class="rec-section"><strong>🛡️ Ochrona</strong><ul>`;
    rec.ochrona.forEach(item => { html += `<li>${item}</li>`; });
    html += `</ul></div>`;
  }

  if (rec.styl) {
    html += `<div class="rec-section"><strong>✨ Styl</strong><ul><li>${rec.styl}</li></ul></div>`;
  }

  return html;
}

/**
 * Buduje prosty HTML dla odpowiedzi bota bez listy odzieży.
 */
function buildHTML(emoji, intro, items) {
  let html = `<span class="emoji-tag">${emoji}</span> ${intro}`;
  if (items.length > 0) {
    html += '<ul>';
    items.forEach(item => { html += `<li>${item}</li>`; });
    html += '</ul>';
  }
  return html;
}

/* ============================================================
   MODUŁ: OpenWeather API
   ============================================================ */

/**
 * Pobiera pogodę dla danego miasta z OpenWeatherMap API.
 * @param {string} city
 * @param {string} apiKey
 * @returns {Promise<Object>} dane pogodowe
 */
async function fetchWeather(city, apiKey) {
  const url = `${CONFIG.OPENWEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&lang=pl&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) throw new Error('Nieprawidłowy klucz API. Zarejestruj się na openweathermap.org.');
    if (response.status === 404) throw new Error(`Nie znaleziono miasta: "${city}". Sprawdź pisownię.`);
    throw new Error(`Błąd API: ${response.status}`);
  }
  return response.json();
}

/**
 * Przetwarza dane z API i generuje odpowiedź chatbota.
 * @param {Object} data — surowe dane z OpenWeather
 * @returns {string} HTML rekomendacji
 */
function processWeatherData(data) {
  const temp   = Math.round(data.main.temp);
  const feels  = Math.round(data.main.feels_like);
  const desc   = data.weather[0].description;
  const wId    = data.weather[0].id;
  const wind   = data.wind.speed;
  const city   = data.name;

  const cond = {
    rain:  (wId >= 200 && wId < 600) || (wId >= 700 && wId < 800 && wId === 701),
    snow:  wId >= 600 && wId < 700,
    wind:  wind > 8,
    fog:   wId >= 700 && wId < 800,
    sun:   wId === 800,
    storm: wId >= 200 && wId < 300,
    hot:   temp > 28,
    cold:  temp < 5,
  };

  const rec = getClothingRecommendation(temp, cond);

  let header = `<span class="emoji-tag">${rec.emoji}</span> `;
  header += `<strong>Pogoda w ${city}: ${temp}°C</strong> (odczuwalna ${feels}°C)<br>`;
  header += `<em>${desc.charAt(0).toUpperCase() + desc.slice(1)}</em>, wiatr ${wind} m/s<br><br>`;

  return header + formatRecommendation(rec);
}

/* ============================================================
   MODUŁ: DOM — Wiadomości
   ============================================================ */

const chatBox        = document.getElementById('chat-box');
const userInput      = document.getElementById('user-input');
const btnSend        = document.getElementById('btn-send');
const typingIndicator = document.getElementById('typing-indicator');

/**
 * Dodaje wiadomość do okna czatu.
 * @param {string}  content   — tekst lub HTML
 * @param {'user'|'bot'} sender
 * @param {boolean} isHTML    — czy treść to HTML
 */
function addMessage(content, sender, isHTML = false) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', `${sender}-message`);

  const meta = document.createElement('div');
  meta.classList.add('message-meta');
  meta.textContent = sender === 'user' ? `Ty · ${getTime()}` : `WeatherBot · ${getTime()}`;

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');

  if (isHTML) {
    bubble.innerHTML = content;
  } else {
    bubble.textContent = content;
  }

  wrapper.appendChild(meta);
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);

  scrollToBottom();
  saveHistory();
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getTime() {
  return new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

/* ============================================================
   MODUŁ: Typing Indicator
   ============================================================ */

function showTyping() {
  typingIndicator.hidden = false;
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.hidden = true;
}

/**
 * Symuluje opóźnienie pisania bota, potem wyświetla odpowiedź.
 * @param {string}  content
 * @param {boolean} isHTML
 */
function botReplyWithDelay(content, isHTML = false) {
  showTyping();
  const delay = CONFIG.TYPING_DELAY_MIN
    + Math.random() * (CONFIG.TYPING_DELAY_MAX - CONFIG.TYPING_DELAY_MIN);
  setTimeout(() => {
    hideTyping();
    addMessage(content, 'bot', isHTML);
  }, delay);
}

/* ============================================================
   MODUŁ: Wysyłanie wiadomości
   ============================================================ */

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  userInput.focus();

  const response = botResponse(text);
  botReplyWithDelay(response, true);
}

/* ============================================================
   MODUŁ: LocalStorage — Historia czatu
   ============================================================ */

/**
 * Zapisuje widoczną historię wiadomości do localStorage.
 */
function saveHistory() {
  const messages = [];
  chatBox.querySelectorAll('.message').forEach(msg => {
    const isUser = msg.classList.contains('user-message');
    const bubble = msg.querySelector('.message-bubble');
    messages.push({
      sender: isUser ? 'user' : 'bot',
      content: isUser ? bubble.textContent : bubble.innerHTML,
      isHTML: !isUser,
      meta: msg.querySelector('.message-meta')?.textContent || '',
    });
  });

  try {
    localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(messages.slice(-60)));
  } catch (e) {
    // localStorage pełny lub niedostępny
  }
}

/**
 * Wczytuje historię z localStorage przy starcie.
 */
function loadHistory() {
  try {
    const raw = localStorage.getItem(CONFIG.HISTORY_KEY);
    if (!raw) return false;
    const messages = JSON.parse(raw);
    if (!Array.isArray(messages) || messages.length === 0) return false;

    messages.forEach(({ sender, content, isHTML }) => {
      addMessage(content, sender, isHTML);
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Czyści historię czatu i localStorage.
 */
function clearHistory() {
  chatBox.innerHTML = '';
  localStorage.removeItem(CONFIG.HISTORY_KEY);
  showWelcome();
}

/* ============================================================
   MODUŁ: Dark Mode
   ============================================================ */

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('btn-dark').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem(CONFIG.DARK_MODE_KEY, isDark ? '1' : '0');
}

function loadDarkMode() {
  const saved = localStorage.getItem(CONFIG.DARK_MODE_KEY);
  if (saved === '1') {
    document.body.classList.add('dark');
    document.getElementById('btn-dark').textContent = '☀️';
  }
}

/* ============================================================
   MODUŁ: Modal — Pobieranie pogody przez API
   ============================================================ */

const cityModal      = document.getElementById('city-modal');
const modalBackdrop  = document.getElementById('modal-backdrop');
const cityInput      = document.getElementById('city-input');
const apiKeyInput    = document.getElementById('api-key-input');

function openCityModal() {
  cityModal.hidden       = false;
  modalBackdrop.hidden   = false;
  cityInput.value        = '';
  const savedKey = localStorage.getItem(CONFIG.API_KEY_STORAGE) || '';
  apiKeyInput.value = savedKey;
  setTimeout(() => cityInput.focus(), 50);
}

function closeCityModal() {
  cityModal.hidden       = true;
  modalBackdrop.hidden   = true;
}

async function fetchCityWeather() {
  const city   = cityInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!city) {
    cityInput.focus();
    return;
  }

  if (!apiKey) {
    // Demo mode — brak klucza, symulujemy dane
    closeCityModal();
    addMessage(`Szukam pogody dla: ${city}…`, 'user');
    botReplyWithDelay(
      `<span class="emoji-tag">🔑</span> <strong>Brak klucza API!</strong><br>` +
      `Aby pobrać prawdziwą pogodę dla <em>${city}</em>, wpisz swój klucz API z ` +
      `<a href="https://openweathermap.org/api" target="_blank" rel="noopener" style="color:#86efac">openweathermap.org</a>.<br><br>` +
      `<strong>Jak uzyskać klucz:</strong><ul><li>Zarejestruj się bezpłatnie na openweathermap.org</li>` +
      `<li>Przejdź do sekcji "API keys"</li><li>Skopiuj swój klucz i wklej go w oknie "🌍 Miasto"</li></ul>`,
      true
    );
    return;
  }

  // Zapisz klucz API do localStorage
  try { localStorage.setItem(CONFIG.API_KEY_STORAGE, apiKey); } catch (e) {}
  closeCityModal();
  addMessage(`Pobierz pogodę dla: ${city}`, 'user');
  showTyping();

  try {
    const data = await fetchWeather(city, apiKey);
    hideTyping();
    const response = processWeatherData(data);
    addMessage(response, 'bot', true);
  } catch (err) {
    hideTyping();
    addMessage(
      `<span class="emoji-tag">❌</span> <strong>Błąd:</strong> ${err.message}`,
      'bot',
      true
    );
  }
}

/* ============================================================
   MODUŁ: Welcome screen
   ============================================================ */

function showWelcome() {
  const welcome = document.createElement('div');
  welcome.classList.add('welcome-msg');
  welcome.innerHTML = `
    <span class="welcome-icon">🌤️</span>
    <h2>Witaj w WeatherBot!</h2>
    <p>Opisz mi pogodę za oknem, a powiem Ci co założyć.<br>
       Możesz też kliknąć <strong>🌍 Miasto</strong>, żebym pobrał pogodę automatycznie.</p>
  `;
  chatBox.appendChild(welcome);
}

/* ============================================================
   MODUŁ: Event Listeners
   ============================================================ */

function initEventListeners() {
  // Wyślij przez Enter
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Przycisk wyślij
  btnSend.addEventListener('click', sendMessage);

  // Szybkie sugestie
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      userInput.value = chip.dataset.text;
      sendMessage();
    });
  });

  // Dark mode
  document.getElementById('btn-dark').addEventListener('click', toggleDarkMode);

  // Wyczyść historię
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('Wyczyścić całą historię rozmowy?')) clearHistory();
  });

  // Otwórz modal
  document.getElementById('btn-city').addEventListener('click', openCityModal);

  // Zamknij modal
  document.getElementById('btn-city-cancel').addEventListener('click', closeCityModal);
  modalBackdrop.addEventListener('click', closeCityModal);

  // Potwierdź miasto
  document.getElementById('btn-city-confirm').addEventListener('click', fetchCityWeather);
  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchCityWeather();
  });

  // ESC zamyka modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cityModal.hidden) closeCityModal();
  });
}

/* ============================================================
   INICJALIZACJA APLIKACJI
   ============================================================ */

function init() {
  loadDarkMode();
  initEventListeners();

  const hasHistory = loadHistory();
  if (!hasHistory) {
    showWelcome();
    // Przywitanie bota po chwili
    setTimeout(() => {
      botReplyWithDelay(
        buildHTML('👋', 'Cześć! Jestem <strong>WeatherBot</strong> — Twoim doradcą ubioru.', [
          'Opisz mi aktualną pogodę, np.: <em>"Jest 7 stopni i pada deszcz"</em>',
          'Kliknij <strong>🌍 Miasto</strong>, żebym pobrał pogodę automatycznie.',
          'Lub skorzystaj z gotowych scenariuszy poniżej ⬇️',
        ]),
        true
      );
    }, 400);
  }

  scrollToBottom();
}

// Uruchom po załadowaniu DOM
document.addEventListener('DOMContentLoaded', init);
