// VALEN DRAWS · interacciones: menú, parallax, scroll reveal, formulario
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Menú mobile ---- */
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  btn.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  nav.classList.toggle('is-open', !open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Abrir menú');
  nav.classList.remove('is-open');
}));

/* ---- Scroll reveal: cada elemento aparece subiendo al entrar en pantalla ---- */
document.querySelectorAll('.masonry .art').forEach((el, i) => {
  el.style.setProperty('--i', i);
  el.style.setProperty('--d', `${(i % 3) * 0.12}s`);
});
document.querySelectorAll('.cards .price-card, .steps__list .step').forEach((el, i) => {
  el.style.setProperty('--d', `${(i % 3) * 0.12}s`);
});
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => reduce ? el.classList.add('is-visible') : io.observe(el));

/* ---- Parallax: cada capa se mueve a su propia velocidad (data-speed) ----
   speed < 1 = más lento que el scroll (fondo) · speed > 1 = más rápido (frente) */
const layers = [...document.querySelectorAll('[data-speed]')];
const heroText = document.querySelector('[data-hero-text]');
let ticking = false;
function update() {
  const vh = window.innerHeight;
  layers.forEach(el => {
    const sec = el.closest('section') || el;
    const r = sec.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const speed = parseFloat(el.dataset.speed);
    const offset = (r.top + r.height / 2 - vh / 2) * (speed - 1) * 0.5;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
  // El texto del Hero se aleja y se desvanece un poco al bajar
  if (heroText) {
    const y = Math.min(window.scrollY, vh);
    heroText.style.transform = `translateY(${y * 0.25}px)`;
    heroText.style.opacity = String(1 - y / (vh * 1.1));
  }
  ticking = false;
}
if (!reduce) {
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---- Link activo del menú según la sección visible ---- */
const links = [...document.querySelectorAll('.nav ul a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* ---- Formulario: validación accesible ---- */
const form = document.querySelector('.form');
const msg = form.querySelector('.form__msg');
form.addEventListener('submit', ev => {
  ev.preventDefault();
  let first = null;
  form.querySelectorAll('[required]').forEach(f => {
    const ok = f.checkValidity();
    f.setAttribute('aria-invalid', String(!ok));
    if (!ok && !first) first = f;
  });
  if (first) { msg.textContent = 'Revisa los campos marcados, por favor.'; first.focus(); return; }
  msg.textContent = '¡Gracias! Recibí tu solicitud, te respondo pronto ♡';
  form.reset();
});
