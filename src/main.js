// Main JavaScript file
// console.log('Tailwind Starter is ready!');

// Theme toggle with persistence
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'sf-theme';

  function applyTheme(theme) {
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', dark);
  }

  // Initialize
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);
  if (toggle) toggle.checked = root.classList.contains('dark');

  // Listen to toggle
  if (toggle) {
    toggle.addEventListener('change', () => {
      const theme = toggle.checked ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    });
  }

  // React to OS changes if system selected later
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = localStorage.getItem(STORAGE_KEY) || 'dark';
    if (current === 'system') applyTheme('system');
  });
});

// You can add more JavaScript modules here and import them as needed
