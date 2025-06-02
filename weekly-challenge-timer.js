document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');

    if (!countdownElement) {
        console.error('Countdown element not found on this page.');
        return;
    }

    function getNextMonday9AM() {
        const now = new Date();
        const nextMonday = new Date(now.valueOf());

        // Find the next Monday
        // Day of week: Sunday is 0, Monday is 1, ..., Saturday is 6
        let daysUntilMonday = (1 - now.getDay() + 7) % 7;
        if (daysUntilMonday === 0 && now.getHours() >= 9) {
            // If it's Monday and past 9 AM, target next week's Monday
            daysUntilMonday = 7;
        }

        nextMonday.setDate(now.getDate() + daysUntilMonday);
        nextMonday.setHours(9, 0, 0, 0); // Set time to 09:00:00.000

        return nextMonday;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const targetTime = getNextMonday9AM().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            countdownElement.innerHTML = "Novo desafio no ar! Confira!";
            // Optionally, stop the interval if the challenge is released
            // clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Initial call to display immediately
    updateCountdown();

    // Update every second
    const timerInterval = setInterval(updateCountdown, 1000);
});
