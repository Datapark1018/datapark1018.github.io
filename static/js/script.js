// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip if href is just '#'
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;
let isAnimating = false;

// Function to initialize hero animations
function initializeHeroAnimations() {
    if (isAnimating) return;
    isAnimating = true;

    const line1 = document.querySelector('.line-1');
    const line2 = document.querySelector('.line-2');
    const h2 = document.querySelector('.hero-content h2');
    const highlight = document.querySelector('.hero-content h2 .highlight');
    
    // Reset classes and clear text content
    line1.classList.remove('typing-complete');
    line2.classList.remove('typing', 'typing-complete');
    h2.classList.remove('show');
    highlight.classList.remove('animate');
    
    // Clear text content
    line1.textContent = '';
    line2.textContent = '';
    
    const text1 = "DX를 넘어 AX로,";
    const text2 = "중요한 것은 문제 해결력입니다.";
    
    // Start first line
    typeText(line1, text1, () => {
        // Start second line after first line completes
        setTimeout(() => {
            line2.classList.add('typing');
            typeText(line2, text2, () => {
                // Show h2 after all typing is complete
                setTimeout(() => {
                    h2.classList.add('show');
                    // Add highlight animation after slide-up completes
                    setTimeout(() => {
                        highlight.classList.add('animate');
                        isAnimating = false;
                    }, 1000);
                }, 300);
            });
        }, 300);
    });
}

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when page is scrolled
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Check if scroll position returned to top
    if (currentScroll === 0 && lastScroll > 0) {
        initializeHeroAnimations();
    }
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Initialize animations on page load
window.addEventListener('load', initializeHeroAnimations);

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {  // form이 존재하는 경우에만 이벤트 리스너 추가
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formObject);
        
        // Show success message
        alert('메시지가 성공적으로 전송되었습니다!');
        this.reset();
    });
}

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .about-content, .contact-content');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Mobile navigation toggle
const createMobileNav = () => {
    const nav = document.querySelector('nav');
    const mobileNavButton = document.createElement('button');
    mobileNavButton.classList.add('mobile-nav-toggle');
    mobileNavButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    nav.appendChild(mobileNavButton);
    
    mobileNavButton.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
    });
};

// Initialize mobile navigation if screen width is small
if (window.innerWidth <= 768) {
    createMobileNav();
}

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = `
    .project-card, .about-content, .contact-content {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .project-card.animate, .about-content.animate, .contact-content.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .mobile-nav-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: white;
        cursor: pointer;
    }
    
    @media (max-width: 768px) {
        .mobile-nav-toggle {
            display: block;
        }
        
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #2c3e50;
            padding: 1rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .nav-links.show {
            display: flex;
            flex-direction: column;
        }
        
        .nav-links li {
            margin: 0.5rem 0;
        }
    }
`;

document.head.appendChild(style);

// Typing animation
function typeText(element, text, onComplete) {
    let index = 0;
    element.textContent = '';  // Clear existing text
    
    function type() {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);  // Use substring instead of concatenation
            index++;
            setTimeout(type, 100);
        } else {
            element.classList.add('typing-complete');
            if (onComplete) onComplete();
        }
    }
    
    type();
}

// Initialize typing animation
window.addEventListener('load', () => {
    const line1 = document.querySelector('.line-1');
    const line2 = document.querySelector('.line-2');
    const h2 = document.querySelector('.hero-content h2');
    const highlight = document.querySelector('.hero-content h2 .highlight');
    
    const text1 = "DX를 넘어 AX로,";
    const text2 = "중요한 것은 문제 해결력입니다.";
    
    // Start first line
    typeText(line1, text1, () => {
        // Start second line after first line completes
        setTimeout(() => {
            line2.classList.add('typing');
            typeText(line2, text2, () => {
                // Show h2 after all typing is complete
                setTimeout(() => {
                    h2.classList.add('show');
                    // Add highlight animation after slide-up completes
                    setTimeout(() => {
                        highlight.classList.add('animate');
                        isAnimating = false;
                    }, 1000);
                }, 300);
            });
        }, 300);
    });
}); 