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