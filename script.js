// ---------- Custom Cursor ----------
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});

// ---------- Splash Screen Logic ----------
const splashScreen = document.getElementById('splash-screen');
const music = document.getElementById('bg-music');
const mainWrap = document.querySelector('.wrap');
const mainFooter = document.querySelector('footer');

// Create particles for splash screen
function createParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random animation duration and delay
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
    
    particlesContainer.appendChild(particle);
  }
}

// Add float animation for particles
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0.6;
    }
    25% {
      transform: translateY(-20px) translateX(10px);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-10px) translateX(-10px);
      opacity: 1;
    }
    75% {
      transform: translateY(-30px) translateX(5px);
      opacity: 0.7;
    }
  }
`;
document.head.appendChild(style);

// Initialize particles on load
createParticles();

splashScreen.addEventListener('click', () => {
  // 1. Play music
  music.play().catch(error => {
    console.error("Lỗi phát nhạc:", error);
  });
  
  // 2. Hide splash screen
  splashScreen.classList.add('hidden');
  
  // 3. Show main content
  mainWrap.classList.add('visible');
  mainFooter.classList.add('visible');
  
  // 4. Initialize animations
  initStarfield();
  initStars();
  
}, { once: true });

// ---------- Starfield Background ----------
function initStarfield() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  const stars = [];
  const numStars = 200;
  
  // Create stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      alpha: Math.random()
    });
  }
  
  // Create nebulae
  const nebulae = [];
  for (let i = 0; i < 5; i++) {
    nebulae.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 100 + 50,
      color: `hsla(${Math.random() * 60 + 180}, 70%, 60%, 0.1)`
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw nebulae
    nebulae.forEach(nebula => {
      const gradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      );
      gradient.addColorStop(0, nebula.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // Draw stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
      
      // Update star position
      star.x += star.vx;
      star.y += star.vy;
      
      // Wrap around screen
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
      
      // Twinkle effect
      star.alpha += (Math.random() - 0.5) * 0.1;
      star.alpha = Math.max(0.1, Math.min(1, star.alpha));
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ---------- Twinkling Stars ----------
function initStars() {
  const starsContainer = document.getElementById('stars-container');
  const isLightTheme = document.body.classList.contains('light-theme');
  const numStars = isLightTheme ? 30 : 100; // Fewer stars in light theme
  
  // Clear existing stars
  starsContainer.innerHTML = '';
  
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random size
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random animation delay
    star.style.animationDelay = `${Math.random() * 3}s`;
    
    // Add bright class to some stars in dark theme
    if (!isLightTheme && Math.random() > 0.7) {
      star.classList.add('bright');
    }
    
    starsContainer.appendChild(star);
  }
}

// ---------- Theme Toggle ----------
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-theme');
}

themeBtn.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  
  // Save theme preference
  const isLight = body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  // Reinitialize stars for the new theme
  initStars();
  
  // Show notification
  showToast(isLight ? 'Chế độ sáng đã bật' : 'Chế độ tối đã bật');
});

// ---------- Typing Effect ----------
const typingTexts = [
  '🇰🇷 Du Học Sinh Hàn Quốc',
  '🎵 Yêu thích Âm Nhạc',
  '🎧 Đam mê DJ PRODUCER',
  '💻 Lập Trình Web',
  '🌟 Sống để học và tạo ra giá trị',
  '🚀 Hàn Quốc mãi mãi là số 1 trong ❤️ tôi',
  '🎶 Python 🐍 hay JavaScript đều chơi được😉'
];

let ti = 0, ci = 0;
const typEl = document.getElementById('typing');

function type() {
  const full = typingTexts[ti];
  typEl.textContent = full.slice(0, ci);
  ci++;
  
  if (ci > full.length) {
    setTimeout(() => {
      let del = full.length;
      const delInt = setInterval(() => {
        del--;
        typEl.textContent = full.slice(0, del);
        if (del <= 0) {
          clearInterval(delInt);
          ti = (ti + 1) % typingTexts.length;
          ci = 0;
          setTimeout(type, 300);
        } 
      }, 40);
    }, 900);
  } else {
    setTimeout(type, 60);
  }
}

setTimeout(type, 800);

// ---------- Reveal on Scroll ----------
const reveals = document.querySelectorAll('.reveal');

function checkReveal() {
  const top = window.innerHeight;
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < top - 40) {
      el.classList.add('show');
    }
  });
}

window.addEventListener('scroll', checkReveal);
checkReveal();

// ---------- Tilt Effect ----------
const card = document.querySelector('.card');

document.addEventListener('mousemove', e => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 10}deg) translateZ(3px)`;
});

document.addEventListener('mouseleave', () => {
  card.style.transform = '';
});

// ---------- Utility Functions ----------
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---------- Button Functions ----------
function downloadHTML() {
  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nguyencanhdien-profile.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Đã tải xuống file HTML!');
}

function copyEmail() {
  const email = 'nguyencanhdien2002.org@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Đã sao chép email!');
  }).catch(err => {
    console.error('Lỗi sao chép:', err);
    showToast('Lỗi khi sao chép email!');
  });
}

function shareProfile() {
  if (navigator.share) {
    navigator.share({
      title: 'Nguyễn Cảnh Điền - Profile',
      text: 'Xem profile của Nguyễn Cảnh Điền',
      url: window.location.href
    }).then(() => {
      showToast('Đã chia sẻ thành công!');
    }).catch(err => {
      console.error('Lỗi chia sẻ:', err);
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Đã sao chép link để chia sẻ!');
    }).catch(err => {
      console.error('Lỗi sao chép link:', err);
      showToast('Lỗi khi sao chép link!');
    });
  }
}

// ---------- Keyboard Shortcuts ----------
document.addEventListener('keydown', (e) => {
  // Toggle theme with 'T' key
  if (e.key.toLowerCase() === 't') {
    themeBtn.click();
  }
  
  // Toggle music with 'M' key
  if (e.key.toLowerCase() === 'm') {
    if (music.paused) {
      music.play();
      showToast('Nhạc nền đã bật!');
    } else {
      music.pause();
      showToast('Nhạc nền đã tắt!');
    }
  }
});

// ---------- Initialize on Load ----------
window.addEventListener('load', () => {
  // Add loading animation removal
  document.body.style.opacity = '1';
  
  // Initialize any remaining animations
  setTimeout(() => {
    checkReveal();
  }, 100);
});

// ---------- Handle Visibility Change ----------
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    music.pause();
  } else {
    // Resume animations when tab becomes visible
    if (!splashScreen.classList.contains('hidden')) {
      // Don't resume music if splash screen is still showing
      return;
    }
    // Optional: resume music
    // music.play().catch(e => console.log('Music play failed:', e));
  }
});
