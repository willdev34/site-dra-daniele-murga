// ==========================================================================
// Header compartilhado (partials/header.html, injetado via XHR sincrono
// em cada pagina antes deste script rodar - ver o trecho inline logo
// apos o placeholder no <body>). Toda a interatividade do header (menu
// mobile e o estado de rolagem) e inicializada aqui, uma unica vez,
// para as duas paginas do site.
// ==========================================================================

function initHeader() {
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

  // Header: sticky em todas as paginas, com blur/opacidade que
  // aumentam a partir de .is-scrolled - mesmo comportamento em
  // qualquer pagina que consuma o header compartilhado.
  const siteHeader = document.getElementById('site-header');

  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }, { passive: true });

    if (window.scrollY > 20) siteHeader.classList.add('is-scrolled');
  }
}

initHeader();

// Sobre a Clinica: bloco maior de "O espaco" preparado para receber um
// video real do Instagram. Enquanto "video" nao existir, o botao de
// play fica apenas visual (sem URL inventada); quando o arquivo for
// definido, basta trocar a <img> por um elemento <video> com esse src
// que a mesma logica de play/pause/overlay passa a funcionar.
const spaceVideo = document.getElementById('space-video');

if (spaceVideo) {
  const spaceVideoTrigger = document.getElementById('space-video-trigger');
  const spaceVideoEl = spaceVideo.querySelector('video');

  if (spaceVideoTrigger && spaceVideoEl) {
    spaceVideoTrigger.addEventListener('click', () => {
      spaceVideoEl.play();
    });
    spaceVideoEl.addEventListener('play', () => spaceVideo.classList.add('is-playing'));
    spaceVideoEl.addEventListener('pause', () => spaceVideo.classList.remove('is-playing'));
    spaceVideoEl.addEventListener('ended', () => spaceVideo.classList.remove('is-playing'));
    spaceVideoEl.addEventListener('click', () => {
      if (spaceVideoEl.paused) spaceVideoEl.play(); else spaceVideoEl.pause();
    });
  }
}

// Atualiza o ano do copyright automaticamente
const anoAtual = document.getElementById('ano-atual');
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}

// ==========================================================================
// Galeria de Resultados (dados, filtros e lightbox)
// ==========================================================================
//
// Para adicionar um novo resultado, basta incluir um novo objeto no array
// RESULTADOS_CASOS abaixo. Nenhuma outra parte do HTML precisa ser alterada.
//
// Campos:
//   category    - categoria usada nos filtros (ex.: "Laser")
//   procedure   - nome tecnico do procedimento
//   title       - titulo exibido no card e no lightbox
//   description - opcional. Se nao houver informacao disponivel, omitir.
//   disclaimer  - opcional. Texto curto de ressalva (ex.: variacao individual)
//   type        - "combined" (uma unica imagem com antes/depois),
//                 "pair" (duas imagens separadas, antes e depois) ou
//                 "placeholder" (ainda sem fotografia real)
//   image       - usado quando type e "combined" ou "placeholder"
//   imageBefore / imageAfter - usados quando type e "pair"

const RESULTADOS_CASOS = [
  {
    id: 'melasma',
    category: 'Manchas',
    procedure: 'Tratamento de Melasma',
    title: 'Tratamento de melasma',
    description: 'Protocolo que combinou laser para melasma, peeling químico, antioxidação e skincare personalizado.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/v1788405817/antes-depois-melasma_h8nguf.jpg'
  },
  {
    id: 'botox-masculino',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox masculino: naturalidade, expressão e rejuvenescimento',
    description: 'Rugas profundas na testa e ao redor dos olhos podem deixar o rosto com um aspecto mais cansado e envelhecido. O tratamento com toxina botulínica suavizou significativamente as linhas de expressão, mantendo a naturalidade dos movimentos e a identidade do paciente.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'pair',
    imageBefore: 'https://res.cloudinary.com/do0uq7w4n/image/upload/v1788405549/antes-botox_h2y8q7.jpg',
    imageAfter: 'https://res.cloudinary.com/do0uq7w4n/image/upload/v1788405549/depois-botox_mdqsyp.jpg'
  },
  {
    id: 'bigode-chines',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Bigode Chinês',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'estrias',
    category: 'Laser',
    procedure: 'Laser',
    title: 'Estrias',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'laser-erbium',
    category: 'Laser',
    procedure: 'Laser Erbium',
    title: 'Laser Erbium',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'hiperidrose',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Hiperidrose',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'botox-manchas',
    category: 'Manchas',
    procedure: 'Toxina Botulínica associada a protocolo para manchas',
    title: 'Protocolo para Manchas',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'ultrassom-microfocado',
    category: 'Flacidez',
    procedure: 'Ultrassom Microfocado',
    title: 'Ultrassom Microfocado',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'rejuvenescimento-facial',
    category: 'Rejuvenescimento',
    procedure: 'Associação de tratamentos',
    title: 'Rejuvenescimento Facial',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'projecao-mento',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Projeção de Mento e Definição de Mandíbula',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'dermatocalaze-olhos',
    category: 'Flacidez',
    procedure: 'Ultrassom Microfocado e Toxina Botulínica',
    title: 'Dermatocalaze (Região dos Olhos)',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'rugas-marionete',
    category: 'Preenchimento',
    procedure: 'Preenchimento, Toxina Botulínica e Ultrassom Microfocado',
    title: 'Rugas de Marionete',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'preenchimento-labial',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Preenchimento Labial',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'botox-masculino-2',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox Masculino (Caso 2)',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'papada',
    category: 'Flacidez',
    procedure: 'Flacidez',
    title: 'Papada',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  },
  {
    id: 'protocolo-combinado-rejuvenescimento',
    category: 'Rejuvenescimento',
    procedure: 'Toxina Botulínica, Ultrassom Microfocado com Radiofrequência e Preenchimento com Ácido Hialurônico',
    title: 'Protocolo Combinado de Rejuvenescimento',
    type: 'placeholder',
    image: 'assets/placeholders/resultado-placeholder.svg'
  }
];

// Utilitario compartilhado (usado pela galeria de resultados e pelos depoimentos)
function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

const resultsGrid = document.getElementById('results-grid');

if (resultsGrid) {
  const filtersContainer = document.getElementById('results-filters');
  const lightbox = document.getElementById('results-lightbox');
  const lightboxImages = document.getElementById('lightbox-images');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let casosVisiveis = RESULTADOS_CASOS.slice();
  let indiceAtual = 0;

  function badgesAntesDepois(caso) {
    if (caso.type === 'combined' || caso.type === 'pair') {
      return '<span class="result-badge result-badge-left">Antes</span><span class="result-badge result-badge-right">Depois</span>';
    }
    return '';
  }

  function imagensHtml(caso) {
    if (caso.type === 'pair') {
      return `<img src="${caso.imageBefore}" alt="Antes - ${escapeHtml(caso.title)}" loading="lazy">` +
             `<img src="${caso.imageAfter}" alt="Depois - ${escapeHtml(caso.title)}" loading="lazy">`;
    }
    if (caso.type === 'combined') {
      return `<img src="${caso.image}" alt="Antes e depois - ${escapeHtml(caso.title)}" loading="lazy">`;
    }
    return `<img src="${caso.image}" alt="Ilustração provisória - ${escapeHtml(caso.title)}" loading="lazy">`;
  }

  function tipoClasse(caso) {
    if (caso.type === 'pair') return ' result-card--pair';
    if (caso.type === 'combined') return ' result-card--combined';
    return '';
  }

  function renderizarGaleria(casos) {
    if (!casos.length) {
      resultsGrid.innerHTML = '<p class="results-empty">Nenhum resultado encontrado para este filtro.</p>';
      return;
    }

    resultsGrid.innerHTML = casos.map((caso, indice) => {
      const pairClasse = caso.type === 'pair' ? ' result-photo-pair' : '';
      const descricao = caso.description ? `<p>${escapeHtml(caso.description)}</p>` : '';
      const disclaimer = caso.disclaimer ? `<span class="result-disclaimer">${escapeHtml(caso.disclaimer)}</span>` : '';
      const chipPendente = caso.type === 'placeholder' ? '<span class="chip">Em breve</span>' : '';

      return `
        <article class="result-card${tipoClasse(caso)}">
          <button class="result-card-trigger" type="button" data-index="${indice}" aria-label="Ampliar resultado: ${escapeHtml(caso.title)}">
            <div class="result-photo${pairClasse}">
              ${imagensHtml(caso)}
              ${badgesAntesDepois(caso)}
            </div>
          </button>
          <div class="result-card-body">
            <h3>${escapeHtml(caso.title)}</h3>
            ${descricao}
            ${disclaimer}
            <div class="result-card-meta">
              <span class="chip">${escapeHtml(caso.category)}</span>
              ${chipPendente}
            </div>
          </div>
        </article>
      `;
    }).join('');

    resultsGrid.querySelectorAll('.result-card-trigger').forEach((botao) => {
      botao.addEventListener('click', () => abrirLightbox(Number(botao.dataset.index)));
    });
  }

  function renderizarFiltros() {
    const categorias = ['Todos', ...new Set(RESULTADOS_CASOS.map((caso) => caso.category))];

    filtersContainer.innerHTML = categorias.map((categoria, indice) =>
      `<button type="button" class="filter-btn${indice === 0 ? ' is-active' : ''}" data-filter="${escapeHtml(categoria)}">${escapeHtml(categoria)}</button>`
    ).join('');

    filtersContainer.querySelectorAll('.filter-btn').forEach((botao) => {
      botao.addEventListener('click', () => {
        filtersContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
        botao.classList.add('is-active');

        const filtro = botao.dataset.filter;
        casosVisiveis = filtro === 'Todos'
          ? RESULTADOS_CASOS.slice()
          : RESULTADOS_CASOS.filter((caso) => caso.category === filtro);

        renderizarGaleria(casosVisiveis);
      });
    });
  }

  function atualizarLightbox() {
    const caso = casosVisiveis[indiceAtual];
    if (!caso) return;

    lightboxImages.className = 'lightbox-images' + (caso.type === 'pair' ? ' result-photo-pair' : '');
    lightboxImages.innerHTML = imagensHtml(caso) + badgesAntesDepois(caso);
    lightboxTitle.textContent = caso.title;
    lightboxMeta.textContent = caso.type === 'placeholder' ? `${caso.category} · Em breve` : caso.category;
    lightboxDescription.textContent = caso.description || '';

    const apenasUm = casosVisiveis.length <= 1;
    lightboxPrev.disabled = apenasUm;
    lightboxNext.disabled = apenasUm;
  }

  function abrirLightbox(indice) {
    indiceAtual = indice;
    atualizarLightbox();
    lightbox.classList.add('is-active');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function fecharLightbox() {
    lightbox.classList.remove('is-active');
    document.body.classList.remove('lightbox-open');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', fecharLightbox);
  }

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener('click', () => {
      if (!casosVisiveis.length) return;
      indiceAtual = (indiceAtual - 1 + casosVisiveis.length) % casosVisiveis.length;
      atualizarLightbox();
    });

    lightboxNext.addEventListener('click', () => {
      if (!casosVisiveis.length) return;
      indiceAtual = (indiceAtual + 1) % casosVisiveis.length;
      atualizarLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (evento) => {
      if (evento.target === lightbox) fecharLightbox();
    });
  }

  document.addEventListener('keydown', (evento) => {
    if (!lightbox || !lightbox.classList.contains('is-active')) return;
    if (evento.key === 'Escape') fecharLightbox();
    if (evento.key === 'ArrowLeft') lightboxPrev.click();
    if (evento.key === 'ArrowRight') lightboxNext.click();
  });

  renderizarFiltros();
  renderizarGaleria(casosVisiveis);
}

// Gera a URL de um frame real do video, hospedado no proprio Cloudinary,
// para usar como poster/capa do card antes do play - troca a extensao
// .mp4 por .jpg e insere "so_auto" (o Cloudinary escolhe automaticamente
// o frame mais representativo, por distribuicao de cor, evitando pegar
// uma tela preta ou transicao logo no comeco do video) na URL. Assim,
// cada video tem sua propria capa real (nao mais um placeholder generico
// igual para todos), sem precisar subir uma imagem extra para cada um.
function posterDoVideoCloudinary(videoUrl) {
  if (!videoUrl) return null;
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_auto/')
    .replace(/\.mp4$/i, '.jpg');
}

const DIARY_POSTS = [
  {
    id: 'rosacea',
    title: 'Rosácea',
    description: 'A escolha do protetor solar certo faz toda a diferença no tratamento da rosácea.',
    instagramUrl: 'https://www.instagram.com/reel/DT3hQrFjnVF/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789183539/rosacea_home_pndxz0.mp4'
  },
  {
    id: 'mounjaro',
    title: 'Mounjaro',
    description: 'Como funciona, quando é indicado e por que o acompanhamento médico é essencial durante o uso.',
    instagramUrl: 'https://www.instagram.com/reel/DQmk45TjuC1/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789183690/mounjaro_home_gyctrn.mp4'
  },
  {
    id: 'melasma',
    title: 'Melasma',
    description: 'Manchas que exigem tratamento contínuo e proteção diária para não retornar.',
    instagramUrl: 'https://www.instagram.com/reel/DOhOQ7SDh-3/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789183880/melasma_home_kxcbi5.mp4'
  },
  {
    id: 'protetor-solar',
    title: 'Protetor solar',
    description: 'Como escolher a proteção ideal para cada tipo de pele.',
    instagramUrl: 'https://www.instagram.com/reel/DMusWB7xsGt/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789183971/protetor_solar_home_bsahow.mp4'
  },
  {
    id: 'queda-capilar',
    title: 'Queda Capilar',
    description: 'Entenda as causas mais comuns e quando buscar avaliação médica.',
    instagramUrl: 'https://www.instagram.com/p/DOWRq6gDpWi/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789184117/queda_capilar_home_ps8tjj.mp4'
  },
  {
    id: 'preenchimento-facial',
    title: 'Preenchimento facial',
    description: 'Naturalidade e equilíbrio para valorizar seus traços.',
    instagramUrl: 'https://www.instagram.com/p/DOJwTjoEmGB/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/v1789184185/preenchimento_facial_home_kd7pue.mp4'
  }
];

const DIARY_PLAY_ICON_SVG = '<svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor"><path d="M0 0 L20 11 L0 22 Z"/></svg>';

const diaryTrack = document.getElementById('diary-track');

if (diaryTrack) {
  const diaryPrevBtn = document.getElementById('diary-prev');
  const diaryNextBtn = document.getElementById('diary-next');
  const carouselWrap = document.querySelector('.diary-carousel');

  const VELOCIDADE_PX_POR_SEGUNDO = 40;
  const AVANCO_MANUAL_PX = 340;

  function midiaDiario(post) {
    if (post.video) {
      const poster = posterDoVideoCloudinary(post.video);
      // Sem "muted" fixo aqui: o video comeca mudo via JS (abaixo, no
      // momento em que os cards sao montados), para nunca tocar som
      // sozinho na esteira automatica - e e desmutado so quando o
      // usuario clica propositalmente no botao de play.
      return `<video class="diary-video" src="${post.video}" poster="${poster}" playsinline loop preload="none"></video>`;
    }
    return `<img src="assets/placeholders/video-poster-placeholder.svg" alt="${escapeHtml(post.title)}" loading="lazy">`;
  }

  function cartaoDiario(post) {
    const descricao = post.description ? `<p>${escapeHtml(post.description)}</p>` : '';
    const pendente = post.video ? '' : '<span class="diary-video-pending">Vídeo em breve</span>';

    return `
      <div class="diary-video-card" data-id="${post.id}">
        <div class="diary-video-media">${midiaDiario(post)}</div>
        <button type="button" class="diary-play-btn" aria-label="Reproduzir vídeo: ${escapeHtml(post.title)}">${DIARY_PLAY_ICON_SVG}</button>
        <div class="diary-video-overlay">
          <h3>${escapeHtml(post.title)}</h3>
          ${descricao}
          ${pendente}
        </div>
      </div>
    `;
  }

  function pausarCardsDiario() {
    diaryTrack.querySelectorAll('.diary-video-card').forEach((card) => {
      card.classList.remove('is-playing');
      const video = card.querySelector('video');
      if (video) video.pause();
    });
  }

  // O conjunto e duplicado (igual ao carrossel de avaliacoes do Google)
  // para permitir um loop visualmente continuo: ao rolar exatamente a
  // largura de um conjunto, reseta a posicao sem salto perceptivel.
  const conjuntoDuplicado = [...DIARY_POSTS, ...DIARY_POSTS];
  diaryTrack.innerHTML = conjuntoDuplicado.map(cartaoDiario).join('');

  let larguraConjunto = 0;
  let offsetAtual = 0;
  let rolando = true;
  let ultimoTimestamp = null;

  function medirLarguraConjunto() {
    const cards = diaryTrack.querySelectorAll('.diary-video-card');
    if (cards.length < DIARY_POSTS.length) return 0;
    const primeiro = cards[0];
    const primeiroDoClone = cards[DIARY_POSTS.length];
    return primeiroDoClone.offsetLeft - primeiro.offsetLeft;
  }

  function aplicarOffset() {
    diaryTrack.style.setProperty('--diary-offset', `${-offsetAtual}px`);
  }

  function passoAnimacao(timestamp) {
    if (ultimoTimestamp === null) ultimoTimestamp = timestamp;
    const deltaSegundos = (timestamp - ultimoTimestamp) / 1000;
    ultimoTimestamp = timestamp;

    if (rolando && larguraConjunto > 0) {
      offsetAtual += VELOCIDADE_PX_POR_SEGUNDO * deltaSegundos;
      if (offsetAtual >= larguraConjunto) offsetAtual -= larguraConjunto;
      aplicarOffset();
    }

    requestAnimationFrame(passoAnimacao);
  }

  function pausarEsteira() {
    rolando = false;
  }

  function retomarEsteira() {
    rolando = true;
  }

  function avancarManual(direcao) {
    if (larguraConjunto <= 0) return;
    offsetAtual += direcao * AVANCO_MANUAL_PX;
    if (offsetAtual >= larguraConjunto) offsetAtual -= larguraConjunto;
    if (offsetAtual < 0) offsetAtual += larguraConjunto;
    aplicarOffset();
  }

  diaryTrack.querySelectorAll('.diary-video-card').forEach((card) => {
    const video = card.querySelector('video');
    const botaoPlay = card.querySelector('.diary-play-btn');

    botaoPlay.addEventListener('click', () => {
      if (!video) return;
      pausarCardsDiario();
      card.classList.add('is-playing');
      pausarEsteira();
      video.play();
    });

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          pausarEsteira();
          video.play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', () => card.classList.add('is-playing'));
      video.addEventListener('pause', () => {
        card.classList.remove('is-playing');
        retomarEsteira();
      });
      video.addEventListener('ended', () => {
        card.classList.remove('is-playing');
        retomarEsteira();
      });
    }
  });

  if (diaryPrevBtn) diaryPrevBtn.addEventListener('click', () => avancarManual(-1));
  if (diaryNextBtn) diaryNextBtn.addEventListener('click', () => avancarManual(1));

  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', pausarEsteira);
    carouselWrap.addEventListener('mouseleave', () => {
      if (!diaryTrack.querySelector('.diary-video-card.is-playing')) retomarEsteira();
    });
  }

  // Arrastar para o lado (mouse ou touch) pausa a esteira durante o
  // gesto e desloca a faixa junto com o dedo/mouse.
  let arrastoInicioX = null;
  let offsetNoInicioArrasto = 0;

  diaryTrack.addEventListener('pointerdown', (evento) => {
    // Se o pointerdown comecou em cima do botao de play (ou de um
    // video ja tocando), nao inicia o arraste do carrossel - assim o
    // clique/toque chega normalmente ao botao/video, sem ser
    // "sequestrado" pela captura de ponteiro usada para arrastar.
    if (evento.target.closest('.diary-play-btn, video')) return;

    arrastoInicioX = evento.clientX;
    offsetNoInicioArrasto = offsetAtual;
    pausarEsteira();
    diaryTrack.setPointerCapture(evento.pointerId);
  });

  diaryTrack.addEventListener('pointermove', (evento) => {
    if (arrastoInicioX === null || larguraConjunto <= 0) return;
    const delta = evento.clientX - arrastoInicioX;
    let novoOffset = offsetNoInicioArrasto - delta;
    novoOffset = ((novoOffset % larguraConjunto) + larguraConjunto) % larguraConjunto;
    offsetAtual = novoOffset;
    aplicarOffset();
  });

  function finalizarArrastoDiario() {
    if (arrastoInicioX === null) return;
    arrastoInicioX = null;
    if (!diaryTrack.querySelector('.diary-video-card.is-playing')) retomarEsteira();
  }

  diaryTrack.addEventListener('pointerup', finalizarArrastoDiario);
  diaryTrack.addEventListener('pointercancel', finalizarArrastoDiario);

  window.addEventListener('resize', () => {
    larguraConjunto = medirLarguraConjunto();
  });

  requestAnimationFrame(() => {
    larguraConjunto = medirLarguraConjunto();
    requestAnimationFrame(passoAnimacao);
  });
}

// ==========================================================================
// Depoimentos (avaliações do Google + depoimentos em vídeo do Instagram)
// ==========================================================================
//
// GOOGLE_REVIEWS: nenhuma avaliação individual real foi fornecida ainda.
// Substitua os itens abaixo por avaliações reais assim que estiverem
// disponíveis, no formato: { text: 'Texto da avaliação' }.
//
// INSTAGRAM_TESTEMUNHOS: cada objeto representa um depoimento em vídeo.
// Para adicionar um novo depoimento, inclua um objeto neste array. Para
// inserir o arquivo de vídeo real quando disponível, preencha o campo
// "video" (o poster pode continuar sendo o mesmo enquanto não houver uma
// capa real). Campos:
//   name      - nome do paciente (deixe '' quando não for conhecido)
//   category  - uma de: 'Dermatologia', 'Estética', 'Laser', 'Medicina Integrativa'
//   treatment - identificação curta do tratamento (deixe '' se não for claro)
//   video     - caminho do arquivo de vídeo, ou null se ainda não disponível
//   poster    - imagem de capa (thumbnail) exibida no card

const GOOGLE_REVIEWS = [
  { text: 'Este espaço será atualizado com uma avaliação real do Google.' },
  { text: 'Novas avaliações verificadas serão adicionadas em breve.' },
  { text: 'Em breve, relatos reais de pacientes estarão disponíveis aqui.' },
  { text: 'As avaliações completas do Google serão exibidas nesta área.' }
];

const INSTAGRAM_TESTEMUNHOS = [
  {
    id: 'atendimento-escuta',
    name: '',
    category: 'Dermatologia',
    treatment: 'Escuta e Investigação Diagnóstica',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'renata-emagrecimento',
    name: 'Renata',
    category: 'Medicina Integrativa',
    treatment: 'Emagrecimento',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'laser-fracionado-acne',
    name: '',
    category: 'Laser',
    treatment: 'Cicatrizes de Acne',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'luciana-majo-emagrecimento',
    name: 'Luciana Majo',
    category: 'Medicina Integrativa',
    treatment: 'Emagrecimento',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'amanda-melasma',
    name: 'Amanda',
    category: 'Estética',
    treatment: 'Melasma',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'protocolo-laser-manchas',
    name: '',
    category: 'Laser',
    treatment: 'Manchas',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'marcela-laser-manchas',
    name: 'Marcela',
    category: 'Laser',
    treatment: 'Manchas',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'emagrecimento-acompanhamento',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Emagrecimento',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'rosacea',
    name: '',
    category: 'Dermatologia',
    treatment: 'Rosácea',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'protocolo-melasma-1',
    name: '',
    category: 'Estética',
    treatment: 'Melasma',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'transformacao-pessoal',
    name: '',
    category: 'Estética',
    treatment: '',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'valter-laser-solon-acne',
    name: 'Valter',
    category: 'Laser',
    treatment: 'Cicatrizes de Acne',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'queda-capilar',
    name: '',
    category: 'Dermatologia',
    treatment: 'Queda Capilar',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'medicina-integrativa-eczema',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Eczema Atópico',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'manchas-cicatrizes-acne',
    name: '',
    category: 'Estética',
    treatment: 'Manchas e Cicatrizes de Acne',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'pdrn-peeling',
    name: '',
    category: 'Estética',
    treatment: 'PDRN e Peeling',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'laser-resultados',
    name: '',
    category: 'Laser',
    treatment: 'Laser',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  },
  {
    id: 'protocolo-melasma-2',
    name: '',
    category: 'Estética',
    treatment: 'Melasma',
    video: null,
    poster: 'assets/placeholders/video-poster-placeholder.svg'
  }
];

const PLAY_ICON_SVG = '<svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor"><path d="M0 0 L20 11 L0 22 Z"/></svg>';

// ---- Avaliações do Google (carrossel automático em loop) ----

const googleTrack = document.getElementById('google-marquee-track');

if (googleTrack) {
  function cartaoGoogle(avaliacao) {
    return `
      <article class="google-review-card">
        <p class="testimonial-quote">${escapeHtml(avaliacao.text)}</p>
        <div class="result-card-meta">
          <span class="google-review-source">Google</span>
          <span class="chip">Em breve</span>
        </div>
      </article>
    `;
  }

  // O conjunto é duplicado para permitir um loop visualmente contínuo:
  // ao deslocar exatamente 50% da largura da faixa, a segunda cópia
  // ocupa a posição inicial da primeira, sem "fim" perceptível.
  const conjuntoDuplicado = [...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS];
  googleTrack.innerHTML = conjuntoDuplicado.map(cartaoGoogle).join('');
}

// ---- Depoimentos em vídeo (filtros + carrossel + lightbox) ----

const videoTrack = document.getElementById('video-track');

if (videoTrack) {
  const filtersContainer = document.getElementById('video-filters');
  const videoPrevBtn = document.getElementById('video-prev');
  const videoNextBtn = document.getElementById('video-next');
  const carouselWrap = document.querySelector('.video-carousel-wrap');

  const lightbox = document.getElementById('video-lightbox');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('video-lightbox-title');
  const lightboxMeta = document.getElementById('video-lightbox-meta');
  const lightboxClose = document.getElementById('video-lightbox-close');
  const lightboxPrev = document.getElementById('video-lightbox-prev');
  const lightboxNext = document.getElementById('video-lightbox-next');

  const ORDEM_CATEGORIAS = ['Dermatologia', 'Estética', 'Laser', 'Medicina Integrativa'];
  const prefereReducaoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let testemunhosVisiveis = INSTAGRAM_TESTEMUNHOS.slice();
  let indiceAtual = 0;
  let autoplayId = null;

  function cartaoVideo(testemunho, indice) {
    const nomeHtml = testemunho.name ? `<h3>${escapeHtml(testemunho.name)}</h3>` : '';
    const tagHtml = testemunho.treatment ? `<span class="chip">${escapeHtml(testemunho.treatment)}</span>` : '';
    const labelAria = testemunho.name
      ? `Assistir depoimento de ${escapeHtml(testemunho.name)}`
      : 'Assistir depoimento em vídeo';
    const altImg = testemunho.name
      ? `Depoimento em vídeo de ${escapeHtml(testemunho.name)}`
      : 'Depoimento em vídeo de paciente';

    return `
      <article class="video-card">
        <button class="video-card-trigger" type="button" data-index="${indice}" aria-label="${labelAria}">
          <div class="video-card-poster">
            <img src="${testemunho.poster}" alt="${altImg}" loading="lazy">
            <span class="video-play-btn" aria-hidden="true">${PLAY_ICON_SVG}</span>
          </div>
        </button>
        <div class="video-card-body">
          ${nomeHtml}
          ${tagHtml}
        </div>
      </article>
    `;
  }

  function renderizarVideos(lista) {
    videoTrack.innerHTML = lista.length
      ? lista.map(cartaoVideo).join('')
      : '<p class="results-empty">Nenhum depoimento encontrado para este filtro.</p>';

    videoTrack.scrollTo({ left: 0 });

    videoTrack.querySelectorAll('.video-card-trigger').forEach((botao) => {
      botao.addEventListener('click', () => abrirLightbox(Number(botao.dataset.index)));
    });
  }

  function renderizarFiltrosVideo() {
    const categoriasPresentes = ORDEM_CATEGORIAS.filter((categoria) =>
      INSTAGRAM_TESTEMUNHOS.some((t) => t.category === categoria)
    );
    const categorias = ['Todos', ...categoriasPresentes];

    filtersContainer.innerHTML = categorias.map((categoria, indice) =>
      `<button type="button" class="filter-btn${indice === 0 ? ' is-active' : ''}" data-filter="${escapeHtml(categoria)}">${escapeHtml(categoria)}</button>`
    ).join('');

    filtersContainer.querySelectorAll('.filter-btn').forEach((botao) => {
      botao.addEventListener('click', () => {
        filtersContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
        botao.classList.add('is-active');

        const filtro = botao.dataset.filter;
        testemunhosVisiveis = filtro === 'Todos'
          ? INSTAGRAM_TESTEMUNHOS.slice()
          : INSTAGRAM_TESTEMUNHOS.filter((t) => t.category === filtro);

        renderizarVideos(testemunhosVisiveis);
      });
    });
  }

  function avancarCarrossel(direcao) {
    const cartao = videoTrack.querySelector('.video-card');
    if (!cartao) return;

    const gap = 24;
    const distancia = cartao.getBoundingClientRect().width + gap;
    const noFinal = videoTrack.scrollLeft + videoTrack.clientWidth >= videoTrack.scrollWidth - 5;
    const noInicio = videoTrack.scrollLeft <= 5;

    if (direcao > 0 && noFinal) {
      videoTrack.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (direcao < 0 && noInicio) {
      videoTrack.scrollTo({ left: videoTrack.scrollWidth, behavior: 'smooth' });
      return;
    }

    videoTrack.scrollBy({ left: distancia * direcao, behavior: 'smooth' });
  }

  function pararAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function iniciarAutoplay() {
    if (prefereReducaoMovimento) return;
    pararAutoplay();
    autoplayId = setInterval(() => avancarCarrossel(1), 4500);
  }

  if (videoPrevBtn && videoNextBtn) {
    videoPrevBtn.addEventListener('click', () => avancarCarrossel(-1));
    videoNextBtn.addEventListener('click', () => avancarCarrossel(1));
  }

  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', pararAutoplay);
    carouselWrap.addEventListener('mouseleave', iniciarAutoplay);
    carouselWrap.addEventListener('focusin', pararAutoplay);
    carouselWrap.addEventListener('focusout', iniciarAutoplay);
    carouselWrap.addEventListener('touchstart', pararAutoplay, { passive: true });
  }

  function conteudoLightboxVideo(testemunho) {
    if (testemunho.video) {
      return `<video src="${testemunho.video}" poster="${testemunho.poster}" controls playsinline></video>`;
    }
    return `<img src="${testemunho.poster}" alt="">` +
           '<span class="lightbox-video-pending">Vídeo em breve</span>';
  }

  function atualizarLightbox() {
    const testemunho = testemunhosVisiveis[indiceAtual];
    if (!testemunho) return;

    lightboxVideo.innerHTML = conteudoLightboxVideo(testemunho);
    lightboxTitle.textContent = testemunho.name || 'Depoimento de paciente';

    const partesMeta = [testemunho.category];
    if (testemunho.treatment) partesMeta.push(testemunho.treatment);
    lightboxMeta.textContent = partesMeta.join(' · ');

    const apenasUm = testemunhosVisiveis.length <= 1;
    lightboxPrev.disabled = apenasUm;
    lightboxNext.disabled = apenasUm;
  }

  function abrirLightbox(indice) {
    indiceAtual = indice;
    pararAutoplay();
    atualizarLightbox();
    lightbox.classList.add('is-active');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function fecharLightbox() {
    lightbox.classList.remove('is-active');
    document.body.classList.remove('lightbox-open');
    lightboxVideo.innerHTML = '';
    iniciarAutoplay();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', fecharLightbox);
  }

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener('click', () => {
      if (!testemunhosVisiveis.length) return;
      indiceAtual = (indiceAtual - 1 + testemunhosVisiveis.length) % testemunhosVisiveis.length;
      atualizarLightbox();
    });

    lightboxNext.addEventListener('click', () => {
      if (!testemunhosVisiveis.length) return;
      indiceAtual = (indiceAtual + 1) % testemunhosVisiveis.length;
      atualizarLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (evento) => {
      if (evento.target === lightbox) fecharLightbox();
    });
  }

  document.addEventListener('keydown', (evento) => {
    if (!lightbox || !lightbox.classList.contains('is-active')) return;
    if (evento.key === 'Escape') fecharLightbox();
    if (evento.key === 'ArrowLeft') lightboxPrev.click();
    if (evento.key === 'ArrowRight') lightboxNext.click();
  });

  // Depoimento em destaque (composição editorial)
  const featureTrigger = document.getElementById('feature-video-trigger');
  if (featureTrigger) {
    featureTrigger.addEventListener('click', () => {
      const indiceDestaque = INSTAGRAM_TESTEMUNHOS.findIndex((t) => t.id === 'atendimento-escuta');
      testemunhosVisiveis = INSTAGRAM_TESTEMUNHOS.slice();
      abrirLightbox(indiceDestaque >= 0 ? indiceDestaque : 0);
    });
  }

  renderizarFiltrosVideo();
  renderizarVideos(testemunhosVisiveis);
  iniciarAutoplay();
}