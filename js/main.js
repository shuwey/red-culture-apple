document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // AI floating button is now provided by js/ai.js

  // Search button placeholder
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = window.prompt('请输入搜索关键词：');
      if (q && q.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(q.trim())}`;
      }
    });
  }

  // Nav background on scroll
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
      } else {
        nav.style.background = 'rgba(251, 251, 253, 0.8)';
      }
    });
  }
});
