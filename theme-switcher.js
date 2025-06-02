// theme-switcher.js - Part 1 & 2: UI Interaction, Theme Application, LocalStorage

document.addEventListener('DOMContentLoaded', () => {
    const themeConfigIcon = document.getElementById('theme-config-icon');
    const themeSelectorPanel = document.getElementById('theme-selector-panel');
    const themeButtons = themeSelectorPanel ? themeSelectorPanel.querySelectorAll('button[data-theme]') : []; // Ensure panel exists

    // Function to apply a theme
    function applyTheme(themeClass) {
        // Remove any existing theme classes from body
        document.body.classList.remove('theme-digital-blue-green', 'theme-retro-terminal', 'theme-light-classic-neon-red');
        // Note: 'theme-default' isn't a class we add; it's the absence of other theme classes, relying on :root.

        if (themeClass && themeClass !== 'theme-default') {
            document.body.classList.add(themeClass);
        }
        // Save to localStorage
        localStorage.setItem('selectedTheme', themeClass || 'theme-default'); // Store 'theme-default' explicitly
        console.log('Theme applied:', themeClass || 'theme-default');
    }

    // --- UI Interaction (from Part 1, ensure it's compatible) ---
    if (themeConfigIcon && themeSelectorPanel) {
        themeConfigIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from immediately closing panel if click-outside is added
            themeSelectorPanel.classList.toggle('hidden');
        });

        // Optional: Close panel if clicking outside of it
        document.addEventListener('click', (event) => {
            if (!themeSelectorPanel.contains(event.target) && !themeConfigIcon.contains(event.target) && !themeSelectorPanel.classList.contains('hidden')) {
                themeSelectorPanel.classList.add('hidden');
            }
        });

        console.log('Theme switcher UI interaction script initialized.');
    } else {
        if (!themeConfigIcon) console.error('Theme config icon not found.');
        if (!themeSelectorPanel) console.error('Theme selector panel not found.');
        // If panel not found, no point in setting up buttons or loaded theme.
        return; 
    }
    // --- End of UI Interaction specific block ---

    // --- Theme Application & LocalStorage Logic (Part 2) ---
    // Add event listeners to theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const themeClass = event.currentTarget.getAttribute('data-theme');
            applyTheme(themeClass);
            themeSelectorPanel.classList.add('hidden'); // Hide panel after selection
        });
    });

    // On page load, apply saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme); // Apply the theme found in localStorage
    } else {
        // Default to 'theme-retro-terminal' if no theme is saved
        applyTheme('theme-retro-terminal'); 
    }
    // Ensure the console log also reflects the potentially loaded theme accurately
    console.log('Theme switcher: Applied theme on load:', localStorage.getItem('selectedTheme'));

}); // End of DOMContentLoaded listener
