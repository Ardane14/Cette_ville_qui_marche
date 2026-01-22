// ===== JS SPANIZE =====
document.querySelectorAll('.js-spanize').forEach(el => {
    const text = el.textContent;
    const spanned = text.split('').map((char, i) => `<span style="--i:${i}">${char}</span>`).join('');
    el.innerHTML = spanned;
});

// ===== CAROUSEL TASK =====
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
