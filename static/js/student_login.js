// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Login Initialized');
    
    // Initialize all components
    initParticlesBackground();
    initFormHandling();
    initPasswordToggle();
    initStatsAnimation();
    initModalHandling();
    initLinkHandlers();
    initInteractiveEffects();
    
    // Add particles to background
    addParticles();
});

// Form submission handling - UPDATED
function initFormHandling() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm || !loginBtn) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validate inputs
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            shakeElement(loginForm);
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            shakeElement(loginForm);
            return;
        }
        
        // Show loading state
        showLoading();
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        try {
<<<<<<< HEAD
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', getCSRFToken());
            formData.append('email', email);
            formData.append('password', password);
            
            const response = await fetch('/student-login/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
=======
            // Call real API
            const response = await fetch('/student_login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // CSRF token function needed
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
            });
            
            const data = await response.json();
            
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            if (data.success) {
<<<<<<< HEAD
                handleLoginSuccess();
            } else {
                handleLoginError(data.error || 'Invalid credentials. Please try again.');
            }
=======
                // Login successful
                handleLoginSuccess(data.redirect_url);
            } else {
                // Login failed
                handleLoginError(data.error || 'Login failed');
            }
            
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
<<<<<<< HEAD
            handleLoginError('Network error. Please try again.');
=======
            handleLoginError('Network error. Please check your connection.');
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
        }
    });
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                highlightInputError(this);
            } else {
                clearInputError(this);
            }
        });
        
        emailInput.addEventListener('input', function() {
            clearInputError(this);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 6) {
                highlightInputError(this);
            } else {
                clearInputError(this);
            }
        });
        
        passwordInput.addEventListener('input', function() {
            clearInputError(this);
        });
    }
}

<<<<<<< HEAD
// Get CSRF token from form
function getCSRFToken() {
    const csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfTokenInput ? csrfTokenInput.value : '';
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
=======
// CSRF token function - ADD THIS
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
}

// Handle successful login - UPDATED
function handleLoginSuccess(redirectUrl = '/student/dashboard/') {
    // Show success modal
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Start auto redirect timer
        startAutoRedirect(redirectUrl);
        
        // Trigger confetti animation
        triggerConfetti();
    }
    
    // Show success toast
    showToast('Login successful! Redirecting to dashboard...', 'success');
}

// Start auto redirect timer - UPDATED
let autoRedirectTimer = null;
let autoRedirectCountdown = 5;

function startAutoRedirect(redirectUrl) {
    autoRedirectCountdown = 5;
    const timerElement = document.getElementById('redirectTimer');
    
    if (autoRedirectTimer) clearInterval(autoRedirectTimer);
    
    autoRedirectTimer = setInterval(() => {
        autoRedirectCountdown--;
        if (timerElement) {
            timerElement.textContent = autoRedirectCountdown;
        }
        
        if (autoRedirectCountdown <= 0) {
            clearInterval(autoRedirectTimer);
            redirectToDashboard(redirectUrl);
        }
    }, 1000);
}

<<<<<<< HEAD
// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = '/student/dashboard/';
=======
// Redirect to dashboard - UPDATED
function redirectToDashboard(redirectUrl = '/student/dashboard/') {
    // Actual redirect
    window.location.href = redirectUrl;
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
}

// Handle login error - UPDATED
function handleLoginError(message) {
    showToast(message || 'Login failed. Please try again.', 'error');
    shakeElement(document.getElementById('loginForm'));
    showErrorModal(message);
}

// Rest of the code remains same, just update the continue button event listener:
function initModalHandling() {
    // Close modal functions
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Continue button - UPDATED
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
<<<<<<< HEAD
        continueBtn.addEventListener('click', redirectToDashboard);
    }
    
    // Close error button
    const closeErrorBtn = document.getElementById('closeError');
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', function() {
            hideModal('errorModal');
        });
    }
}

// Link handlers
function initLinkHandlers() {
    // Admin link
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/student-signup/';
        });
    }
    
    // Back to home
    const backHome = document.querySelector('.back-home');
    if (backHome) {
        backHome.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/';
        });
    }
}

// Interactive effects
function initInteractiveEffects() {
    // Input focus effects
    const inputs = document.querySelectorAll('.input-with-icon input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Add ripple effect on focus
        input.addEventListener('focus', function(e) {
            createRippleEffect(e, this.parentElement);
        });
    });
}

// Create ripple effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 198, 255, 0.2);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Shake element animation
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add shake animation to CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} toast-icon"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">×</button>
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

// Loading modal functions
function showLoading(message = 'Authenticating...') {
    const modal = document.getElementById('loadingModal');
    const loadingText = document.querySelector('.loading-text');
    
    if (modal && loadingText) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        loadingText.textContent = message;
    }
}

function hideLoading() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Error modal
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (modal && errorMessage) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        errorMessage.textContent = message;
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    // Clear auto redirect timer
    if (modalId === 'successModal') {
        if (autoRedirectTimer) {
            clearInterval(autoRedirectTimer);
        }
    }
}

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading delays for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Login page error:', e.error);
    // Fallback for any animation errors
    document.body.classList.add('animations-disabled');
});

// Touch device support
let isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
=======
        continueBtn.addEventListener('click', function() {
            redirectToDashboard('/student/dashboard/');
        });
    }
    
    // ... rest of the code
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
}