// matrix-rain.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) {
        // console.log('Matrix canvas not found on this page.');
        return; 
    }

    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mathChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
        '+', '-', '=', '<', '>', '≤', '≥', '≠', 'π', 'Σ', 
        '∫', '∂', '∞', '√', '∛', '∜', 'y=ax²+bx+c', 'α', 'β', 
        'Γ', 'γ', 'Δ', 'δ', 'Ε', 'ε', 'ζ', 'η', 'Θ', 'θ', 'ι', 
        'κ', 'Λ', 'λ', 'μ', 'Ξ', 'ξ', 'Π', 'ρ', 'σ', 'ς', 'τ', 'υ', 
        'Φ', 'φ', 'Ψ', 'ψ', 'Ω', '·', '∀', '∃', '∈', '∉', '⊂', '⊃', 
        '⊆', '⊇', '∩', '∪', 'x', 'y', 'z', 'a', 'b', 'c', 'n', 'm', 'i', 'j', 'k', 
        'ν', 'ο', 'χ', 'ω', 'f(x)', 'g(x)', '∇', 'ħ', 
        '∴', '∵', '≈', '≅', '≡', '!', '?', '∮', 
        '∇²', '∠', '⊥', '∥', '∧', '∨', '¬', '⇔', '⇒', '∂/∂x', 
        'log(x)', 'ln(x)', 'cos(x)', 'sen(x)', 'tg(x)', '∑', '∏', '∅',
        'ℂⁿ', 'y', 'f(x)', 'Δx', 'δx', 'δy', 'A⁻¹', 'Aᵀ', 
        'I', 'e', 'Φ', 'ζ(s)', 'Γ(z)', '1729'

        /* Lista antiga de símbolos sem erro de undefined, estou tentando corrigir agora:
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '=', '<', '>', '≤', '≥', '≠',
        'π', 'Σ', '∫', '∂', '∞', '√', '∛', '∜', 'y=ax²+bx+c',
        'α', 'β', 'Γ', 'γ', 'Δ', 'δ', 'Ε', 'ε', 'ζ', 'η', 'Θ', 'θ', 'ι', 
        'κ', 'Λ', 'λ', 'μ', 'Ξ', 'ξ', 'Π', 'π', 'ρ', 'Σ', 'σ','ς', 'τ',
        'υ', 'Φ', 'φ', 'Ψ', 'ψ', 'Ω',
        '∀', '∃', '∈', '∉', '⊂', '⊃', '⊆', '⊇', '∩', '∪',
        'x', 'y', 'z', 'a', 'b', 'c', 'n', 'm', 'i', 'j', 'k',
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 
        'λ', 'μ', 'ν', 'ξ', 'ο', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
        'f(x)', 'g(x)', 'y=ax+b', 'a²+b²=c²', 'E=mc²', '∇', 'ħ',
        '∴', '∵', '≈', '≅', '≡', '∝', '1729', 'x=(-b±√Δ)/2a', 'Δ=b²-4ac'
        */
    ];

    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];

    function initializeDrops() {
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1 + Math.floor(Math.random() * (canvas.height / fontSize));
        }
    }
    initializeDrops(); // Initial setup

    // Draw function
    function draw() {
        // Conditional Background Fill for Trails
        if (document.body.classList.contains('theme-light-classic-neon-red')) {
            // For light theme: white background with red letters
            // Use a semi-transparent white for the trail effect on a white CSS background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Adjust alpha for desired trail length
        } else {
            // For dark themes: default semi-transparent black for trails
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get Text Color from CSS Variable
        const computedStyle = getComputedStyle(canvas);
        const matrixTextColor = computedStyle.getPropertyValue('--matrix-rain-actual-color').trim() || '#00FF00'; // Default to green if var not found
        ctx.fillStyle = matrixTextColor;
        ctx.font = fontSize + 'px monospace'; // Using a generic monospace font

        // Loop through the columns
        for (let i = 0; i < columns; i++) {
            // Pick a random math character
            const text = mathChars[Math.floor(Math.random() * mathChars.length)];
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // If the drop has reached the bottom of the screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0; // Reset to the top
            }

            // Increment y-position for the next frame
            drops[i]++;
        }
    }

    // Animation loop
    let animationIntervalId = setInterval(draw, 50); // Adjusted speed (e.g., 50ms for ~20FPS)

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        initializeDrops(); // Re-initialize drops for new column count and screen size
        
        // It's good practice to clear and restart the interval if parameters change significantly
        // or ensure the draw function correctly handles the new state.
        // For simplicity here, initializeDrops should handle most of it.
        // If the interval was based on requestAnimationFrame, it would adapt more smoothly.
    });

    console.log('Matrix rain script initialized and drawing loop started.');

}); // End of DOMContentLoaded listener
