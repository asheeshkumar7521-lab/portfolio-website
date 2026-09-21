document.getElementById('year').textContent = new Date().getFullYear();

// Continuously cycling role text ("typewriter")
const roles = ["DSA Enthusiast", "Software Developer", "AI Enthusiast", "Problem Solver", "Python Developer"];
const typedEl = document.getElementById('typed-role');
if (typedEl) {
  let roleIndex = 0, charIndex = 0, deleting = false;
  const TYPE_SPEED = 70, DELETE_SPEED = 40, HOLD_TIME = 1400, GAP_TIME = 300;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, GAP_TIME);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }
  tick();
}

// Reveal sections/cards as they scroll into view
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('visible'));
}

// Duplicate marquee track content so the scroll loop is seamless
document.querySelectorAll('[data-marquee]').forEach(track => {
  track.innerHTML += track.innerHTML;
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.cssText += open ? '' : 'position:absolute;top:64px;left:0;right:0;background:#0a0e17;flex-direction:column;padding:20px 32px;border-bottom:1px solid var(--border);';
  });
}

// Contact form (Web3Forms)
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = this.querySelector('.send-btn');
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(this)))
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = 'Message sent ✓';
      btn.style.background = 'var(--green)';
      this.reset();
    } else {
      btn.textContent = 'Failed, try again';
    }
  } catch (err) {
    btn.textContent = 'Network error';
  }

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = 'var(--cyan)';
    btn.disabled = false;
  }, 2500);
});