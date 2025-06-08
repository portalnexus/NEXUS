const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read the HTML file
let htmlContent;
try {
    htmlContent = fs.readFileSync('check_themes.html', 'utf8');
} catch (e) {
    console.error("Failed to read check_themes.html:", e);
    process.exit(1);
}

// Read the CSS file to ensure styles are applied
let cssContent;
try {
    cssContent = fs.readFileSync('style.css', 'utf8');
} catch (e) {
    console.error("Failed to read style.css:", e);
    process.exit(1);
}

// Create a JSDOM instance
// The `beforeParse` option allows us to inject things into the window/document
// The `resources: "usable"` would typically allow loading external resources, but local file paths can be tricky.
// A more robust way for local CSS is to inject it directly.
const dom = new JSDOM(htmlContent, {
    runScripts: "dangerously", // Enable scripts like theme-switcher.js if they were needed by check_themes.js directly
    pretendToBeVisual: true,   // Necessary for getComputedStyle to work meaningfully
    beforeParse(window) {
        // Inject a way to load CSS manually if needed, or other shims
        // For this case, we will inject the style.css content directly.
    }
});

// Get window and document from JSDOM
const { window } = dom;
const { document } = window;

// Inject the CSS content into a <style> tag in the head
const styleElement = document.createElement('style');
styleElement.textContent = cssContent;
document.head.appendChild(styleElement);


// Helper function to apply themes by directly setting body class
function applyThemeForTesting(themeName) {
    document.body.className = themeName; // This will be the primary way themes are "applied" for testing
    // console.log(`Applied theme for testing: ${themeName}`);
}

// Helper function to get and log computed styles
function getAndLogStyles(themeName, elementName, selector, properties) {
    const element = document.querySelector(selector);
    if (!element) {
        console.log(`ERROR: Element not found for selector: ${selector} under theme ${themeName}`);
        return;
    }
    const computedStyles = window.getComputedStyle(element);
    const styles = properties.map(prop => `${prop}: ${computedStyles.getPropertyValue(prop)}`).join(', ');
    console.log(`[${themeName}] ${elementName} (${selector}) - ${styles}`);
}

function runChecks() {
    console.log("--- Starting Theme Checks (JSDOM) ---");

    const h1Selector = 'h1';
    const pSelector = '.container p';
    const navASelector = 'nav a'; // Adjusted to match check_themes.html
    const fontProperties = ['font-family', 'font-size'];

    // Wait for styles to be parsed and applied by JSDOM (important!)
    // JSDOM processes things asynchronously in some cases. A small delay or event can help.
    // For direct style injection, it should be mostly synchronous.

    // --- 1. Theme Application Check ---
    console.log("\n--- 1. Theme Application Check ---");
    applyThemeForTesting('theme-blue-matrix');
    console.log("Body classList for theme-blue-matrix:", document.body.classList.toString());
     if (!document.body.classList.contains('theme-blue-matrix') || document.body.classList.length !== 1) {
        console.error("FAIL: theme-blue-matrix application error. Classes:", document.body.classList.toString());
    }


    applyThemeForTesting('theme-orange-matrix');
    console.log("Body classList for theme-orange-matrix:", document.body.classList.toString());
    if (!document.body.classList.contains('theme-orange-matrix') || document.body.classList.length !== 1) {
        console.error("FAIL: theme-orange-matrix application error. Classes:", document.body.classList.toString());
    }

    applyThemeForTesting('theme-retro-terminal');
    console.log("Body classList for theme-retro-terminal:", document.body.classList.toString());
     if (!document.body.classList.contains('theme-retro-terminal') || document.body.classList.length !== 1) {
        console.error("FAIL: theme-retro-terminal application error. Classes:", document.body.classList.toString());
    }

    applyThemeForTesting(''); // Default theme
    console.log("Body classList for default theme (no class):", document.body.classList.toString());
    if (document.body.classList.length !== 0) {
        console.error("FAIL: Default theme application error (body class not empty). Classes:", document.body.classList.toString());
    }

    // --- 2. Matrix Rain Color Variable Check ---
    console.log("\n--- 2. Matrix Rain Color Variable Check ---");
    applyThemeForTesting('theme-blue-matrix');
    let matrixColorBlue = window.getComputedStyle(document.body).getPropertyValue('--matrix-rain-actual-color').trim();
    console.log("Matrix Rain Color (theme-blue-matrix):", matrixColorBlue);
    if (matrixColorBlue.toLowerCase() !== '#0000ff') {
        console.error(`FAIL: Expected #0000FF for --matrix-rain-actual-color in theme-blue-matrix, got ${matrixColorBlue}`);
    }

    applyThemeForTesting('theme-orange-matrix');
    let matrixColorOrange = window.getComputedStyle(document.body).getPropertyValue('--matrix-rain-actual-color').trim();
    console.log("Matrix Rain Color (theme-orange-matrix):", matrixColorOrange);
     if (matrixColorOrange.toLowerCase() !== '#ffa500') {
        console.error(`FAIL: Expected #FFA500 for --matrix-rain-actual-color in theme-orange-matrix, got ${matrixColorOrange}`);
    }

    // --- 3. Font Consistency Check ---
    console.log("\n--- 3. Font Consistency Check ---");

    applyThemeForTesting('theme-blue-matrix');
    getAndLogStyles('theme-blue-matrix', 'H1', h1Selector, fontProperties);
    getAndLogStyles('theme-blue-matrix', 'P', pSelector, fontProperties);
    getAndLogStyles('theme-blue-matrix', 'NAV A', navASelector, fontProperties);

    applyThemeForTesting('theme-orange-matrix');
    getAndLogStyles('theme-orange-matrix', 'H1', h1Selector, fontProperties);
    getAndLogStyles('theme-orange-matrix', 'P', pSelector, fontProperties);
    getAndLogStyles('theme-orange-matrix', 'NAV A', navASelector, fontProperties);

    applyThemeForTesting('theme-retro-terminal');
    getAndLogStyles('theme-retro-terminal', 'H1', h1Selector, fontProperties);
    getAndLogStyles('theme-retro-terminal', 'P', pSelector, fontProperties);
    getAndLogStyles('theme-retro-terminal', 'NAV A', navASelector, fontProperties);

    applyThemeForTesting(''); // Default theme (no class, uses :root)
    getAndLogStyles('theme-default', 'H1', h1Selector, fontProperties);
    getAndLogStyles('theme-default', 'P', pSelector, fontProperties);
    getAndLogStyles('theme-default', 'NAV A', navASelector, fontProperties);

    console.log("\n--- Theme Checks Complete (JSDOM) ---");
}

// JSDOM might take a moment to parse and apply everything, especially with injected scripts or styles.
// A slight delay or using window.onload if scripts were involved.
// Since we inject CSS directly and call runChecks, it should be fairly synchronous.
// However, if theme-switcher.js (loaded by check_themes.html) had async parts that check_themes.js
// depended on, we'd need more careful synchronization.
// For this setup, theme-switcher.js is not directly used by check_themes.js's logic.

// Directly run checks
runChecks();
