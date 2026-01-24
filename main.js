// =====================
// JS SPANIZE
// =====================
document.querySelectorAll('.js-spanize').forEach(el => {
    const text = el.textContent;
    const spanned = text.split('').map((char, i) => `<span style="--i:${i}">${char}</span>`).join('');
    el.innerHTML = spanned;
});

// =====================
// SPANIZE ON SCROLL
// =====================
const spanizeElements = document.querySelectorAll('.js-spanize');

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Empêche de rejouer l'animation
                if (el.dataset.spanized) return;

                const text = el.textContent;
                el.innerHTML = text
                    .split('')
                    .map((char, i) => {
                        const safeChar = char === ' ' ? '&nbsp;' : char;
                        return `<span style="--i:${i}">${safeChar}</span>`;
                    })
                    .join('');

                el.dataset.spanized = 'true';
                observer.unobserve(el);
            }
        });
    },
    {
        threshold: 0.3
    }
);

spanizeElements.forEach(el => observer.observe(el));

// =====================
// DATA
// =====================
const tasks = [
  { text: 'Nabosani te.', audio: 'wav/Ningala_1.wav' },
  { text: 'I remember.', audio: 'wav/Raf_Anglais_1.wav' },
  { text: 'Mwen sonje.', audio: 'wav/Fec_Creole_1.wav' },
  { text: 'Yfy yé capte.', audio: 'wav/MArtial_Noushi_1.wav' },
  { text: 'Lembro-me.', audio: 'wav/Raf_Portugais_1.wav' },
  { text: 'Me kakye.', audio: 'wav/Japhet_Enzima_1.wav' },
  { text: '我记得.', audio: 'wav/Melodie_Teochew_1.wav' },
  { text: 'Je me souviens.', audio: 'wav/Louanne_Francais_1.wav' },
];

// =====================
// ELEMENTS
// =====================
const task = document.getElementById('task');
const intro = document.querySelector('.intro');
const soundToggle = document.getElementById('soundToggle');

// SVG anims
const a1 = document.getElementById("a1");
const a2 = document.getElementById("a2");
const aa1 = document.getElementById("aa1");
const aa2 = document.getElementById("aa2");

// =====================
// ETAT GLOBAL
// =====================
let index = 0;
let soundEnabled = false;
let audioStarted = false;
let isInIntro = true;

const audio = new Audio();
audio.volume = 0;

// =====================
// FADE
// =====================
let fading = false;

function fadeTo(target) {
  if (fading) return;
  fading = true;

  const step = () => {
    const diff = target - audio.volume;
    if (Math.abs(diff) < 0.01) {
      audio.volume = target;
      fading = false;
      return;
    }
    audio.volume += diff * 0.1;
    requestAnimationFrame(step);
  };

  step();
}

// =====================
// CAROUSEL
// =====================
function playTask(i) {
  if (!task) return;

  const { text, audio: src } = tasks[i];

  task.classList.remove('pre-animation', 'post-animation');
  void task.offsetWidth;
  task.classList.add('post-animation');

  setTimeout(() => {
    task.textContent = text;
    task.classList.remove('post-animation');
    void task.offsetWidth;
    task.classList.add('pre-animation');

    if (soundEnabled && audioStarted) {
      audio.src = src;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    audio.onended = () => {
      index = (index + 1) % tasks.length;
      playTask(index);
    };
  }, 600);
}

// =====================
// INIT
// =====================
if (task) {
  task.textContent = tasks[0].text;
  task.classList.add('pre-animation');
  playTask(index);
}

// =====================
// BOUTON SON
// =====================
soundToggle.addEventListener('click', () => {
  if (!soundEnabled) {
    a1.beginElement();
    aa1.beginElement();
  } else {
    a2.beginElement();
    aa2.beginElement();
  }

  soundEnabled = !soundEnabled;

  if (!audioStarted) {
    audioStarted = true;
    playTask(index);
  }

  fadeTo(soundEnabled && isInIntro ? 1 : 0);
});

// =====================
// INTERSECTION OBSERVER
// =====================
const audioObserver = new IntersectionObserver(
  ([entry]) => {
    isInIntro = entry.isIntersecting;

    if (!soundEnabled) return;
    fadeTo(isInIntro ? 1 : 0);
  },
  { threshold: 0.2 }
);

audioObserver.observe(intro);

// =====================
// HAMBURGER / POPUP
// =====================
const burger = document.getElementById('hamburger');
const popup = document.getElementById('popup');

if (burger && popup) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('is-open');
        burger.classList.toggle('is-closed');
        popup.classList.toggle('active');
    });
}

// =====================
// SCROLL ANIMATION BACKGROUND + SUN TEXT
// =====================
const sunText = document.querySelector('.sun-text');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;

    const progress = Math.min(scrollY / maxScroll, 1);

    const r = 20 + progress * (247 - 20);
    const g = 20 + progress * (243 - 20);
    const b = 30 + progress * (235 - 30);


    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    if (sunText) {
        sunText.style.opacity = progress > 0.6 ? 1 : 0;
    }
});

// =====================
// BUS
// =====================
const busScene = document.querySelector("#bus-scene");
const bus = document.querySelector(".bus");
const rows = [...document.querySelectorAll(".row")];
const track = document.querySelector(".bus-track");

let ticking = false;

/* positions animées */
let currentX = 0;
let targetX = 0;
let currentY = 0;
let targetY = 0;

const ease = 0.02;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateBus);
    ticking = true;
  }
});

function updateBus() {
  ticking = false;

  const sceneRect = busScene.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  if (sceneRect.bottom < 0 || sceneRect.top > viewportHeight) return;

  /* === progression scroll 0 → 1 === */
const scrollFactor = 1.5;

const start = viewportHeight * scrollFactor;
const end = -sceneRect.height * scrollFactor;

const progress =
  (start - sceneRect.top) / (start - end);

const clamped = Math.min(Math.max(progress, 0), 1);


  /* === position cible horizontale === */
const startX = -bus.offsetWidth;
const endX = track.offsetWidth;

targetX = startX + clamped * (endX - startX);


  /* === ligne active === */
  const index = Math.min(
    rows.length - 1,
    Math.floor(clamped * rows.length)
  );

  const activeRow = rows[index];
  if (activeRow) {
    targetY =
      activeRow.offsetTop +
      activeRow.offsetHeight / 2 -
      bus.offsetHeight / 2;
  }

  /* === interpolation (MAGIE) === */
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  bus.style.transform = `translate(${currentX}px, ${currentY}px)`;

  /* === révélation du texte === */
  const busCenterX =
    bus.getBoundingClientRect().left +
    bus.offsetWidth / 2;

  rows.forEach(row => {
    const text = row.querySelector(".bus_text");
    const textRect = text.getBoundingClientRect();

    const passed = busCenterX > textRect.left;

    row.classList.toggle("is-visible", passed);
  });

  requestAnimationFrame(updateBus);
}


