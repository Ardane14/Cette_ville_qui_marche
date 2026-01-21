
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
  // animation sortie
  task.classList.remove('pre-animation');
  task.classList.remove('post-animation');

  // force reflow pour relancer l'animation
  void task.offsetWidth;

  task.classList.add('post-animation');

  setTimeout(() => {
    task.textContent = tasks[i];
    i = (i + 1) % tasks.length;

    task.classList.remove('post-animation');
    void task.offsetWidth;
    task.classList.add('pre-animation');
  }, 600);
}

const burger = document.getElementById('hamburger');
const popup = document.getElementById('popup');

burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    burger.classList.toggle('is-closed');
    popup.classList.toggle('active');
});


// initialisation
task.textContent = tasks[0];
task.classList.add('pre-animation');

setInterval(changeTask, 2000);
const sunText = document.querySelector('.sun-text');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;

    // Progress from 0 → 1
    const progress = Math.min(scrollY / maxScroll, 1);

    // Night → sunrise colors
    const r = 20 + progress * (230 - 20);
    const g = 20 + progress * (215 - 20);
    const b = 30 + progress * (185 - 30);

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Make text appear
    if (progress > 0.6) {
        sunText.style.opacity = 1;
    }
});
