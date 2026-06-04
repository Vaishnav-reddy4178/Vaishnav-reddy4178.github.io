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

// GSAP ScrollTrigger Scroll Reveal Animations
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
    // Scroll reveals for section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 35,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Scroll reveals for cards and timeline elements
    gsap.utils.toArray('.project-card, .skill-category, .timeline-item').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 45,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Skills Filtering Logic with GSAP Animations
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');

    if (filterButtons.length > 0 && skillCategories.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state class on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Animate elements out, change state, animate in
                gsap.to(skillCategories, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.25,
                    onComplete: () => {
                        skillCategories.forEach(card => {
                            const category = card.getAttribute('data-category');
                            if (filterValue === 'all' || category === filterValue) {
                                card.style.display = 'block';
                                gsap.to(card, {
                                    opacity: 1,
                                    scale: 1,
                                    duration: 0.35,
                                    ease: "power2.out"
                                });
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        // Refresh ScrollTrigger to update layouts
                        ScrollTrigger.refresh();
                    }
                });
            });
        });
    }

    // Fetch GitHub Repo Stats dynamically
    const repoStatsContainers = document.querySelectorAll('.repo-stats');
    if (repoStatsContainers.length > 0) {
        repoStatsContainers.forEach(container => {
            const repoName = container.getAttribute('data-repo');
            if (repoName) {
                fetch(`https://api.github.com/repos/Vaishnav-reddy4178/${repoName}`)
                    .then(response => {
                        if (!response.ok) throw new Error('API request failed');
                        return response.json();
                    })
                    .then(data => {
                        const starsEl = container.querySelector('.stars-count');
                        const forksEl = container.querySelector('.forks-count');
                        if (starsEl) starsEl.textContent = data.stargazers_count;
                        if (forksEl) forksEl.textContent = data.forks_count;
                    })
                    .catch(error => {
                        console.warn(`Fallback: Stats lookup failed for ${repoName}`);
                        const starsEl = container.querySelector('.stars-count');
                        const forksEl = container.querySelector('.forks-count');
                        if (starsEl) starsEl.textContent = '0';
                        if (forksEl) forksEl.textContent = '0';
                    });
            }
        });
    }

    // Contact Modal Open/Close Logic with GSAP animations
    const contactModal = document.querySelector('#contact-modal');
    const modalContent = document.querySelector('.contact-modal-content');
    const openModalButtons = document.querySelectorAll('.trigger-contact-modal');
    const closeModalButtons = document.querySelectorAll('.modal-close-btn, .contact-modal-overlay');

    if (contactModal && modalContent) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            contactModal.classList.add('active');
            
            // Pop in the content container using GSAP
            gsap.to(modalContent, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        };

        const closeModal = () => {
            gsap.to(modalContent, {
                opacity: 0,
                scale: 0.85,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    contactModal.classList.remove('active');
                }
            });
        };

        openModalButtons.forEach(btn => btn.addEventListener('click', openModal));
        closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Clipboard Quick-Copy Logic with Tooltip Feedback
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    if (copyEmailButtons.length > 0) {
        copyEmailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const emailAddress = btn.getAttribute('data-email');
                if (emailAddress) {
                    navigator.clipboard.writeText(emailAddress)
                        .then(() => {
                            btn.classList.add('copied');
                            setTimeout(() => btn.classList.remove('copied'), 2000);
                        })
                        .catch(err => console.error('Failed to copy text:', err));
                }
            });
        });
    }
});
// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Initialize theme based on localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  rootElement.classList.add('light-theme');
  if (themeToggleBtn) themeToggleBtn.querySelector('i').className = 'fas fa-moon';
} else {
  // Default dark theme
  rootElement.classList.remove('light-theme');
  if (themeToggleBtn) themeToggleBtn.querySelector('i').className = 'fas fa-sun';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isLight = rootElement.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    // Update icon
    themeToggleBtn.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  });
}
/* Scroll Progress Bar */
window.addEventListener('scroll', () => {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = `${scrolled}%`;
});

/* 3D Hover Tilt Effect for Project Cards */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  const content = card.querySelector('.project-content');
  if (!content) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 20; // max 10deg each side
    const rotateX = ((y / rect.height) - 0.5) * -20;
    content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    content.style.transform = 'rotateX(0) rotateY(0)';
  });
});

/* Typing Animation for Hero Subtitle */
(function() {
  const subtitleEl = document.querySelector('.hero-subtitle');
  if (!subtitleEl) return;
  const texts = ['Data Science Enthusiast', 'Software Engineer', 'AI/ML Developer', 'Problem Solver'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  subtitleEl.textContent = '';
  subtitleEl.appendChild(cursor);

  function type() {
    const current = texts[textIndex];
    if (!isDeleting) {
      subtitleEl.textContent = current.substring(0, charIndex + 1);
      subtitleEl.appendChild(cursor);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      subtitleEl.textContent = current.substring(0, charIndex - 1);
      subtitleEl.appendChild(cursor);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }
  setTimeout(type, 1200);
})();

/* Active Nav Link Highlight on Scroll */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
    });
  });
})();
