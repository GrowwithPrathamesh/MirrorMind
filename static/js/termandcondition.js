// Page Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initTermsPage();
        }, 600);
    }, 1500);
});

// Initialize Terms Page
function initTermsPage() {
    initBrandHeader();
    initScrollAnimations();
    initAcceptanceSection();
    initScrollTopButton();
}

// Brand Header Interactions
function initBrandHeader() {
    const brandLogo = document.querySelector('.brand-logo');
    
    brandLogo.addEventListener('mouseenter', () => {
        const logoIcon = brandLogo.querySelector('.logo-icon');
        logoIcon.style.transform = 'scale(1.15)';
        logoIcon.style.filter = 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.5))';
    });
    
    brandLogo.addEventListener('mouseleave', () => {
        const logoIcon = brandLogo.querySelector('.logo-icon');
        logoIcon.style.transform = 'scale(1)';
        logoIcon.style.filter = 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.3))';
    });
}

// Brand Logo Click Handler
function initBrandLogoClick() {
    const brandLogo = document.querySelector('.brand-logo');
    
    brandLogo.addEventListener('click', () => {
        // Add click animation
        brandLogo.style.transform = 'scale(0.95)';
        setTimeout(() => {
            brandLogo.style.transform = 'translateY(-8px)';
        }, 150);
        
        // Navigate to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.terms-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add focus effect to current section
                sections.forEach(section => {
                    section.classList.remove('focused');
                });
                entry.target.classList.add('focused');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect for hero gradient
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroGradient = document.querySelector('.hero-bg-gradient');
        const brandHeader = document.querySelector('.brand-header');
        
        if (heroGradient) {
            heroGradient.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        if (brandHeader) {
            const opacity = Math.max(0.8, 1 - (scrolled * 0.001));
            brandHeader.style.opacity = opacity;
        }
    });
}

// Acceptance Section
function initAcceptanceSection() {
    const termsCheckbox = document.getElementById('termsCheckbox');
    const privacyCheckbox = document.getElementById('privacyCheckbox');
    const acceptButton = document.getElementById('acceptButton');
    
    function updateButtonState() {
        if (termsCheckbox.checked && privacyCheckbox.checked) {
            acceptButton.disabled = false;
            acceptButton.style.opacity = '1';
        } else {
            acceptButton.disabled = true;
            acceptButton.style.opacity = '0.7';
        }
    }
    
    termsCheckbox.addEventListener('change', updateButtonState);
    privacyCheckbox.addEventListener('change', updateButtonState);
    
    // Handle accept button click
    acceptButton.addEventListener('click', () => {
        if (!acceptButton.disabled && !acceptButton.classList.contains('loading')) {
            acceptButton.classList.add('loading');
            
            // Add ripple effect
            createRippleEffect(acceptButton);
            
            // Simulate API call
            setTimeout(() => {
                acceptButton.classList.remove('loading');
                
                // Show success message
                const originalText = acceptButton.querySelector('.button-text');
                originalText.textContent = 'Terms Accepted!';
                acceptButton.style.background = 'linear-gradient(135deg, #48BB78, #38A169)';
                acceptButton.disabled = true;
                acceptButton.style.boxShadow = '0 4px 20px rgba(72, 187, 120, 0.3)';
                
                // Scroll to top with smooth animation
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Show confirmation message
                setTimeout(() => {
                    showConfirmationMessage();
                }, 1000);
            }, 2000);
        }
    });
    
    // Create ripple effect on button click
    function createRippleEffect(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = 0;
        const y = 0;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function showConfirmationMessage() {
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-message';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <h3>Terms Accepted Successfully</h3>
            <p>Thank you for agreeing to our Terms & Conditions. You may now proceed to use MirrorMind.</p>
            <button class="confirmation-close">Continue</button>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-message {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .confirmation-content {
            background: #F5F7FA;
            padding: 2.5rem;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .confirmation-content i {
            font-size: 3rem;
            color: #48BB78;
            margin-bottom: 1rem;
        }
        
        .confirmation-content h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #1F2937;
        }
        
        .confirmation-content p {
            color: #6B7280;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .confirmation-close {
            background: linear-gradient(135deg, #1CA7EC, #06B6D4);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .confirmation-close:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(28, 167, 236, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    
    // Close confirmation
    const closeBtn = confirmation.querySelector('.confirmation-close');
    closeBtn.addEventListener('click', () => {
        confirmation.style.opacity = '0';
        confirmation.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(confirmation);
            document.head.removeChild(style);
            
            // Redirect to home page after closing
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        }, 300);
    });
}

// Scroll to Top Button
function initScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add current year to copyright
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
});

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.readyState === 'complete') {
            initTermsPage();
        }
    });
} else {
    initTermsPage();
}