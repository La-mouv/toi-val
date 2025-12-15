document.addEventListener('DOMContentLoaded', () => {
    const layer1 = document.getElementById('bg-layer-1');
    const layer2 = document.getElementById('bg-layer-2');
    const loadingContainer = document.getElementById('loading-container');
    const loadingFill = document.getElementById('loading-fill');

    // Image configuration
    const images = [
        'pictures/1.jpeg',
        'pictures/2.png',
        'pictures/3.png',
        'pictures/4.png',
        'pictures/6.png',
        'pictures/7.jpg'
    ];

    const sliderHandle = document.getElementById('slider-handle');

    // Preload images
    images.forEach(src => {
        new Image().src = src;
    });

    const maxProgress = images.length - 1;
    let isDragging = false;
    let isAnimating = true; // Flag for intro animation

    // Initial state: 0%
    updateSlider(0);

    // Add Intro Animation Class
    sliderHandle.classList.add('animate-hint');

    // Remove animation on interaction
    function killAnimation() {
        if (isAnimating) {
            sliderHandle.classList.remove('animate-hint');
            isAnimating = false;
        }
    }

    // Event Listeners for Slider
    loadingContainer.addEventListener('mousedown', startDrag);
    loadingContainer.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    function startDrag(e) {
        killAnimation(); // Stop the wiggle
        isDragging = true;
        handleInput(e);
    }

    function onDrag(e) {
        if (!isDragging) return;
        if (e.type === 'touchmove') e.preventDefault();
        handleInput(e);
    }

    function endDrag() {
        isDragging = false;
    }

    function handleInput(e) {
        const rect = loadingContainer.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;

        // Calculate raw position relative to bar
        let x = clientX - rect.left;

        // Clamp (0 to width)
        x = Math.max(0, Math.min(x, rect.width));

        // Calculate percentage (0 to 1)
        const percentage = x / rect.width;

        updateSlider(percentage);
    }

    function updateSlider(percentage) {
        // Update bar visuals
        loadingFill.style.width = `${percentage * 100}%`;

        // Update handle visual (ensure it stays within bounds visually if desired, 
        // but simple percentage left is usually fine for centering on track)
        if (!isAnimating) { // Only position manually if not animating
            sliderHandle.style.left = `${percentage * 100}%`;
        }

        // Update images (Map 0-1 to 0-maxProgress)
        const imageProgress = percentage * maxProgress;
        renderImages(imageProgress);
    }

    function renderImages(progress) {
        // Determine indices
        const index1 = Math.floor(progress); // Bottom layer
        const index2 = Math.min(index1 + 1, maxProgress); // Top layer

        // Calculate blend factor (0 to 1) for the top layer
        const blend = progress - index1;

        // Optimize: Only update DOM if src changes
        if (layer1.style.backgroundImage !== `url("${images[index1]}")`) {
            layer1.style.backgroundImage = `url('${images[index1]}')`;
        }

        if (layer2.style.backgroundImage !== `url("${images[index2]}")`) {
            layer2.style.backgroundImage = `url('${images[index2]}')`;
        }

        // Integrity check for end
        if (progress >= maxProgress - 0.01) {
            layer1.style.backgroundImage = `url('${images[maxProgress]}')`;
            layer2.style.opacity = 0;
        } else {
            layer2.style.opacity = blend;
        }
    }
});
