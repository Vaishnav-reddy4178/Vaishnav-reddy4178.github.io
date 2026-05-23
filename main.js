// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Custom Interactive Cursor Trailing using GSAP
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorOutline = document.querySelector('.custom-cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        
        // Immediate movement for dot
        gsap.to(cursorDot, {
            x: clientX,
            y: clientY,
            duration: 0.05,
            ease: "power2.out"
        });
        
        // Smooth lagged movement for outline
        gsap.to(cursorOutline, {
            x: clientX,
            y: clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });

    // Dynamic Hover classes on interactive elements
    const hoverables = document.querySelectorAll('a, button, .btn, .project-card, .skill-tags span, .nav-links a');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hovered');
            cursorOutline.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hovered');
            cursorOutline.classList.remove('hovered');
        });
    });
}

// Staggered Entry Animation for Hero Section on load using GSAP
window.addEventListener('DOMContentLoaded', () => {
    // Set initial values
    gsap.set('.hero-content > *', { opacity: 0, y: 30 });
    gsap.set('nav', { opacity: 0, y: -25 });
    
    // Create Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.to('nav', {
        opacity: 1,
        y: 0,
        duration: 0.8
    })
    .to('.hero-content > *', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15
    }, '-=0.4');
});

// Intersection Observer for scroll animations (other sections)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.glass-card, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});
