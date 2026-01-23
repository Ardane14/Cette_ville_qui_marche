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
// CAROUSEL TASK 
// =====================
const tasks = [
  'Nabosani te',
  'I remember.',
  'Mwen sonje.',
  'Me acuerdo.',
  'Je me souviens.',
];

const task = document.getElementById('task');
let i = 0;

function changeTask() {
    if (!task) return;

    // Sortie
    task.classList.remove('pre-animation', 'post-animation');
    void task.offsetWidth; // force reflow
    task.classList.add('post-animation');

    setTimeout(() => {
        task.textContent = tasks[i];
        i = (i + 1) % tasks.length;

        task.classList.remove('post-animation');
        void task.offsetWidth;
        task.classList.add('pre-animation');
    }, 600);
}

// initialisation
if (task) {
    task.textContent = tasks[0];
    task.classList.add('pre-animation');
    setInterval(changeTask, 2000);
}

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

    const r = 20 + progress * (230 - 20);
    const g = 20 + progress * (215 - 20);
    const b = 30 + progress * (185 - 30);


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


