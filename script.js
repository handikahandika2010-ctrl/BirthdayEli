const CONFIG = {
  birthdayPerson: "Elii",

  // Sapaan di atas surat
  letterGreeting: "dear eli,",

  letter: `happy birthday emelli🥳, aku harap di ulang tahun kamu yang ke-19 ini.. harapan dan impian yang kamu mau bisa jadi kenyataan yaa, terus bisa jadi kebanggaan buat papa, mama, keluarga, dan orang-orang disekitar kamu. walau kita baru kenal seminggu, aku seneng banget bisa ngobrol dan kenal sama kamu.. dan semoga sihh kedepannya kita bisa lebih saling mengenal lagi yaa😁. dan maaf banget yaa kalo misalnya aku ada bikin sesuatu hal yang bikin kamu risih atau ngga nyaman sama aku, bilang saja yaa. 

semoga kamu suka yaa sama web nyaa, walau masih jauh dari kata bagus😭🙏. terus jujur karna aku ngga punya foto kamu, jadi pakenya seadanya dehh wkwkwk. dan karna kamu suka berry jadi aku bikinin deh temanya berry, nah tapi kan kamu pernah bilang kamu suka berry yang "cherr" gitu, makanya username kamu cherr, tapi aku search ngga nemu itu berry yang kaya gimana.. jadi aku bikinnya yang ada dari google saja wkwkwk😭.

dan kamu harus happy terus yaaa😁.

生日快樂🥳🥳

— han`,
  songTitle: "Monokrom",
  songArtist: "a little soundtrack for today",

  compliments: [
    "you have a really lovely energy",
    "tiny reminder: you're pretty special.",
    "someone out there is very glad you exist"
  ]
};

// ---------- Basic setup ----------
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupOpening();
  setupNavigation();
  setupReveal();
  setupBerries();
  setupLetter();
  setupPhotos();
  setupMusic();
  setupCake();
  setupEasterEggs();
  setupHeroMascot();
});

// ---------- Configuration ----------
function applyConfig() {
  $("#heroName").textContent = CONFIG.birthdayPerson;
  $("#finalName").textContent = CONFIG.birthdayPerson;
  renderLetter();
  $("#songTitle").textContent = CONFIG.songTitle;
  $("#songArtist").textContent = CONFIG.songArtist;
  document.title = `Happy Birthday ${CONFIG.birthdayPerson}`;
}

// ---------- Opening ----------
function setupOpening() {
  const opening = $("#opening");
  const openBtn = $("#openBtn");
  const header = $("#siteHeader");
  const audio = $("#audio");

  document.body.classList.add("locked");

  openBtn.addEventListener("click", () => {
    opening.classList.add("is-hidden");
    header.classList.add("visible");
    document.body.classList.remove("locked");

    // Browsers generally allow audio after a user gesture.
    audio.volume = Number($("#volume")?.value || 0.7);
    audio.play().then(() => {
      updatePlayUI(true);
    }).catch(() => {
      // If the local MP3 does not exist yet, the rest of the site still works.
      showToast("Add your song to assets/music/birthday-song.mp3 ♫");
    });

    createParticles(18, ["♡", "✦", "✧", "•"], "opening");
    setTimeout(() => opening.remove(), 900);
  });
}

// ---------- Navigation ----------
function setupNavigation() {
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
  });

  $$("#mobileMenu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  // Highlight / close behavior is intentionally simple for GitHub Pages.
  $$(".desktop-nav a, .mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      const target = $(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ---------- Scroll reveal ----------
function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

// ---------- Berry garden ----------
function setupBerries() {
  $$(".berry-card").forEach((card, index) => {
    card.addEventListener("click", () => {
      $$(".berry-card").forEach(other => {
        if (other !== card) other.classList.remove("active");
      });

      const wasActive = card.classList.contains("active");
      card.classList.toggle("active");

      if (!wasActive) {
        const bubble = $(".speech-bubble", card);
        bubble.textContent = card.dataset.message;
        createParticles(5, ["♡", "✦"], "berry");
      }

      // Secret berry: extra interaction after multiple clicks.
      if (card.dataset.secret === "true") {
        const count = Number(card.dataset.clicks || 0) + 1;
        card.dataset.clicks = count;
        if (count >= 3) {
          showToast("cieeeee ultahhhh");
          createParticles(12, ["♡", "✦", "hehe"], "secret");
          card.dataset.clicks = 0;
        }
      }
    });

    card.addEventListener("mouseenter", () => {
      const character = $(".mini-berry", card);
      if (character) {
        character.animate(
          [{ transform: "scale(.82) rotate(0deg)" }, { transform: "scale(.88) rotate(-3deg)" }, { transform: "scale(.82) rotate(0deg)" }],
          { duration: 500, easing: "ease-out" }
        );
      }
    });
  });
}

// ---------- Letter ----------
// Surat dipecah per paragraf (baris kosong = paragraf baru).
// Paragraf terakhir yang diawali "—" otomatis jadi tanda tangan,
// dan paragraf yang isinya hanya tulisan Mandarin/Jepang/Korea diberi gaya khusus.
function renderLetter() {
  $("#letterTitle").textContent = CONFIG.letterGreeting;
  const box = $("#letterContent");
  box.textContent = "";

  const blocks = CONFIG.letter
    .split(/\n\s*\n/)
    .map(text => text.split("\n").map(line => line.trim()).join("\n").trim())
    .filter(Boolean);

  blocks.forEach((text, index) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.setProperty("--i", index + 1);

    const isCjkOnly = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(text) && !/[A-Za-z]/.test(text);
    if (isCjkOnly) p.className = "letter-zh";
    if (index === blocks.length - 1 && /^[—–-]\s*\S/.test(text)) p.className = "letter-sign";

    box.append(p);
  });
}

function setupLetter() {
  const stage = $("#letterStage");
  const box = $("#envelopeBox");
  const envelope = $("#envelope");
  const paper = $("#letterPaper");
  const hint = $("#letterHint");
  const closeBtn = $("#letterClose");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, reduced ? 0 : ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function openLetter() {
    clearTimers();
    box.classList.add("opened");
    envelope.setAttribute("aria-expanded", "true");
    createParticles(20, ["♡", "♥", "✦", "✧"], "letter");

    // 1) flap terbuka + kertas mengintip, 2) amplop menyusut dan surat melebar
    later(() => {
      stage.classList.add("reading");
      hint.textContent = "🍓";
    }, 950);

    // 3) setelah surat melebar, gulir halus supaya awal surat pas di layar
    later(() => {
      const top = paper.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }, 1250);
  }

  function closeLetter() {
    clearTimers();
    stage.classList.remove("reading");
    hint.textContent = "click the envelope";
    later(() => {
      box.classList.remove("opened");
      envelope.setAttribute("aria-expanded", "false");
    }, 500);
    const top = stage.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }

  envelope.addEventListener("click", openLetter);
  closeBtn.addEventListener("click", closeLetter);
}

// ---------- Photo placeholders ----------
function setupPhotos() {
  $$(".photo-frame img").forEach(img => {
    img.addEventListener("load", () => {
      img.closest(".photo-frame").classList.add("has-image");
    });

    img.addEventListener("error", () => {
      img.style.display = "none";
    });

    // Cached image case.
    if (img.complete && img.naturalWidth > 0) {
      img.closest(".photo-frame").classList.add("has-image");
    }
  });
}

// ---------- Music player ----------
function setupMusic() {
  const audio = $("#audio");
  const playBtn = $("#playBtn");
  const muteBtn = $("#muteBtn");
  const progress = $("#progress");
  const volume = $("#volume");

  audio.volume = Number(volume.value);

  playBtn.addEventListener("click", toggleAudio);

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "♫";
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    if (audio.muted && audio.volume > 0) {
      audio.muted = false;
      muteBtn.textContent = "♫";
    }
  });

  progress.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progress.value = (audio.currentTime / audio.duration) * 100;
    $("#currentTime").textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    $("#duration").textContent = formatTime(audio.duration);
  });

  audio.addEventListener("play", () => updatePlayUI(true));
  audio.addEventListener("pause", () => updatePlayUI(false));
  audio.addEventListener("ended", () => updatePlayUI(false));

  function toggleAudio() {
    if (audio.paused) {
      audio.play().catch(() => showToast("Add your MP3 file first ♫"));
    } else {
      audio.pause();
    }
  }
}

function updatePlayUI(playing) {
  const btn = $("#playBtn");
  const card = $(".music-card");
  if (!btn || !card) return;
  btn.textContent = playing ? "Ⅱ" : "▶";
  btn.setAttribute("aria-label", playing ? "Pause" : "Play");
  card.classList.toggle("playing", playing);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

// ---------- Birthday cake ----------
function setupCake() {
  const wishBtn = $("#wishBtn");
  const scene = $(".cake-scene");
  const message = $("#wishMessage");
  let wished = false;

  wishBtn.addEventListener("click", () => {
    if (wished) return;
    wished = true;
    scene.classList.add("blown");
    wishBtn.disabled = true;
    wishBtn.style.opacity = ".65";

    createParticles(35, ["✦", "✧", "♡", "•"], "wish");
    message.textContent = "Whatever you're wishing for, I hope it finds you.";

    setTimeout(() => {
      message.innerHTML = `Happy Birthday, <em>${escapeHtml(CONFIG.birthdayPerson)}</em> ♡`;
      message.style.fontSize = "1.8rem";
    }, 3600);
  });
}

// ---------- Hero mascot ----------
function setupHeroMascot() {
  const mascot = $('[data-berry="hero"]');
  if (!mascot) return;

  mascot.addEventListener("click", () => {
    const eyes = $$(".eye", mascot);
    eyes.forEach(eye => {
      eye.animate(
        [{ transform: "scaleY(1)" }, { transform: "scaleY(.08)" }, { transform: "scaleY(1)" }],
        { duration: 420, easing: "ease-in-out" }
      );
    });
    createParticles(8, ["♡", "✦"], "hero");
  });
}

// ---------- Easter eggs ----------
function setupEasterEggs() {
  // Clicking any small heart in the ending gives a random compliment.
  $$(".ending-copy").forEach(area => {
    area.addEventListener("click", event => {
      if (event.target.tagName.toLowerCase() === "em") {
        const message = CONFIG.compliments[Math.floor(Math.random() * CONFIG.compliments.length)];
        showToast(message);
        createParticles(7, ["♡", "✦"], "compliment");
      }
    });
  });

  // Kata rahasia "berry": bisa diketik langsung di keyboard (desktop)
  // ATAU lewat kolom "secret word" di bagian akhir (untuk HP).
  const SECRET_WORDS = {
    berry: () => {
      showToast("我想問你一件事…你的感覺和我一樣嗎？");
      createParticles(25, ["🍓", "🫐", "🍒", "♡"], "keyboard");
    },
    cherr: () => {
      showToast("a very good username ♡");
      createParticles(18, ["🍒", "♡", "✦"], "keyboard");
    }
  };

  let sequence = "";
  window.addEventListener("keydown", event => {
    if (event.target.closest("input, textarea")) return;   // jangan dobel dengan kolom input
    if (event.key.length !== 1) return;
    sequence = (sequence + event.key.toLowerCase()).slice(-5);
    if (sequence === "berry") {
      SECRET_WORDS.berry();
      sequence = "";
    }
  });

  const form = $("#secretForm");
  const input = $("#secretInput");
  if (form && input) {
    const tryWord = (isSubmit) => {
      const word = input.value.trim().toLowerCase();
      if (SECRET_WORDS[word]) {
        SECRET_WORDS[word]();
        input.value = "";
        input.blur();
        return true;
      }
      if (isSubmit && word) {
        showToast("hmm, not that one… try again 🍓");
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
      }
      return false;
    };
    input.addEventListener("input", () => tryWord(false));   // langsung bereaksi saat kata benar
    form.addEventListener("submit", event => { event.preventDefault(); tryWord(true); });
  }

  // Heart clicks anywhere in text.
  document.addEventListener("click", event => {
    if (event.target.closest(".final-wish, .signature")) {
      const message = CONFIG.compliments[Math.floor(Math.random() * CONFIG.compliments.length)];
      showToast(message);
    }
  });
}

// ---------- Particle system ----------
function createParticles(count, symbols, source = "default") {
  const layer = $("#particle-layer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--x", `${(Math.random() - .5) * 300}px`);
    particle.style.setProperty("--rotate", `${(Math.random() - .5) * 90}deg`);
    particle.style.setProperty("--duration", `${1.6 + Math.random() * 1.8}s`);
    particle.style.setProperty("--size", `${.7 + Math.random() * .9}rem`);
    particle.style.animationDelay = `${Math.random() * .25}s`;
    layer.appendChild(particle);
    setTimeout(() => particle.remove(), 3800);
  }
}

// ---------- Toast ----------
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// Small safety helper because the name is user-editable.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}