// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
const menuOverlay = document.getElementById('menu-overlay');

function abrirMenu() {
  mainNav.classList.add('is-active');
  menuToggle.classList.add('is-active');
  menuOverlay.classList.add('is-active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Fechar menu');
  document.body.classList.add('menu-open');
}

function fecharMenu() {
  mainNav.classList.remove('is-active');
  menuToggle.classList.remove('is-active');
  menuOverlay.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
}

if (menuToggle && mainNav && menuOverlay) {
  menuToggle.addEventListener('click', () => {
    const aberto = mainNav.classList.contains('is-active');
    aberto ? fecharMenu() : abrirMenu();
  });

  menuOverlay.addEventListener('click', fecharMenu);

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) fecharMenu();
  });
}

// Atualiza o ano do copyright automaticamente
const anoAtual = document.getElementById('ano-atual');
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}