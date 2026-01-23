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
// CAROUSEL TASK + AUDIO
// =====================

const tasks = [
  { text: 'Nabosani te.', audio: 'wav/Ningala_1.wav' },
  { text: 'I remember.', audio: 'wav/Raf_Anglais_1.wav' },
  { text: 'Mwen sonje.', audio: 'wav/Fec_Creole_1.wav' },
  { text: 'Yfy yé capte.', audio: 'wav/MArtial_Noushi_1.wav' },
  { text: 'Lembro-me.', audio: 'wav/Raf_Portugais_1.wav' },
  { text: 'Me kakye.', audio: 'wav/Japhet_Enzima_1.wav' },
  { text: 'Je me souviens.', audio: 'wav/Louanne_Francais_1.wav' },
];

const task = document.getElementById('task');
const intro = document.querySelector('.intro');
const soundToggle = document.getElementById('soundToggle');

// éléments SVG CodePen pour animation
const a1 = document.getElementById("a1");
const a2 = document.getElementById("a2");
const aa1 = document.getElementById("aa1");
const aa2 = document.getElementById("aa2");

let index = 0;
let audio = null;
let soundEnabled = false;   // audio désactivé par défaut
let audioStarted = false;   // audio lancé seulement après clic
let fadeInterval = null;    // interval pour fade

// =====================
// Initialisation bouton fermé
// =====================
if (soundToggle && a1 && a2 && aa1 && aa2) {
  // le SVG démarre fermé
  a2.setAttribute("d", "M 19 5 Q 24.75 12 19 19 M 15.5 8.5 Q 18.5 12 15.5 15.5");
  a1.setAttribute("d", "M 22 9 Q 19 12 16 15 M 16 9 Q 19 12 22 15");
  aa2.setAttribute("stroke", "#ffffff");
  aa1.setAttribute("stroke", "#ffffff");
}

// =====================
// Fonction pour jouer un task
// =====================
function playTask(i) {
  if (!task) return;

  const { text, audio: src } = tasks[i];

  // animation sortie texte
  task.classList.remove('pre-animation', 'post-animation');
  void task.offsetWidth; // trigger reflow
  task.classList.add('post-animation');

  setTimeout(() => {
    task.textContent = text;
    task.classList.remove('post-animation');
    void task.offsetWidth;
    task.classList.add('pre-animation');

    // audio seulement si activé
    if (audioStarted && soundEnabled) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio = new Audio(src);
      audio.volume = 1;
      audio.loop = false;
      audio.play().catch(() => console.log("Audio bloqué"));

      audio.onended = () => {
        index = (index + 1) % tasks.length;
        playTask(index);
      };
    } else {
      // avance carousel sans audio
      setTimeout(() => {
        index = (index + 1) % tasks.length;
        playTask(index);
      }, 1000);
    }
  }, 600);
}

// =====================
// Initialisation carousel
// =====================
if (task) {
  task.textContent = tasks[0].text;
  task.classList.add('pre-animation');
  playTask(index);
}

// =====================
// Bouton son simple style CodePen
// =====================
soundToggle.addEventListener('click', (event) => {
  const toggleIcon = event.currentTarget;

  if (!soundEnabled) {
    // animation pour activer le son
    toggleIcon.querySelector('#a1').beginElement();
    toggleIcon.querySelector('#aa1').beginElement();
  } else {
    // animation pour fermer le son
    toggleIcon.querySelector('#a2').beginElement();
    toggleIcon.querySelector('#aa2').beginElement();
  }

  // changer état son réel
  soundEnabled = !soundEnabled;

  // activer audio seulement après premier clic
  if (!audioStarted) {
    audioStarted = true;
    if (tasks[index]) playTask(index);
  }

  if (audio) audio.volume = soundEnabled ? 1 : 0;
});

// =====================
// Fade audio sur scroll
// =====================
function handleFade() {
  if (!audio || !soundEnabled) return;

  const rect = intro.getBoundingClientRect();
  const isInIntro = rect.bottom > 0 && rect.top < window.innerHeight;

  if (fadeInterval) clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    if (!audio) return clearInterval(fadeInterval);

    const targetVolume = isInIntro ? 1 : 0;
    const diff = targetVolume - audio.volume;

    if (Math.abs(diff) < 0.01) {
      audio.volume = targetVolume;
      clearInterval(fadeInterval);
    } else {
      audio.volume += diff * 0.1; // fade smooth
    }
  }, 50);
}

window.addEventListener("scroll", handleFade);



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

const ease = 0.08;

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
  const centerTrigger = viewportHeight / 1.5;
  const progress =
    (centerTrigger - sceneRect.top) /
    (sceneRect.height / 1.5);

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


