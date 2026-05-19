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

/* ─────────────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────────────── */
if (window.innerWidth > 900) {
    const dot  = document.getElementById("cursor");
    const ring = document.getElementById("cursor-follower");
    let mx = -200, my = -200;

    document.addEventListener("mousemove", e => {
        mx = e.clientX; my = e.clientY;
        gsap.set(dot, { x: mx, y: my });
    });

    // Ring follows with lag
    (function followRing() {
        gsap.to(ring, { x: mx, y: my, duration: 0.55, ease: "power3.out" });
        requestAnimationFrame(followRing);
    })();

    document.querySelectorAll("a, button, [class*='btn']").forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(dot,  { scale: 0.2, duration: 0.3 });
            gsap.to(ring, { scale: 2.5, opacity: 0.35, duration: 0.4 });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(dot,  { scale: 1, duration: 0.3 });
            gsap.to(ring, { scale: 1, opacity: 1,    duration: 0.4 });
        });
    });
}

/* ─────────────────────────────────────────────────────────
   3. NAVBAR — glass effect on scroll
───────────────────────────────────────────────────────── */
ScrollTrigger.create({
    start: 80,
    onEnter:      () => document.getElementById("navbar").classList.add("scrolled"),
    onLeaveBack:  () => document.getElementById("navbar").classList.remove("scrolled"),
});

/* ═══════════════════════════════════════════════════════════
   4. CINEMATIC HERO — Apple-Style Scroll Sequence
   
   Strategy:
   • hero-sequence is 400vh tall so there's a long scroll runway
   • hero-sticky is position:sticky so the viewport is "pinned"
   • We use THREE separate ScrollTrigger scrub animations,
     one per phase, each targeting a portion of the runway
   • A load-time entrance animation plays once on page load
═══════════════════════════════════════════════════════════ */
(function heroScroll() {
    const wrapper = document.getElementById("hero-3d-wrapper");
    const img     = document.getElementById("hero-eyewear-img");
    const overlay = document.getElementById("lighting-overlay");
    const shadow  = document.getElementById("hero-shadow");
    const t1      = document.getElementById("hero-text-1");
    const t2      = document.getElementById("hero-text-2");
    const t3      = document.getElementById("hero-text-3");
    const hint    = document.querySelector(".scroll-hint-hero");

    if (!wrapper) return;

    /* ── Initial hidden state ── */
    gsap.set(wrapper, { opacity: 0, scale: 1.6, rotateY: -30, rotateX: 15, rotateZ: 4 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(shadow,  { opacity: 0, scaleX: 0.5 });
    gsap.set([t1, t2, t3], { opacity: 0, y: 40 });

    /* ── ON LOAD: Entrance animation (plays immediately, not scroll-driven) ── */
    const entrance = gsap.timeline({ delay: 0.3 });
    entrance
        .to(wrapper, {
            opacity: 1, scale: 1, rotateY: -8, rotateX: 4, rotateZ: 1,
            duration: 2.2, ease: "power3.out"
        })
        .to(shadow, { opacity: 0.35, scaleX: 1, duration: 1.8, ease: "power2.out" }, 0.4)
        .to(overlay, { opacity: 0.25, duration: 2, ease: "power2.out" }, 0.6)
        .to(t1, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.9)
        .to(hint, { opacity: 1, duration: 1, ease: "power2.out" }, 1.2);

    /* ── PHASE 1: scroll 0% → 33% of runway
       Glasses rotate toward front-facing, text-1 fades out, text-2 arrives ── */
    const phase1 = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-sequence",
            start: "top top",
            end: "33% top",          // first third of 400vh = ~132vh of scroll
            scrub: 1.8,
        }
    });
    phase1
        .to(wrapper, { rotateY: 8, rotateX: -2, rotateZ: 0, scale: 1.12, ease: "none" }, 0)
        .to(overlay, {
            background: "radial-gradient(ellipse 55% 70% at 65% 35%, rgba(255,255,255,.32) 0%, transparent 70%)",
            opacity: 0.4, ease: "none"
        }, 0)
        .to(shadow,  { scaleX: 1.15, opacity: 0.28, ease: "none" }, 0)
        .to(t1, { opacity: 0, y: -30, duration: 0.3, ease: "none" }, 0)
        .to(hint, { opacity: 0, ease: "none" }, 0)
        .to(t2, { opacity: 1, y: 0, ease: "none" }, 0.5);

    /* ── PHASE 2: scroll 33% → 66% of runway
       Glasses tilt to side view, text-2 out, text-3 in, light sweeps ── */
    const phase2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-sequence",
            start: "33% top",
            end: "66% top",
            scrub: 1.8,
        }
    });
    phase2
        .to(wrapper, { rotateY: 22, rotateX: 3, rotateZ: -2, scale: 1.25, ease: "none" }, 0)
        .to(overlay, {
            background: "radial-gradient(ellipse 45% 55% at 80% 55%, rgba(255,245,220,.38) 0%, transparent 70%)",
            opacity: 0.5, ease: "none"
        }, 0)
        .to(shadow, { scaleX: 0.75, opacity: 0.2, x: "12%", ease: "none" }, 0)
        .to(t2, { opacity: 0, y: -30, ease: "none" }, 0)
        .to(t3, { opacity: 1, y: 0, ease: "none" }, 0.4);

    /* ── PHASE 3: scroll 66% → 100% of runway
       Glasses settle to calm front-facing final pose,
       text-3 fades, hero fades to reveal next section ── */
    const phase3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-sequence",
            start: "66% top",
            end: "bottom top",
            scrub: 1.8,
        }
    });
    phase3
        .to(wrapper, { rotateY: 0, rotateX: 0, rotateZ: 0, scale: 0.9, ease: "none" }, 0)
        .to(overlay, { opacity: 0, ease: "none" }, 0)
        .to(shadow,  { opacity: 0.12, scaleX: 1, x: "0%", ease: "none" }, 0)
        .to(t3, { opacity: 0, y: -30, ease: "none" }, 0)
        .to(".hero-sticky", { opacity: 0.5, ease: "none" }, 0.6);

})();

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
