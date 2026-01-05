// Teacher Login JavaScript - Complete and Working
document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Login Initialized');
    
    // Initialize all components
    initParticlesBackground();
    initFormHandling();
    initPasswordToggle();
    initModalHandling();
    initLinkHandlers();
    initInteractiveEffects();
    
    // Add particles to background
    addParticles();
});

// Initialize particles background
function initParticlesBackground() {
    addParticles();
}

// Add particles to the background
function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;
    
    // Clear existing particles
    particleLayer.innerHTML = '';
    
    const particleCount = 15;
    const colors = ['#4a90e2', '#6bb1f7', '#5ac8c8', '#2196F3'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--i', Math.random());
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.background = `linear-gradient(45deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`;
        particle.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
        particleLayer.appendChild(particle);
    }
}

// Form submission handling - CORRECT BACKEND INTEGRATION
function initFormHandling() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm || !loginBtn) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        showLoading();
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Create FormData for POST request (matches Django form submission)
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            
            // Send POST request to backend EXACT URL
            const response = await fetch('/teacher-login/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });
            
            // Parse JSON response
            const data = await response.json();
            
            // Hide loading
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Handle response based on backend contract
            if (response.ok && data.success === true) {
                // SUCCESS: Backend returned success:true
                showToast(data.message || 'Login successful!', 'success');
                handleLoginSuccess();
                
                // Redirect to dashboard after delay
                setTimeout(() => {
                    window.location.href = '/teacher-dashboard/';
                }, 2000);
                
            } else {
                // FAILURE: Backend returned success:false or error
                const errorMessage = data.error || 'Invalid email or password';
                handleLoginError(errorMessage);
            }
            
        } catch (error) {
            console.error('Login request failed:', error);
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            handleLoginError('Network error. Please check your connection.');
        }
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle successful login
function handleLoginSuccess() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        startAutoRedirect();
        triggerConfetti();
    }
}

// Start auto redirect timer
let autoRedirectTimer = null;
let autoRedirectCountdown = 5;

function startAutoRedirect() {
    autoRedirectCountdown = 5;
    const timerElement = document.getElementById('redirectTimer');
    
    if (autoRedirectTimer) clearInterval(autoRedirectTimer);
    
    autoRedirectTimer = setInterval(() => {
        autoRedirectCountdown--;
        if (timerElement) {
            timerElement.textContent = autoRedirectCountdown;
            timerElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                timerElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        if (autoRedirectCountdown <= 0) {
            clearInterval(autoRedirectTimer);
            redirectToDashboard();
        }
    }, 1000);
}

// Redirect to dashboard
function redirectToDashboard() {
    showToast('Dashboard loading...', 'success');
    window.location.href = '/teacher-dashboard/';
}

// Handle login error
function handleLoginError(message) {
    showToast(message || 'Login failed. Please try again.', 'error');
    shakeElement(document.getElementById('loginForm'));
    showErrorModal(message);
}

// Trigger confetti animation
function triggerConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Create new confetti
    const confettiCount = 5;
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${15 + i * 15}%`;
        confetti.style.animationDelay = `${i * 0.3}s`;
        confettiContainer.appendChild(confetti);
    }
}

// Password toggle functionality
function initPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
        
        this.style.transform = 'translateY(-50%) scale(1.3)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    });
}

// Modal handling
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
    
    // Close on outside click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                hideModal(modal.id);
            });
        }
    });
    
    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
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
    // Forgot password
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Redirecting to password reset...', 'info');
            window.location.href = '/teacher-reset-password/';
        });
    }
    
    // Sign Up link
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Redirecting to sign up page...', 'info');
            window.location.href = '/teacher-signup/';
        });
    }
    
    // Back to home
    const backHome = document.querySelector('.back-home');
    if (backHome) {
        backHome.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Returning to homepage...', 'info');
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
            this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .modal-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Shake element animation
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'} toast-icon"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">×</button>
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
        
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
    
    if (modalId === 'successModal') {
        if (autoRedirectTimer) {
            clearInterval(autoRedirectTimer);
        }
    }
}

// Add animations CSS dynamically
const animationsCSS = `
@keyframes toastSlideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject animations CSS
const style = document.createElement('style');
style.textContent = animationsCSS;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Teacher login page error:', e.error);
});

// Touch device support
let isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}