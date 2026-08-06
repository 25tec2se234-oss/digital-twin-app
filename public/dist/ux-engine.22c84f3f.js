// Global Image Fallback Handler to prevent any broken images on the website
window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
        e.target.src = '/img/dtv-logo.jpg';
    }
}, true);

document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    // --- 1. Custom Interactive Cursor ---
    const cursor = document.getElementById("cursor");
    const cursorRing = document.getElementById("cursor-ring");
    
    if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        
        // Smooth follow for the ring
        const speed = 0.15;
        
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Update center dot instantly using CSS variables
            cursor.style.setProperty('--x', `${mouseX}px`);
            cursor.style.setProperty('--y', `${mouseY}px`);
        });
        
        const animateCursor = () => {
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            cursorRing.style.setProperty('--x', `${ringX}px`);
            cursorRing.style.setProperty('--y', `${ringY}px`);
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, input, .btn-amb, .btn-out, .feat-card, .auth-card');
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
            el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
        });
    }

    // --- 2. tsParticles Neural Network Background ---
    if (typeof tsParticles !== 'undefined' && !isMobile) {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: !isMobile, // Disable grab mode on mobile for performance
                        mode: "grab", 
                    },
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 0.5 } }
                },
            },
            particles: {
                color: { value: "#37d7ff" },
                links: {
                    color: "#7b2fff",
                    distance: 150,
                    enable: !isMobile, // EXTREME PERFORMANCE HACK: Lines kill mobile GPUs. Disable them.
                    opacity: 0.2,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: false,
                    straight: false,
                    outModes: { default: "bounce" },
                },
                number: { value: isMobile ? 15 : 35, density: { enable: true, area: 800 } },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 2 } },
            },
            detectRetina: true,
        });
    }

    // --- 3. Hacker Text Decoding Effect ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    
    function decodeText(element) {
        if(element.dataset.decoded === "true") return;
        const originalText = element.innerText;
        element.dataset.original = originalText;
        element.dataset.decoded = "true";
        
        let iterations = 0;
        const interval = setInterval(() => {
            element.innerText = originalText.split("")
                .map((letter, index) => {
                    if (index < iterations || letter === " ") {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
                
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            iterations += 1/3;
        }, 30);
    }

    // --- 4. GSAP Cinematic Scroll Animations ---
    if (!isMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Decode headers removed to preserve HTML structure (<br>, <span>)

        // Cinematic card reveal
        const cards = document.querySelectorAll(".feat-card, .step-card, .info-card");
        cards.forEach((card, index) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // Scroll state detector to eliminate mousemove layout thrashing during laptop/touchpad scrolling
    let isScrolling = false;
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 120);
    }, { passive: true });

    // --- 5. Spotlight Card Effect ---
    if (!isMobile) {
        const spotlightCards = document.querySelectorAll('.feat-card, .auth-card, .dash-card, .glass-panel, .info-card, .step-card');
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (isScrolling) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
        
        // --- 6. Magnetic Elements (Buttons & Nav) ---
        const magneticBtns = document.querySelectorAll('.btn-amb, .btn-out, .logo, .nav-ul a, .nav-pill, .account-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                if (isScrolling || typeof gsap === 'undefined') return;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                if (typeof gsap === 'undefined') return;
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
            });
        });
    }

    // --- 7. Magnetic Cards (Subtle Lean & 3D Tilt) ---
    // Restored 3D tilt! Hardware acceleration in CSS makes this smooth now.
    const magneticCards = document.querySelectorAll('.feat-card, .auth-card, .dash-card, .glass-panel, .info-card, .step-card, .analyzer-card');
    magneticCards.forEach(card => {
        const isAnalyzer = card.classList.contains('analyzer-card');
        
        card.addEventListener('mousemove', (e) => {
            if (isScrolling || typeof gsap === 'undefined' || ('ontouchstart' in window)) return; // Skip mousemove on touch devices & scrolling
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Cards move very slightly and rotate in 3D for a premium feel
            // The analyzer card gets a slightly stronger effect to make the translateZ pop
            const mult = isAnalyzer ? 0.08 : 0.035;
            const moveMult = isAnalyzer ? 0.02 : 0.05;
            
            gsap.to(card, { 
                transformPerspective: 1200,
                x: x * moveMult, 
                y: y * moveMult, 
                rotationY: x * mult, 
                rotationX: -y * mult,
                duration: 0.4, 
                ease: 'power2.out' 
            });
        });
        card.addEventListener('mouseleave', () => {
            if (typeof gsap === 'undefined' || ('ontouchstart' in window)) return;
            gsap.to(card, { 
                transformPerspective: 1200,
                x: 0, 
                y: 0, 
                rotationY: 0, 
                rotationX: 0,
                duration: 0.8, 
                ease: 'elastic.out(1, 0.3)' 
            });
        });
    });

    // --- 8. Mobile Gyroscope 3D Tilt (DISABLED FOR PERFORMANCE) ---
    // Disabled window.addEventListener('deviceorientation') to prevent 60Hz GSAP tween spam 
    // and eliminate style recalculation storm against mobile CSS !important rules.
    if (window.DeviceOrientationEvent && ('ontouchstart' in window)) {
        // Gyroscope tilt disabled to ensure smooth mobile scrolling without jank or freezing.
    }

    // --- 9. Deployment Version Checking ---
    let currentVersion = null;
    let versionCheckInterval = null;

    async function checkDeploymentVersion() {
        try {
            const response = await fetch('/api/version', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                if (!currentVersion) {
                    currentVersion = data.version;
                } else if (currentVersion !== data.version) {
                    console.log(`New deployment detected: ${currentVersion} -> ${data.version}. Reloading...`);
                    // Trigger service worker update if exists
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistration().then(reg => {
                            if (reg && reg.waiting) {
                                reg.waiting.postMessage('SKIP_WAITING');
                            }
                            console.log('Update available. Reload manually.');
                            // window.location.reload(true);
                        });
                    } else {
                        console.log('Update available. Reload manually.');
                        // window.location.reload(true);
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to check deployment version', e);
        }
    }

    // Initial check and interval
    checkDeploymentVersion();
    versionCheckInterval = setInterval(checkDeploymentVersion, 5 * 60 * 1000); // Check every 5 minutes

    // Check immediately when user returns to the tab
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkDeploymentVersion();
        }
    });

    // Handle Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Use ?v=killswitch to forcefully bypass aggressive 24-hour browser cache on mobile devices like Motorola
            navigator.serviceWorker.register('/service-worker.js?v=killswitch', { updateViaCache: 'none' }).then(reg => {
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // A new service worker is available, force version check
                            checkDeploymentVersion();
                        }
                    });
                });
            });
        });
        
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('Service worker updated. Reload prevented to stop infinite loops.');
                // window.location.reload(true);
            }
        });
    }

    // --- 10. Premium Splash Screen Logic ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Ensure minimum 300ms of splash screen for premium feel, but set a maximum safety timeout (800ms) so it never hangs due to ad-blockers or slow external assets
        const minTime = new Promise(resolve => setTimeout(resolve, 300));
        const winLoad = new Promise(resolve => {
            if (document.readyState === 'complete') resolve();
            else {
                window.addEventListener('load', resolve);
                // Fallback safety timeout in case external third-party scripts (GTM, Analytics, Unsplash) hang or get blocked
                setTimeout(resolve, 800);
            }
        });
        
        Promise.all([minTime, winLoad]).then(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.remove();
                // Optionally decode the main hero text after splash screen vanishes
                const heroTitle = document.querySelector('.auth-hero h1');
                if(heroTitle && typeof decodeText === 'function') decodeText(heroTitle);
            }, 800); // matches CSS transition duration
        });
    }
});


// Footer scroll space guard to prevent empty space below footer
window.addEventListener('load', () => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const cleanup = () => {
        const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
        document.querySelectorAll('body *').forEach(el => {
            if (footer.contains(el) || el === footer || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.id === 'page-main' || el.closest('.page') || el.closest('.toast') || el.closest('.mod') || el.closest('.ov') || el.closest('.wa-redirect-ov')) return;
            
            const style = getComputedStyle(el);
            if (style.display !== 'none' && style.position !== 'fixed') {
                const rect = el.getBoundingClientRect();
                const elBottom = rect.bottom + window.scrollY;
                
                // If it's rendering below the footer, hide it to prevent scroll stretch
                if (elBottom > footerBottom + 50) {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                }
            }
        });
    };

    // Run aggressively for 3 seconds after load to catch any lazy-loaded injected elements without visual delay
    let frames = 0;
    const runAggressive = () => {
        cleanup();
        frames++;
        if (frames < 180) requestAnimationFrame(runAggressive);
    };
    runAggressive();
    
    window.addEventListener('resize', cleanup);
});

// --- 11. High-Performance Instant Smooth Scroll Engine (Lenis Physics) ---
(function initSmoothScrolling() {
    class InstantLenisEngine {
        constructor() {
            this.targetY = window.scrollY || window.pageYOffset || 0;
            this.currentY = this.targetY;
            this.isMoving = false;
            this.rafId = null;
            this.friction = 0.1; // 60fps/120fps silky momentum factor

            this.init();
        }

        init() {
            // Guarantee native CSS smooth scroll does not fight wheel momentum
            document.documentElement.style.scrollBehavior = 'auto';
            if (document.body) document.body.style.scrollBehavior = 'auto';

            // Intercept mouse wheel & trackpad delta for silky momentum on laptop/desktop
            window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

            // Maintain alignment if user drags physical scrollbar or uses keyboard navigation
            window.addEventListener('scroll', () => {
                if (!this.isMoving) {
                    this.currentY = window.scrollY || window.pageYOffset || 0;
                    this.targetY = this.currentY;
                }
            }, { passive: true });

            // Expose globally for GSAP or anchor links
            window.lenis = this;
            window.lenisInstance = this;

            // Automatically protect modals and scroll boxes from scroll hijacking
            const markModalsPreventLenis = () => {
                const elements = document.querySelectorAll('.prob-modal-backdrop, .wa-redirect-ov, .modal, .modal-content, .drawer, [role="dialog"], .terms-box');
                elements.forEach(el => {
                    if (!el.hasAttribute('data-lenis-prevent')) {
                        el.setAttribute('data-lenis-prevent', '');
                    }
                });
            };
            markModalsPreventLenis();
            if (window.MutationObserver) {
                const observer = new MutationObserver(markModalsPreventLenis);
                observer.observe(document.body, { childList: true, subtree: true });
            }

            // High-performance smooth scrolling for anchor links (e.g. #hero, #pricing)
            document.addEventListener('click', (e) => {
                const anchor = e.target.closest('a[href^="#"]');
                if (!anchor) return;
                const href = anchor.getAttribute('href');
                if (href && href.length > 1 && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.scrollTo(target, { offset: -60 });
                    }
                }
            });
        }

        onWheel(e) {
            // Allow native scrolling inside open modals, dropdowns, and terms boxes
            let el = e.target;
            while (el && el !== document.body && el !== document.documentElement) {
                if (el.hasAttribute && (el.hasAttribute('data-lenis-prevent') || el.classList.contains('lenis-prevent') || el.classList.contains('prob-modal-backdrop') || el.classList.contains('wa-redirect-ov'))) {
                    return; // Allow natural container scroll
                }
                el = el.parentNode;
            }

            e.preventDefault();

            let delta = e.deltaY;
            if (e.deltaMode === 1) delta *= 32;
            if (e.deltaMode === 2) delta *= window.innerHeight;

            const maxScroll = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            ) - window.innerHeight;

            // Smooth momentum target calculation
            this.targetY = Math.max(0, Math.min(maxScroll, this.targetY + delta * 0.9));

            if (!this.isMoving) {
                this.isMoving = true;
                this.tick();
            }
        }

        tick() {
            const diff = this.targetY - this.currentY;

            if (Math.abs(diff) > 0.3) {
                this.currentY += diff * this.friction;
                window.scrollTo(0, this.currentY);

                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.update();
                }

                this.rafId = requestAnimationFrame(() => this.tick());
            } else {
                this.currentY = this.targetY;
                window.scrollTo(0, this.currentY);
                this.isMoving = false;
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.update();
                }
            }
        }

        scrollTo(target, options = {}) {
            let y = 0;
            if (typeof target === 'number') {
                y = target;
            } else if (target && target.getBoundingClientRect) {
                const offset = options.offset || 0;
                y = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) + offset;
            }
            const maxScroll = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            ) - window.innerHeight;
            this.targetY = Math.max(0, Math.min(maxScroll, y));

            if (!this.isMoving) {
                this.isMoving = true;
                this.tick();
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new InstantLenisEngine());
    } else {
        new InstantLenisEngine();
    }
})();
