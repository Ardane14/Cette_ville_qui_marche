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

const bus = document.querySelector('.bus');
const section = document.querySelector('.bus-section');
const lines = document.querySelectorAll('.line');

window.addEventListener('scroll', () => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;

    const progress =
        (scrollY - sectionTop) /
        (sectionHeight - window.innerHeight);

    if (progress < 0 || progress > 1) return;

    const startX = -300;
    const endX = window.innerWidth + 300;
    const busX = startX + progress * (endX - startX);

    bus.style.transform = `translate(${busX}px, -50%)`;

    const busRect = bus.getBoundingClientRect();

    lines.forEach(line => {
        const lineRect = line.getBoundingClientRect();

        const overlaps =
            busRect.left < lineRect.right &&
            busRect.right > lineRect.left &&
            busRect.top < lineRect.bottom &&
            busRect.bottom > lineRect.top;

        line.style.opacity = overlaps ? 1 : 0;
    });
});