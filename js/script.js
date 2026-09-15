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
const spaceVideoTrigger = document.getElementById('space-video-trigger');
const recepcaoLightbox = document.getElementById('recepcao-lightbox');

if (spaceVideoTrigger && recepcaoLightbox) {
  const recepcaoLightboxVideo = document.getElementById('recepcao-lightbox-video');
  const recepcaoLightboxClose = document.getElementById('recepcao-lightbox-close');
  const videoSrc = 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco/v1789358219/clinica_cxhnaw.mp4';
  const posterSrc = 'https://res.cloudinary.com/do0uq7w4n/video/upload/so_auto,f_auto,q_auto,w_800/v1789358219/clinica_cxhnaw.jpg';

  function abrirRecepcaoLightbox() {
    recepcaoLightboxVideo.innerHTML = `<video src="${videoSrc}" poster="${posterSrc}" controls autoplay playsinline></video>`;
    recepcaoLightbox.classList.add('is-active');
    document.body.classList.add('lightbox-open');
    recepcaoLightboxClose.focus();
  }

  function fecharRecepcaoLightbox() {
    recepcaoLightbox.classList.remove('is-active');
    document.body.classList.remove('lightbox-open');
    recepcaoLightboxVideo.innerHTML = '';
  }

  spaceVideoTrigger.addEventListener('click', abrirRecepcaoLightbox);
  recepcaoLightboxClose.addEventListener('click', fecharRecepcaoLightbox);
  recepcaoLightbox.addEventListener('click', (evento) => {
    if (evento.target === recepcaoLightbox) fecharRecepcaoLightbox();
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && recepcaoLightbox.classList.contains('is-active')) fecharRecepcaoLightbox();
  });
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
//   whatsappMessage - opcional. Quando presente, exibe no lightbox o botao
//                      "Agendar avaliacao" apontando para o WhatsApp com essa
//                      mensagem pre-preenchida (especifica do tratamento).

const RESULTADOS_CASOS = [
  {
    id: 'melasma',
    category: 'Manchas',
    procedure: 'Tratamento de Melasma',
    title: 'Tratamento de melasma',
    description: 'Protocolo que combinou laser para melasma, peeling químico, antioxidação e skincare personalizado.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1788405817/antes-depois-melasma_h8nguf.jpg'
  },
  {
    id: 'melasma-2',
    category: 'Manchas',
    procedure: 'Toxina Botulínica associada a protocolo para melasma',
    title: 'Correção de Assimetria Facial e Melasma',
    description: 'A toxina botulínica é uma aliada quando o objetivo é harmonizar e equilibrar a expressão facial, suavizando pequenas diferenças entre os lados do rosto, associada aqui a um protocolo para tratamento do melasma. O procedimento é rápido, seguro e com resultados naturais, sempre realizado após uma avaliação individual.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789403399/botox_melasma_gc9oan.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para tratamento de melasma.'
  },
  {
    id: 'melasma-3',
    category: 'Manchas',
    procedure: 'Tratamento de Melasma',
    title: 'Tratamento de Melasma (Caso 2)',
    description: 'O melasma não tem cura, mas sem tratamento o quadro tende a se agravar. Com um protocolo que combina suplementação oral, tópicos e tecnologias, é possível manter as manchas amenizadas e sob controle.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789404217/melasma02_tdckaj.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para tratamento de melasma.'
  },
  {
    id: 'botox-masculino',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox masculino: naturalidade, expressão e rejuvenescimento',
    description: 'Rugas profundas na testa e ao redor dos olhos podem deixar o rosto com um aspecto mais cansado e envelhecido. O tratamento com toxina botulínica suavizou significativamente as linhas de expressão, mantendo a naturalidade dos movimentos e a identidade do paciente.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'pair',
    imageBefore: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1788405549/antes-botox_h2y8q7.jpg',
    imageAfter: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1788405549/depois-botox_mdqsyp.jpg'
  },
  {
    id: 'botox-masculino-2',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox Masculino (Caso 2)',
    description: 'Mesmo paciente, com suavização das linhas de expressão mantendo a naturalidade dos movimentos e a identidade do rosto.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789401603/botox_masculino_hh0vq4.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Toxina Botulínica.'
  },
  {
    id: 'bigode-chines',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Bigode Chinês',
    description: 'Com um protocolo personalizado de preenchimento com ácido hialurônico e ultrassom microfocado, foi possível suavizar o bigode chinês, devolvendo leveza à expressão e mais harmonia ao sorriso. O objetivo não é mudar traços, mas amenizar marcas de expressão e trazer um aspecto mais descansado e natural.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789351332/bigode_chines_zsvqah.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Bigode Chinês.'
  },
  {
    id: 'estrias',
    category: 'Laser',
    procedure: 'Laser',
    title: 'Estrias',
    description: 'O laser fracionado cria microcanais controlados na pele, ativando o processo natural de cicatrização e estimulando a produção de novas fibras de colágeno e elastina. O resultado é uma pele mais uniforme, com textura renovada e estrias visivelmente mais finas, já a partir de uma única sessão.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789351233/estria_zbxurc.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para tratamento de Estrias.'
  },
  {
    id: 'endolaser-pescoco',
    category: 'Laser',
    procedure: 'Endolaser',
    title: 'Endolaser para Flacidez de Pescoço',
    description: 'O endolaser é uma excelente opção para o tratamento da flacidez de pescoço, estimulando a produção de colágeno e trazendo mais firmeza à pele de forma progressiva.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789404599/Endolaser_inbs5h.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Endolaser.'
  },
  {
    id: 'rugas-acordeao',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Rugas de Acordeão',
    description: 'As rugas de acordeão são linhas verticais que surgem nas bochechas pela perda de colágeno, flacidez da pele e repetição de expressões faciais como o sorriso. Neste caso, a paciente havia perdido peso recentemente, e a associação de preenchimento com ácido hialurônico, toxina botulínica em pontos avançados e medicina regenerativa com PDRN trouxe esse resultado.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789349486/Rugas_acordeao_qkjmsz.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Rugas de Acordeão.'
  },
  {
    id: 'ultrassom-microfocado',
    category: 'Flacidez',
    procedure: 'Ultrassom Microfocado',
    title: 'Ultrassom Micro e Macrofocado',
    description: 'A associação de técnicas costuma trazer resultados mais completos: neste caso, o ultrassom micro e macrofocado foi combinado com preenchimento do sulco nasogeniano, resultando numa melhora expressiva da flacidez e do contorno facial.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789350854/macrofocado_kvqu48.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Ultrassom Micro e Macrofocado.'
  },
  {
    id: 'rejuvenescimento-facial',
    category: 'Rejuvenescimento',
    procedure: 'Associação de tratamentos',
    title: 'Rejuvenescimento Facial',
    description: 'Alguns resultados vão além da estética e carregam confiança e autoestima. Esta paciente veio de outro estado especialmente para realizar o tratamento, e o objetivo nunca foi transformar, mas valorizar sua beleza individual, respeitando suas características e promovendo um resultado elegante e natural.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789351706/rejuvenecimento_facial_sv7k3x.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Rejuvenescimento Facial.'
  },
  {
    id: 'rejuvenescimento-facial-2',
    category: 'Rejuvenescimento',
    procedure: 'Associação de tratamentos',
    title: 'Rejuvenescimento Facial (Caso 2)',
    description: 'Nesta mesma paciente, observamos suavização das rugas ao redor dos olhos e das linhas de marionete, melhora da firmeza e sustentação facial, e uma textura de pele mais uniforme e viçosa. Um rejuvenescimento natural, sem perder a identidade e a expressão do rosto.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789400793/rejuvenecimento_facial02_cnu8gm.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Rejuvenescimento Facial.'
  },
  {
    id: 'rejuvenescimento-facial-3',
    category: 'Rejuvenescimento',
    procedure: 'Associação de tratamentos',
    title: 'Rejuvenescimento Facial (Caso 3)',
    description: 'Um plano personalizado, respeitando a anatomia e as necessidades da paciente, trouxe pele mais uniforme e iluminada, suavização das linhas de expressão e um contorno facial mais equilibrado. O objetivo não é transformar, mas valorizar e devolver vitalidade à pele, sem exageros ou perda da naturalidade.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789402978/rejuvenecimento_facial03_yyxxz2.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Rejuvenescimento Facial.'
  },
  {
    id: 'projecao-mento',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Projeção de Mento e Definição de Mandíbula',
    description: 'O mento tem papel fundamental na harmonia facial, servindo como ponto de referência tanto de perfil quanto de frente. Uma boa projeção define o contorno da mandíbula, evita o aspecto de papada e mantém o equilíbrio entre os terços do rosto. A projeção adequada foi trabalhada para trazer mais definição e harmonia ao perfil da paciente.',
    type: 'pair',
    imageBefore: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789343118/mandibula_antes_nlpp6y.png',
    imageAfter: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789343128/mandibula_depois_rh5bni.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Projeção de Mento e Definição de Mandíbula.'
  },
  {
    id: 'dermatocalaze-olhos',
    category: 'Flacidez',
    procedure: 'Ultrassom Microfocado e Toxina Botulínica',
    title: 'Dermatocalaze (Região dos Olhos)',
    description: 'A dermatocalaze, também conhecida como blefarocalaze, é o excesso de pele e gordura nas pálpebras superiores, que ocorre quando a região ao redor dos olhos perde firmeza e elasticidade. A associação de ultrassom microfocado com toxina botulínica trouxe uma melhora significativa no contorno dos olhos.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789351151/Dermatocalaze_tsrzuz.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Dermatocalaze na região dos olhos.'
  },
  {
    id: 'rugas-marionete',
    category: 'Preenchimento',
    procedure: 'Preenchimento, Toxina Botulínica e Ultrassom Microfocado',
    title: 'Rugas de Marionete',
    description: 'Com um protocolo individualizado de ácido hialurônico e ultrassom microfocado, foi possível suavizar o bigode chinês e as rugas de marionete, promovendo uma expressão mais leve e um sorriso mais harmônico. O foco é preservar a naturalidade, reduzindo marcas de expressão e trazendo um aspecto mais descansado e equilibrado.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789343725/rugas_marionete_ankltj.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Rugas de Marionete.'
  },
  {
    id: 'preenchimento-labial',
    category: 'Preenchimento',
    procedure: 'Preenchimento',
    title: 'Preenchimento Labial',
    description: 'O preenchimento labial com ácido hialurônico devolve volume e contorno de forma gradual, respeitando a proporção natural do rosto. O objetivo é realçar os lábios com um resultado harmônico, sem perder a expressão natural da paciente.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789350739/preenchimento_labial_sdx3va.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Preenchimento Labial.'
  },
  {
    id: 'botox-feminino',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox Feminino',
    description: 'A proposta aqui não era transformar, mas devolver o que o tempo suavemente levou. Foram associados botox full face, preenchimento em pontos estratégicos para reposição de volume e um protocolo personalizado para melhora da textura da pele, incluindo skincare individualizado e suplementação oral. O resultado foi uma aparência mais descansada e harmoniosa, respeitando a identidade da paciente.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789351998/botox_feminino_jkjxbl.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Botox Feminino.'
  },
  {
    id: 'botox-feminino-2',
    category: 'Toxina Botulínica',
    procedure: 'Toxina Botulínica',
    title: 'Botox Feminino (Caso 2)',
    description: 'Apenas com botox full face foi possível um resultado global de rejuvenescimento e harmonização facial, suavizando as rugas ao redor dos olhos, melhorando a definição do contorno mandibular e promovendo um efeito de lifting sutil, sem perder a naturalidade da expressão.',
    disclaimer: '*Resultados individuais podem variar.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789402438/botox_feminino03_fxakgc.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Toxina Botulínica.'
  },
  {
    id: 'papada',
    category: 'Flacidez',
    procedure: 'Flacidez',
    title: 'Papada',
    description: 'Resultado de um protocolo voltado para a redução da papada, trazendo mais definição ao contorno do rosto e do pescoço. Cada caso é avaliado individualmente para indicar a abordagem mais adequada.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789350436/papada_hx9fiz.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para tratamento de Papada.'
  },
  {
    id: 'protocolo-combinado-rejuvenescimento',
    category: 'Rejuvenescimento',
    procedure: 'Toxina Botulínica, Ultrassom Microfocado com Radiofrequência e Preenchimento com Ácido Hialurônico',
    title: 'Protocolo Combinado de Rejuvenescimento',
    description: 'Esta paciente apresentava eritema difuso, textura irregular e sulcos mais evidentes. Após um protocolo individualizado, combinando toxina botulínica, ultrassom microfocado com radiofrequência e preenchimento facial em pontos estratégicos de sustentação, o resultado trouxe tom de pele mais uniforme, redução do rubor e suavização das linhas, sempre respeitando a naturalidade.',
    type: 'combined',
    image: 'https://res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_800,dpr_auto/v1789350199/rejuvenescimento_facial_fx0of1.png',
    whatsappMessage: 'Olá, vi o site da Dra. Daniele e gostaria de agendar uma avaliação para Protocolo Combinado de Rejuvenescimento.'
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
  const lightboxWhatsapp = document.getElementById('lightbox-whatsapp');
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
      const disclaimer = '<span class="result-disclaimer">*Resultados individuais podem variar.</span>';
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

    if (caso.whatsappMessage && lightboxWhatsapp) {
      lightboxWhatsapp.href = `https://wa.me/5521988145834?text=${encodeURIComponent(caso.whatsappMessage)}`;
      lightboxWhatsapp.hidden = false;
    } else if (lightboxWhatsapp) {
      lightboxWhatsapp.hidden = true;
    }

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
  // Remove qualquer transformacao de video ja presente (ex.: q_auto:eco,w_720
  // usado no <video> real) antes de inserir a transformacao propria do poster,
  // para nunca encadear os dois parametros na mesma imagem.
  return videoUrl
    .replace(/\/video\/upload\/(?:(?!v\d+\/)[a-z0-9_:.,-]+\/)?/i, '/video/upload/so_auto,f_auto,q_auto,w_800/')
    .replace(/\.mp4$/i, '.jpg');
}

const DIARY_POSTS = [
  {
    id: 'rosacea',
    title: 'Rosácea',
    description: 'A escolha do protetor solar certo faz toda a diferença no tratamento da rosácea.',
    instagramUrl: 'https://www.instagram.com/reel/DT3hQrFjnVF/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789183539/rosacea_home_pndxz0.mp4'
  },
  {
    id: 'mounjaro',
    title: 'Mounjaro',
    description: 'Como funciona, quando é indicado e por que o acompanhamento médico é essencial durante o uso.',
    instagramUrl: 'https://www.instagram.com/reel/DQmk45TjuC1/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789183690/mounjaro_home_gyctrn.mp4'
  },
  {
    id: 'melasma',
    title: 'Melasma',
    description: 'Manchas que exigem tratamento contínuo e proteção diária para não retornar.',
    instagramUrl: 'https://www.instagram.com/reel/DOhOQ7SDh-3/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789183880/melasma_home_kxcbi5.mp4'
  },
  {
    id: 'protetor-solar',
    title: 'Protetor solar',
    description: 'Como escolher a proteção ideal para cada tipo de pele.',
    instagramUrl: 'https://www.instagram.com/reel/DMusWB7xsGt/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789183971/protetor_solar_home_bsahow.mp4'
  },
  {
    id: 'queda-capilar',
    title: 'Queda Capilar',
    description: 'Entenda as causas mais comuns e quando buscar avaliação médica.',
    instagramUrl: 'https://www.instagram.com/p/DOWRq6gDpWi/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789184117/queda_capilar_home_ps8tjj.mp4'
  },
  {
    id: 'preenchimento-facial',
    title: 'Preenchimento facial',
    description: 'Naturalidade e equilíbrio para valorizar seus traços.',
    instagramUrl: 'https://www.instagram.com/p/DOJwTjoEmGB/',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789184185/preenchimento_facial_home_kd7pue.mp4'
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
  {
    name: 'Pamela Oliveira',
    rating: 5,
    text: 'Hoje tive o prazer de conhecer, excelente profissional! Fui muito bem atendida, extremamente atenciosa, cuidadosa e explica tudo com muita clareza. Dá pra perceber o quanto ama o que faz e se preocupa de verdade com os pacientes.'
  },
  {
    name: 'Thayanne Layse',
    rating: 5,
    text: 'Depois de muitos anos, tive a felicidade de reencontrar a dermatologista que cuidou de mim na juventude e ela continua exatamente como eu lembrava: maravilhosa, atenciosa e extremamente gentil. O consultório é impecável, acolhedor e transmite muito cuidado em cada detalhe.'
  },
  {
    name: 'Lethícia Rodrigues',
    rating: 5,
    text: 'Sou paciente da doutora há mais de 2 anos, e ela, junto com toda a sua equipe, sempre foi muito atenciosa e cuidadosa comigo. Hoje em dia, até meu filho adolescente, Miguel, faz acompanhamento com ela.'
  },
  {
    name: 'borges fitness',
    rating: 5,
    text: 'Ótima profissional! Muito atenciosa, prática, resolve logo o problema. Fui lá com meu filho de 2 anos que tinha um molusco próximo à boca, onde outras dermatologistas falavam que era difícil de tirar. A Dra Daniele tirou em segundos e sem dor nenhuma.'
  },
  {
    name: 'Daniele Alves',
    rating: 5,
    text: 'Foi maravilhosa, a dra nos atende muito tanto como pessoa, quanto no profissional, todas as demandas que preciso sempre são solucionadas, não largarei mais ela! Fora a secretária Dani também e o aconchego do consultório, tudo mil vezes parabéns!'
  },
  {
    name: 'marieny friebe',
    rating: 5,
    text: 'Já sou paciente da Dra Danielle à um tempo... adoro ela como profissional e como pessoa. Ela é super atenciosa, dedicada, carinhosa e consegue ter um olhar atento e diferente a cada paciente. O consultório é lindo, como ela, sua nova secretária tb é super gentil.'
  },
  {
    name: 'Elaine Tenorio',
    rating: 5,
    text: 'Estava com falhas enormes por conta da alopecia, comecei o tratamento com a Dra. Daniele e com um mês as falhas foram preenchidas. Excelente profissional, nada de enrolação com os tratamentos.'
  },
  {
    name: 'Ana Loyola',
    rating: 5,
    text: 'Durante muito tempo convivi com uma acne tardia sem entender a causa, o que afetava não só minha pele, mas também minha autoestima. Graças ao olhar atento, à escuta cuidadosa e à competência da Dra., finalmente tive um diagnóstico preciso e um tratamento eficaz.'
  },
  {
    name: 'Tatyana Furtado',
    rating: 5,
    text: 'Minha pele ficou fantástica com os cuidados da Dra, ela estava lotada de espinhas e manchada! Estou aqui hj brincando com ela que NÃO VIVO MAIS SEM ELA!!! Hj retornei para fazer a sessão de laser e sair com pele de pêssego!!'
  },
  {
    name: 'Alan Silva',
    rating: 5,
    text: 'Cheguei até a Dra com a pele manchada por um procedimento realizado por outro profissional. A dra me passou uma medicação que resolveu no mesmo dia, fora que ela foi super atenciosa sobre as demais questões da minha saúde. Ótima.'
  },
  {
    name: 'Fabiano Carvalho',
    rating: 5,
    text: 'Fiz tratamento de rosácea com outra dermatologista por muito tempo, gastando muito, e sem evolução. Ao conhecer a Dra Daniele, resolveu o problema com as medicações certas em 30 dias. Excelente profissional. Precisa em seus tratamentos e prescrições.'
  },
  {
    name: 'Joelma Freitas',
    rating: 5,
    text: 'Sou paciente dessa mulher linda e querida há anos e não troco por nada nesse mundo; extremamente competente e profissional sem igual!! Simplesmente venham...'
  },
  {
    name: 'Gabriele Mariano',
    rating: 5,
    text: 'Minha experiência foi boa. A consulta foi bem rápida. Em uma consulta a Dra. Daniele resolveu 3 problemas meus kkkk. Ela é um amor, muito carinhosa. Muito obrigada! Eu estou indicando ela pra todo mundo e pros meus pacientes também!'
  },
  {
    name: 'kayky Nunes',
    rating: 5,
    text: 'É inacreditável o que essa médica fez pela minha pele e autoestima! Sou outra pessoa. Gratidão à essa médica MARAVILHOSA.'
  }
];

const INSTAGRAM_TESTEMUNHOS = [
  {
    id: 'melasma-1',
    name: '',
    category: 'Estética',
    treatment: 'Melasma',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353520/rosilene_melasma_incq4c.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353520/rosilene_melasma_incq4c.mp4')
  },
  {
    id: 'protocolo-emagrecimento-1',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Protocolo de Emagrecimento',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353723/luciana_protocolo_emagrecimento_owegqi.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353723/luciana_protocolo_emagrecimento_owegqi.mp4')
  },
  {
    id: 'tratamento-nodulos',
    name: '',
    category: 'Dermatologia',
    treatment: 'Tratamento de Nódulos',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353994/tratamento_nodulo_rfwwxg.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789353994/tratamento_nodulo_rfwwxg.mp4')
  },
  {
    id: 'protocolo-mounjaro',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Protocolo Mounjaro',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354246/protocolo_mounjaro_gg8kda.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354246/protocolo_mounjaro_gg8kda.mp4')
  },
  {
    id: 'diagnostico-esclerodermia-sistemica',
    name: '',
    category: 'Dermatologia',
    treatment: 'Diagnóstico de Esclerodermia Sistêmica',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354558/diagnostico_esclerodermia_sistemica_ixpvnd.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354558/diagnostico_esclerodermia_sistemica_ixpvnd.mp4')
  },
  {
    id: 'tratamento-integrativo',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Tratamento Integrativo',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354992/tratamento_integrativo_htd2nl.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789354992/tratamento_integrativo_htd2nl.mp4')
  },
  {
    id: 'melasma-2',
    name: '',
    category: 'Estética',
    treatment: 'Melasma',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355104/melasma_evh34w.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355104/melasma_evh34w.mp4')
  },
  {
    id: 'manchas-cicatrizes-acne',
    name: '',
    category: 'Estética',
    treatment: 'Manchas e Cicatrizes de Acne',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355245/manchas_cicatrizes_Acne_pvnv0l.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355245/manchas_cicatrizes_Acne_pvnv0l.mp4')
  },
  {
    id: 'estrias',
    name: '',
    category: 'Estética',
    treatment: 'Estrias',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355825/estrias_tq1vla.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355825/estrias_tq1vla.mp4')
  },
  {
    id: 'queloide-laser',
    name: '',
    category: 'Laser',
    treatment: 'Quelóide a Laser',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355980/queloide_laser_hteutz.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355980/queloide_laser_hteutz.mp4')
  },
  {
    id: 'protocolo-emagrecimento-2',
    name: '',
    category: 'Medicina Integrativa',
    treatment: 'Protocolo de Emagrecimento',
    video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789356143/protocoloco_emagrecimento_ytxbqg.mp4',
    poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789356143/protocoloco_emagrecimento_ytxbqg.mp4')
  }
];

// NOTA_EDITORIAL_VIDEO: conteudo audiovisual dedicado a secao "Nota
// editorial" (destaque editorial), separado dos depoimentos acima -
// nao entra no carrossel/filtro, apenas e aberto pelo botao de destaque.
const NOTA_EDITORIAL_VIDEO = {
  id: 'nota-editorial',
  name: '',
  category: 'Nota editorial',
  treatment: '',
  video: 'https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355739/diagnostico_vxjczi.mp4',
  poster: posterDoVideoCloudinary('https://res.cloudinary.com/do0uq7w4n/video/upload/q_auto:eco,w_720/v1789355739/diagnostico_vxjczi.mp4')
};

const PLAY_ICON_SVG = '<svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor"><path d="M0 0 L20 11 L0 22 Z"/></svg>';

// ---- Avaliações do Google (carrossel automático em loop) ----

const googleTrack = document.getElementById('google-marquee-track');

if (googleTrack) {
  function estrelasHtml(rating) {
    const cheias = '&#9733;'.repeat(rating);
    const vazias = '&#9734;'.repeat(5 - rating);
    return `<div class="testimonial-stars" aria-label="${rating} de 5 estrelas">${cheias}${vazias}</div>`;
  }

  const GOOGLE_LOGO_HTML = '<span class="google-review-source"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span>';

  function cartaoGoogle(avaliacao) {
    return `
      <article class="google-review-card">
        <p class="testimonial-quote">${escapeHtml(avaliacao.text)}</p>
        ${estrelasHtml(avaliacao.rating)}
        <div class="result-card-meta">
          ${GOOGLE_LOGO_HTML}
          <span class="testimonial-author">${escapeHtml(avaliacao.name)}</span>
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
  let testemunhosAntesDoDestaque = null;
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
    if (testemunhosAntesDoDestaque) {
      testemunhosVisiveis = testemunhosAntesDoDestaque;
      testemunhosAntesDoDestaque = null;
    }
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
      testemunhosAntesDoDestaque = testemunhosVisiveis;
      testemunhosVisiveis = [NOTA_EDITORIAL_VIDEO];
      abrirLightbox(0);
    });
  }

  renderizarFiltrosVideo();
  renderizarVideos(testemunhosVisiveis);
  iniciarAutoplay();
}