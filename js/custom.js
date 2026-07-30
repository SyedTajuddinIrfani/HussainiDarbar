// Navigation, Smooth Scroll Animation & Scroll Reveal Interactivity for Darbar-E-Hussaini

document.addEventListener('DOMContentLoaded', function () {
    const menuCheckbox = document.getElementById('click');
    const menuBtnIcon = document.querySelector('nav .menu-btn i');
    const navLinks = document.querySelectorAll('nav ul li a, .welcome-box a, .btn-viewlibrary');

    // Initialize WOW.js for scroll animations
    if (typeof WOW !== 'undefined') {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 80,
            mobile: true,
            live: true
        }).init();
    }

    // Toggle menu icon between bars and close (X) icon when checkbox changes
    if (menuCheckbox && menuBtnIcon) {
        menuCheckbox.addEventListener('change', function () {
            if (this.checked) {
                menuBtnIcon.classList.remove('fa-bars');
                menuBtnIcon.classList.add('fa-xmark');
            } else {
                menuBtnIcon.classList.remove('fa-xmark');
                menuBtnIcon.classList.add('fa-bars');
            }
        });
    }

    // Custom Smooth Scroll Animation with Cubic Easing
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Ease in-out cubic formula for buttery smooth transition
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t * t + b;
            t -= 2;
            return (c / 2) * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    }

    // Auto close mobile drawer and execute animated smooth scroll on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetAttr = this.getAttribute('href');
            if (!targetAttr) return;

            // Handle internal anchor links
            if (targetAttr.includes('#')) {
                const hashIndex = targetAttr.indexOf('#');
                const targetId = targetAttr.substring(hashIndex);
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Uncheck menu checkbox to close mobile drawer
                    if (menuCheckbox && menuCheckbox.checked) {
                        menuCheckbox.checked = false;
                        if (menuBtnIcon) {
                            menuBtnIcon.classList.remove('fa-xmark');
                            menuBtnIcon.classList.add('fa-bars');
                        }
                    }

                    // Update active state for navbar links
                    const headerNavLinks = document.querySelectorAll('nav ul li a');
                    headerNavLinks.forEach(l => l.classList.remove('active'));
                    const matchNavLink = document.querySelector(`nav ul li a[href*="${targetId}"]`);
                    if (matchNavLink) matchNavLink.classList.add('active');

                    // Calculate position considering sticky navbar height
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Smooth animated scroll with 750ms easing duration
                    smoothScrollTo(offsetPosition, 750);
                }
            }
        });
    });

    // Update active navbar link on window scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + 120;
        const sections = document.querySelectorAll('div[id], section[id]');
        const headerNavLinks = document.querySelectorAll('nav ul li a');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                headerNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.endsWith('#' + sectionId)) {
                        headerNavLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});
