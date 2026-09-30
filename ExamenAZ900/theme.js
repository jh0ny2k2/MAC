function initTheme() {
    const toggle = document.getElementById('toggleDark');
    const stored = localStorage.getItem('theme:dark');
    // Default to system preference if nothing stored
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If stored is '1', force dark. If '0', force light. If null, use system.
    const isDark = stored === '1' || (stored === null && prefersDark);
    
    setDark(isDark);
    
    if (toggle) {
        toggle.checked = isDark;
        toggle.addEventListener('change', (e) => setDark(e.target.checked));
    }
}

function setDark(enabled) {
    if (enabled) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme:dark', enabled ? '1' : '0');
}

// Run immediately to prevent flash (if script is in head) or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
