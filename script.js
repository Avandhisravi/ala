/* ═══════════════════════════════════════════════════════════
   ALA EYEWEAR — CINEMATIC HERO SCROLL  
   GSAP 3.12 · ScrollTrigger · Lenis Smooth Scroll
═══════════════════════════════════════════════════════════ */
"use strict";

/* ─────────────────────────────────────────────────────────
   1. SMOOTH SCROLL (Lenis)
───────────────────────────────────────────────────────── */
const lenis = new Lenis({
    duration: 2.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
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
                scrub: 1.5,    // Smoothly scrub the video over 1.5 seconds catching up
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
    
    let xToFollower = gsap.quickTo(cursorFollower, "x", {duration: 0.6, ease: "power3"});
    let yToFollower = gsap.quickTo(cursorFollower, "y", {duration: 0.6, ease: "power3"});

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

// Fade + rise for text elements
gsap.utils.toArray(".reveal-up").forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, y: 55 },
        {
            opacity: 1, y: 0,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
    );
});

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
            scrub: 2,
        }
    });
});

// Stagger the 3 bespoke detail cards
gsap.utils.toArray(".detail-card").forEach((card, i) => {
    gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0,
            duration: 1.1,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true }
        }
    );
});

// Stagger material items
gsap.utils.toArray(".material-item").forEach((item, i) => {
    gsap.fromTo(item,
        { opacity: 0, x: 30 },
        {
            opacity: 1, x: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true }
        }
    );
});

/* ─────────────────────────────────────────────────────────
   6. LUXURY PRODUCT SECTION (Custom Animations)
───────────────────────────────────────────────────────── */
gsap.utils.toArray(".product-luxury-section, .craft").forEach(section => {
    // 1. Staggered text reveal
    const staggerItems = section.querySelectorAll(".luxury-stagger-item");
    if (staggerItems.length > 0) {
        gsap.to(staggerItems, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                once: true
            }
        });
    }

    // 2. Gold line draw
    const goldLine = section.querySelector(".gold-accent-line");
    if (goldLine) {
        gsap.to(goldLine, {
            width: "60px",
            duration: 1.2,
            delay: 0.4,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                once: true
            }
        });
    }

    // 3. Product image fade and scale
    const imgContainer = section.querySelector(".product-image-container");
    if (imgContainer) {
        gsap.to(imgContainer, {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                once: true
            }
        });
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
                scrub: 2,
            }
        });
    }
});
