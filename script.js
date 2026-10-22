document.addEventListener('DOMContentLoaded', () => {

  // Total Pages
  const TOTAL_PAGES = 16;
  let currentPage = 1;

  // DOM Element References
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const navItems = document.querySelectorAll('.nav-links li');
  const pageScreens = document.querySelectorAll('.page-screen');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const musicToggle = document.getElementById('musicToggle');
  const loveExplosionBtn = document.getElementById('loveExplosionBtn');
  const appContainer = document.getElementById('appContainer');
  const welcomeForm = document.getElementById('welcomeForm');
  const visitorName = document.getElementById('visitorName');
  const splitToggle = document.getElementById('splitToggle');
  const landscapeQuery = window.matchMedia('(orientation: landscape)');
  let storyStarted = false;

  function updateOrientationGate() {
    const gateVisible = !storyStarted || !landscapeQuery.matches;
    appContainer.inert = gateVisible;
    appContainer.setAttribute('aria-hidden', String(gateVisible));
    document.body.classList.toggle('story-started', storyStarted);
  }

  welcomeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!landscapeQuery.matches) return;

    const name = visitorName.value.trim();
    if (!name) return;

    document.querySelector('#page-1 .title-animated').textContent = `Welcome To ${name}'s World`;
    storyStarted = true;
    updateOrientationGate();
  });

  landscapeQuery.addEventListener('change', updateOrientationGate);
  updateOrientationGate();

  splitToggle.addEventListener('click', () => {
    const isSplit = appContainer.classList.toggle('split-view');
    splitToggle.setAttribute('aria-pressed', String(isSplit));
    splitToggle.title = isSplit ? 'Show story without chapter rail' : 'Show chapters beside the story';
  });

  /* ==========================================
     PAGE NAVIGATION ENGINE
     ========================================== */
  function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > TOTAL_PAGES) return;

    currentPage = pageNumber;

    // Update Screens
    pageScreens.forEach(screen => {
      screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(`page-${currentPage}`);
    if (targetScreen) targetScreen.classList.add('active');

    // Update Sidebar Navigation
    navItems.forEach(item => {
      item.classList.remove('active');
      if (parseInt(item.getAttribute('data-page')) === currentPage) {
        item.classList.add('active');
      }
    });

    // Update Counter & Controls
    pageIndicator.textContent = `Chapter ${currentPage} of ${TOTAL_PAGES}`;
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === TOTAL_PAGES);

    // Auto Close Mobile Sidebar
    closeMobileMenu();

    // Smooth scroll top on change
    document.querySelector('.content-area').scrollTop = 0;
  }

  // Event Listeners for Prev/Next
  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  // Sidebar Click Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = parseInt(item.getAttribute('data-page'));
      goToPage(page);
    });
  });

  // Mobile Sidebar Toggle
  function closeMobileMenu() {
    sidebar.classList.remove('open');
    sidebarBackdrop.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarBackdrop.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
  });
  closeSidebar.addEventListener('click', closeMobileMenu);
  sidebarBackdrop.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  /* ==========================================
     BACKGROUND AMBIENT PARTICLES
     ========================================== */
  const ambientContainer = document.getElementById('ambientHearts');

  function createAmbientHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const heartIcons = ['❤️', '💖', '🌸', '✨', '💕', '🧸'];
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';

    ambientContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(createAmbientHeart, 800);

  /* ==========================================
     INTERACTIVE HEART CURSOR TRAIL
     ========================================== */
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.3) return; // Throttle particle creation

    const trail = document.createElement('div');
    trail.classList.add('cursor-heart');
    trail.textContent = '💖';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 1000);
  });

  /* ==========================================
     BACKGROUND AUDIO SYNTHESIZER
     ========================================== */
  let audioCtx = null;
  let isPlaying = false;
  let musicInterval = null;

  function playSoftRomanticChords() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const chords = [
      [261.63, 329.63, 392.00], // C Major
      [220.00, 261.63, 329.63], // A Minor
      [174.61, 220.00, 261.63], // F Major
      [196.00, 246.94, 293.66]  // G Major
    ];

    let chordIndex = 0;

    musicInterval = setInterval(() => {
      if (!isPlaying) return;

      const currentChord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      currentChord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + (idx * 0.15));
        osc.stop(audioCtx.currentTime + 2.8);
      });

    }, 3000);
  }

  musicToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      musicToggle.style.background = '#ff4d6d';
      musicToggle.style.color = '#ffffff';
      playSoftRomanticChords();
    } else {
      musicToggle.style.background = 'rgba(255, 255, 255, 0.6)';
      musicToggle.style.color = 'var(--deep-red)';
      if (musicInterval) clearInterval(musicInterval);
    }
  });

  /* ==========================================
     LOVE SURPRISE EXPLOSION (PAGE 15)
     ========================================== */
  if (loveExplosionBtn) {
    loveExplosionBtn.addEventListener('click', () => {
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.classList.add('cursor-heart');
          const icons = ['❤️', '💖', '💕', '👑', '🌸', '✨', '🧸', '🐼'];
          particle.textContent = icons[Math.floor(Math.random() * icons.length)];
          
          particle.style.left = (window.innerWidth / 2 + (Math.random() * 300 - 150)) + 'px';
          particle.style.top = (window.innerHeight / 2 + (Math.random() * 300 - 150)) + 'px';
          particle.style.fontSize = (Math.random() * 2 + 1) + 'rem';

          document.body.appendChild(particle);

          setTimeout(() => particle.remove(), 1200);
        }, i * 25);
      }
    });
  }

  // Initialize Page 1
  goToPage(1);
});