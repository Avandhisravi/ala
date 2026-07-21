/* ═══════════════════════════════════════════════════════════
   ALA EYEWEAR — CINEMATIC HERO SCROLL  
   GSAP 3.12 · ScrollTrigger · Lenis Smooth Scroll
═══════════════════════════════════════════════════════════ */
"use strict";

/* ─────────────────────────────────────────────────────────
   1. SMOOTH SCROLL (Lenis)
───────────────────────────────────────────────────────── */
const lenis = new Lenis({
    lerp: 0.05,
    wheelMultiplier: 1.2,
    smoothWheel: true,
    smoothTouch: false,
});

gsap.registerPlugin(ScrollTrigger);
// Sync Lenis with GSAP ticker
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);



gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   PREMIUM APPLE-STYLE VIDEO SCRUBBING
   Uses requestAnimationFrame for ultimate smoothness
═══════════════════════════════════════════════════════════ */
const heroVideo = document.getElementById("hero-video");
const heroText = document.getElementById("hero-text-container");
const scrollIndicator = document.querySelector(".scroll-indicator");

if (heroVideo) {
    // We use a proxy object to tween the video progress 
    // and sync it via requestAnimationFrame.
    let videoProxy = { currentTime: 0 };
    let isVideoLoaded = false;

    // The rAF loop to ensure ultra-smooth frame updates independent of scroll events
    function updateVideoFrame() {
        if (isVideoLoaded && heroVideo.readyState >= 2) {
            // Since GSAP scrub already interpolates the proxy value, we just apply it directly:
            if (Math.abs(heroVideo.currentTime - videoProxy.currentTime) > 0.001) {
                heroVideo.currentTime = videoProxy.currentTime;
            }
        }
        requestAnimationFrame(updateVideoFrame);
    }
    requestAnimationFrame(updateVideoFrame);

    heroVideo.addEventListener("loadedmetadata", () => {
        isVideoLoaded = true;
        const duration = heroVideo.duration || 1; // Fallback to 1s if duration is NaN

        // Create the cinematic hero timeline
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-sequence",
                start: "top top",
                end: "+=300%", // 300% of viewport height gives a nice scroll duration
                scrub: true,    // Sync instantly with Lenis smooth scroll
                pin: true,     // Pin the section while scrolling
                anticipatePin: 1
            }
        });

        // 1. Scrub the video by tweening the proxy object
        tl.to(videoProxy, {
            currentTime: duration,
            ease: "none",
            duration: 1
        }, 0);

        // 2. Subtle parallax/scale on the video itself
        tl.fromTo(heroVideo,
            { scale: 1 },
            { scale: 1.15, ease: "none", duration: 1 },
            0
        );

        // 3. Cinematic Text Fade & Scale (Animates OUT as user starts scrolling)
        if (heroText) {
            tl.to(heroText, {
                y: -80,
                scale: 0.95,
                opacity: 0,
                ease: "power2.inOut",
                duration: 0.2 // Finishes in the first 20% of scroll
            }, 0);
        }

        // 4. Fade out the scroll indicator quickly
        if (scrollIndicator) {
            tl.to(scrollIndicator, {
                opacity: 0,
                ease: "power2.inOut",
                duration: 0.05
            }, 0);
        }
    });

    // Handle case where video is already loaded before event listener attaches
    if (heroVideo.readyState >= 1) {
        heroVideo.dispatchEvent(new Event("loadedmetadata"));
    }

    // Initial cinematic reveal of the text
    if (heroText) {
        gsap.fromTo(heroText,
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 2, ease: "power3.out", delay: 0.2 }
        );
    }
    if (scrollIndicator) {
        gsap.fromTo(scrollIndicator,
            { opacity: 0 },
            { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 1.5 }
        );
    }
}
/* ─────────────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────────────── */
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");

if (cursor && cursorFollower) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

    let xSetterCursor = gsap.quickSetter(cursor, "x", "px");
    let ySetterCursor = gsap.quickSetter(cursor, "y", "px");

    let xToFollower = gsap.quickTo(cursorFollower, "x", { duration: 0.6, ease: "power3" });
    let yToFollower = gsap.quickTo(cursorFollower, "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        xSetterCursor(e.clientX);
        ySetterCursor(e.clientY);

        xToFollower(e.clientX);
        yToFollower(e.clientY);
    });

    // Add hover effect for interactive elements
    const interactives = document.querySelectorAll("a, button, input, select, textarea");
    interactives.forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1.5, borderColor: "transparent", backgroundColor: "rgba(184, 146, 74, 0.1)", duration: 0.3 });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1, borderColor: "var(--gold)", backgroundColor: "transparent", duration: 0.3 });
        });
    });
}

/* ─────────────────────────────────────────────────────────
   3. NAVBAR — glass effect on scroll
───────────────────────────────────────────────────────── */
ScrollTrigger.create({
    trigger: ".main-content",
    start: "top 80px", // Trigger when main content gets close to the top
    onEnter: () => document.getElementById("navbar").classList.add("scrolled"),
    onLeaveBack: () => document.getElementById("navbar").classList.remove("scrolled"),
});



/* ─────────────────────────────────────────────────────────
   5. CONTENT SECTIONS — Scroll Reveal
───────────────────────────────────────────────────────── */
gsap.utils.toArray(".luxury-stagger-group").forEach(group => {

    const items = group.querySelectorAll(
        ".section-title, .editorial-sub, .eyebrow, .gold-accent-line, h2, h4, p"
    );

    gsap.fromTo(items, 
        { opacity: 0, y: 35 },
        {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: group,
                start: "top 82%",
                once: true
            }
        }
    );

});
// Fade + rise for text elements


// Image reveal — scale from 1.08 to 1
gsap.utils.toArray(".reveal-mask").forEach(mask => {
    const img = mask.querySelector("img");
    if (!img) return;
    gsap.fromTo(img,
        { scale: 1.1 },
        {
            scale: 1,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: mask, start: "top 85%", once: true }
        }
    );
});

// Parallax drift on section images
gsap.utils.toArray(".parallax-img").forEach(img => {
    gsap.to(img, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
            trigger: img.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });
});

// Stagger the 3 bespoke detail cards


// Stagger material items

/* ─────────────────────────────────────────────────────────
   6. LUXURY PRODUCT SECTION (Custom Animations)
───────────────────────────────────────────────────────── */
gsap.utils.toArray(".product-luxury-section, .craft").forEach(section => {
    // 1. Staggered text reveal per group


    // 2. Gold line draw
    const goldLine = section.querySelector(".gold-accent-line");
    if (goldLine) {
        gsap.fromTo(goldLine,
            { width: "0px" },
            {
                width: "60px",
                duration: 1.2,
                delay: 0.4,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    once: true
                }
            }
        );
    }

    // 3. Product image fade and scale
    const imgContainer = section.querySelector(".product-image-container");
    if (imgContainer) {
        gsap.fromTo(imgContainer,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    once: true
                }
            }
        );
    }

    // 4. Slower parallax for luxury product image
    const slowParallaxImg = section.querySelector(".parallax-img-slow");
    if (slowParallaxImg) {
        gsap.to(slowParallaxImg, {
            yPercent: -4, // Slower than the default -6
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    }
});

/* ─────────────────────────────────────────────────────────
   7. LUXURY CONFIGURATOR (ACCORDION & AUTO-ADVANCE)
───────────────────────────────────────────────────────── */
const accordions = document.querySelectorAll('.config-accordion-item');

if (accordions.length > 0) {
    // Open the first accordion by default
    accordions[0].classList.add('active');
    const firstContent = accordions[0].querySelector('.config-accordion-content');
    if (firstContent) {
        firstContent.style.maxHeight = firstContent.scrollHeight + "px";
    }

    accordions.forEach((acc, index) => {
        const header = acc.querySelector('.config-accordion-header');
        const content = acc.querySelector('.config-accordion-content');

        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');

            // Close all
            accordions.forEach(otherAcc => {
                otherAcc.classList.remove('active');
                const otherContent = otherAcc.querySelector('.config-accordion-content');
                if (otherContent) otherContent.style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
                acc.classList.add('active');
                if (content) content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        // Auto-advance on radio selection
        const radios = acc.querySelectorAll('.config-radio');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Wait a brief moment to show the selection color change, then advance
                setTimeout(() => {
                    acc.classList.remove('active');
                    if (content) content.style.maxHeight = null;

                    const nextAcc = accordions[index + 1];
                    if (nextAcc) {
                        nextAcc.classList.add('active');
                        const nextContent = nextAcc.querySelector('.config-accordion-content');
                        if (nextContent) nextContent.style.maxHeight = nextContent.scrollHeight + "px";

                        // Scroll slightly to bring next into view if needed
                        const offset = nextAcc.getBoundingClientRect().top + window.scrollY - 150;
                        if (typeof lenis !== 'undefined') {
                            lenis.scrollTo(offset, { duration: 1 });
                        } else {
                            window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                    }
                }, 400); // 400ms delay for smooth transition
            });
        });
    });
}
