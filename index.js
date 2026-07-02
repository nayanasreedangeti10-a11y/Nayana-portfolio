// Javascript logic for Nayana Sree Portfolio

// ==========================================
// EMAILJS CONFIGURATION
// Replace these three values with your own from https://www.emailjs.com
// ==========================================
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';      // Account > API Keys
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';      // Email Services tab
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';     // Email Templates tab

document.addEventListener('DOMContentLoaded', () => {

    // Initialise EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    // ==========================================
    // CONTACT FORM — EmailJS submission
    // ==========================================
    const contactForm    = document.getElementById('contact-form');
    const submitBtn      = document.getElementById('form-submit-btn');
    const submitBtnText  = document.getElementById('form-btn-text');
    const formFeedback   = document.getElementById('form-feedback');

    function setFieldError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    }

    function clearErrors() {
        ['err-name', 'err-email', 'err-msg'].forEach(id => setFieldError(id, ''));
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';
    }

    function validateForm(name, email, message) {
        let valid = true;
        if (!name.trim()) {
            setFieldError('err-name', 'Please enter your name.');
            valid = false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError('err-email', 'Please enter a valid email address.');
            valid = false;
        }
        if (!message.trim() || message.trim().length < 10) {
            setFieldError('err-msg', 'Message must be at least 10 characters.');
            valid = false;
        }
        return valid;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const name    = document.getElementById('cf-name').value;
            const email   = document.getElementById('cf-email').value;
            const message = document.getElementById('cf-msg').value;

            if (!validateForm(name, email, message)) return;

            // Loading state
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending…';
            submitBtn.style.opacity = '0.7';

            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name: name,
                    reply_to:  email,
                    message:   message,
                    to_email:  'nayanasreed@gmail.com',
                });

                // Success
                formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();

                // Auto-reset button after 5s
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 5000);

            } catch (err) {
                console.error('EmailJS error:', err);
                formFeedback.textContent = '✗ Something went wrong. Please try Instagram DM instead.';
                formFeedback.className = 'form-feedback error';
            } finally {
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Send Message';
                submitBtn.style.opacity = '1';
            }
        });
    }

    
    // ==========================================
    // 1. PRELOADER LOGIC
    // ==========================================
    const preloader = document.getElementById('preloader');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        const increment = Math.random() * 15;
        progress = Math.min(progress + increment, 99);
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
    }, 100);
    
    window.addEventListener('load', () => {
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }, 600);
    });

    setTimeout(() => {
        clearInterval(progressInterval);
        if (preloader && !preloader.classList.contains('fade-out')) {
            progressFill.style.width = '100%';
            progressText.textContent = '100%';
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 400);
        }
    }, 5000);


    // ==========================================
    // 2. CUSTOM LAGGING CURSOR
    // ==========================================
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    const lerpSpeed = 0.15;
    
    window.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
    });
    
    function updateCursorRing() {
        ringX += (dotX - ringX) * lerpSpeed;
        ringY += (dotY - ringY) * lerpSpeed;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(updateCursorRing);
    }
    requestAnimationFrame(updateCursorRing);
    
    function initCursorHovers() {
        const hoverables = document.querySelectorAll('a, button, .project-card, .clip, .step-detail-card, .channel-btn');
        hoverables.forEach(el => {
            el.removeEventListener('mouseenter', onHoverEnter);
            el.removeEventListener('mouseleave', onHoverLeave);
            
            el.addEventListener('mouseenter', onHoverEnter);
            el.addEventListener('mouseleave', onHoverLeave);
        });
    }

    function onHoverEnter() {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorRing.style.borderColor = 'var(--neon-blue)';
        cursorRing.style.boxShadow = 'var(--glow-blue)';
        cursorDot.style.backgroundColor = 'var(--neon-pink)';
    }

    function onHoverLeave() {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'var(--neon-purple)';
        cursorRing.style.boxShadow = '0 0 8px rgba(180, 79, 255, 0.2)';
        cursorDot.style.backgroundColor = '#ffffff';
    }

    initCursorHovers();


    // ==========================================
    // 3. FIXED NAVBAR SCROLL BLUR & ACTIVE LINKS
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 4. MOBILE HAMBURGER MENU
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ==========================================
    // 5. INTRO VIDEO OVERLAY
    // ==========================================
    const introVideo = document.getElementById('intro-video');
    const videoOverlay = document.getElementById('video-overlay');
    const videoPlayBtn = document.getElementById('video-play-btn');
    
    function playIntroVideo() {
        introVideo.play();
        videoOverlay.classList.add('hidden');
    }
    
    videoPlayBtn.addEventListener('click', playIntroVideo);
    videoOverlay.addEventListener('click', playIntroVideo);
    
    introVideo.addEventListener('play', () => {
        videoOverlay.classList.add('hidden');
    });
    
    introVideo.addEventListener('pause', () => {
        videoOverlay.classList.remove('hidden');
    });


    // ==========================================
    // 6. PROJECTS GRID HOVER PREVIEWS
    // ==========================================
    const projectCards = document.querySelectorAll('.project-card');
    const allCards = Array.from(projectCards); // playlist for lightbox loop
    
    projectCards.forEach(card => {
        const previewVideo = card.querySelector('.card-video-preview');
        
        card.addEventListener('mouseenter', () => {
            if (previewVideo) {
                previewVideo.play().catch(err => {
                    console.log("Hover preview blocked:", err);
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (previewVideo) {
                previewVideo.pause();
                previewVideo.currentTime = 0;
            }
        });
    });


    // ==========================================
    // 7. LIGHTBOX MODAL WITH PLAYLIST NAVIGATION
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentProjectIndex = 0;
    
    function showProjectAtIndex(index) {
        if (allCards.length === 0) return;
        
        if (index < 0) {
            currentProjectIndex = allCards.length - 1;
        } else if (index >= allCards.length) {
            currentProjectIndex = 0;
        } else {
            currentProjectIndex = index;
        }
        
        const card = allCards[currentProjectIndex];
        const videoUrl = card.getAttribute('data-video');
        const title = card.querySelector('.project-title').textContent;
        
        lightboxVideo.src = videoUrl;
        lightboxTitle.textContent = title;
        
        lightboxVideo.play().catch(err => {
            console.log("Playback failed:", err);
        });
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = allCards.indexOf(card);
            lightboxModal.classList.add('active');
            showProjectAtIndex(index !== -1 ? index : 0);
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });
    
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        document.body.style.overflow = 'auto';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectAtIndex(currentProjectIndex - 1);
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectAtIndex(currentProjectIndex + 1);
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    window.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showProjectAtIndex(currentProjectIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showProjectAtIndex(currentProjectIndex + 1);
        }
    });


    // ==========================================
    // 8. INTERACTIVE TIMELINE WORKFLOW HIGHLIGHTS
    // ==========================================
    const timelineClips = document.querySelectorAll('.clip-purple.clip-active');
    const stepDetailCards = document.querySelectorAll('.step-detail-card');
    
    timelineClips.forEach(clip => {
        const stepNum = clip.querySelector('.clip-step-num').textContent.trim();
        
        clip.addEventListener('mouseenter', () => {
            clip.classList.add('highlighted');
            stepDetailCards.forEach(card => {
                if (card.getAttribute('data-step') === stepNum) {
                    card.classList.add('active');
                    if (window.innerWidth <= 1024) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    card.classList.remove('active');
                }
            });
        });
        
        clip.addEventListener('mouseleave', () => {
            clip.classList.remove('highlighted');
            stepDetailCards.forEach(card => card.classList.remove('active'));
        });
    });

    stepDetailCards.forEach(card => {
        const stepNum = card.getAttribute('data-step');
        
        card.addEventListener('mouseenter', () => {
            card.classList.add('active');
            timelineClips.forEach(clip => {
                const clipNum = clip.querySelector('.clip-step-num').textContent.trim();
                if (clipNum === stepNum) {
                    clip.classList.add('highlighted');
                } else {
                    clip.classList.remove('highlighted');
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('active');
            timelineClips.forEach(clip => clip.classList.remove('highlighted'));
        });
    });


    // ==========================================
    // 9. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});
