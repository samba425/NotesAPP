// Reset Theme Script
// Run this in your browser console to switch to light theme

localStorage.setItem('theme', 'light');
document.body.classList.remove('dark-theme');
location.reload();

console.log('Theme reset to LIGHT mode. Page will reload...');
