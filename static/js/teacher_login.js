<<<<<<< HEAD
// Teacher Login JavaScript - Complete and Working
=======
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Login Initialized');
    
    // Initialize all components
    initParticlesBackground();
    initFormHandling();
    initPasswordToggle();
    initModalHandling();
    initLinkHandlers();
    initToastSystem();
    
    // Add particles to background
    addParticles();
});

function initParticlesBackground() {
    addParticles();
}

function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;
    
    particleLayer.innerHTML = '';
    
<<<<<<< HEAD
    const particleCount = 15;
    const colors = ['#4a90e2', '#6bb1f7', '#5ac8c8', '#2196F3'];
=======
    const particleCount = 20;
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--i', Math.random());
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particleLayer.appendChild(particle);
    }
}

<<<<<<< HEAD
// Form submission handling - CORRECT BACKEND INTEGRATION
=======
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
function initFormHandling() {
    const loginForm = document.getElementById('teacherLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm || !loginBtn) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
<<<<<<< HEAD
        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
=======
        // Validate inputs
        if (!validateEmailField(email)) {
            showToast('Please enter a valid institutional email', 'error');
            shakeElement(loginForm);
            return;
        }
        
        if (!validatePasswordField(password)) {
            showToast('Password must be at least 6 characters', 'error');
            shakeElement(loginForm);
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
            return;
        }
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
<<<<<<< HEAD
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
                
=======
        // Simulate API call
        setTimeout(() => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Simulate login (demo purposes)
            if (email === 'teacher@institute.edu' && password === 'password123') {
                handleLoginSuccess();
                
                // Store login state if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('teacher_remembered', 'true');
                    localStorage.setItem('teacher_email', email);
                }
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
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
<<<<<<< HEAD
=======
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailField(this.value);
        });
        
        emailInput.addEventListener('input', function() {
            clearInputError(this);
            hideValidationError('email_error');
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePasswordField(this.value);
        });
        
        passwordInput.addEventListener('input', function() {
            clearInputError(this);
            hideValidationError('password_error');
        });
    }
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
}

function validateEmailField(email) {
    if (!email) {
        showValidationError('email_error', 'Email is required');
        return false;
    }
    
    if (!validateEmail(email)) {
        showValidationError('email_error', 'Please enter a valid email');
        return false;
    }
    
    hideValidationError('email_error');
    return true;
}

function validatePasswordField(password) {
    if (!password) {
        showValidationError('password_error', 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showValidationError('password_error', 'Password must be at least 6 characters');
        return false;
    }
    
    hideValidationError('password_error');
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

<<<<<<< HEAD
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
=======
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function() {
<<<<<<< HEAD
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
=======
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
        const icon = this.querySelector('i');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        this.style.transform = 'translateY(-50%) scale(1.3)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    });
}

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
        continueBtn.addEventListener('click', function() {
            redirectToDashboard();
        });
    }
    
    // Try again button
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            hideModal('errorModal');
        });
    }
}

let autoRedirectTimer = null;
let autoRedirectCountdown = 5;

function handleLoginSuccess() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Start auto redirect timer
        startAutoRedirect();
    }
    
    showToast('Login successful! Welcome to MirrorMind Teacher Portal.', 'success');
}

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

function redirectToDashboard() {
    console.log('Redirecting to teacher dashboard...');
    showToast('Dashboard loading...', 'success');
    
    // Simulate redirect
    setTimeout(() => {
        hideModal('successModal');
        // In production: window.location.href = '/teacher/dashboard/';
    }, 500);
}

function handleLoginError(message) {
    showToast(message || 'Login failed. Please try again.', 'error');
    shakeElement(document.getElementById('teacherLoginForm'));
    showErrorModal(message);
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (modal && errorMessage) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        errorMessage.textContent = message;
    }
}

function initLinkHandlers() {
    // Forgot password
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
<<<<<<< HEAD
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
=======
            showForgotPasswordModal();
        });
    }
    
    // Forgot password modal buttons
    const cancelReset = document.getElementById('cancelReset');
    if (cancelReset) {
        cancelReset.addEventListener('click', function() {
            hideModal('forgotPasswordModal');
        });
    }
    
    const sendResetLink = document.getElementById('sendResetLink');
    if (sendResetLink) {
        sendResetLink.addEventListener('click', function() {
            const resetEmail = document.getElementById('resetEmail').value;
            
            if (!validateEmail(resetEmail)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.disabled = true;
            
            setTimeout(() => {
                showToast('Password reset link sent to your email', 'success');
                hideModal('forgotPasswordModal');
                this.innerHTML = 'Send Reset Link';
                this.disabled = false;
            }, 2000);
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
        });
    }
}

<<<<<<< HEAD
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
=======
function showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

function initToastSystem() {
    // Toast system is initialized
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

function showValidationError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

function hideValidationError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.classList.remove('active');
    }
}

function highlightInputError(input) {
    input.style.borderColor = '#EF4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

<<<<<<< HEAD
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
=======
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

>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
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

<<<<<<< HEAD
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
=======
// Auto-fill remembered email on page load
window.addEventListener('load', function() {
    const remembered = localStorage.getItem('teacher_remembered');
    const savedEmail = localStorage.getItem('teacher_email');
    
    if (remembered === 'true' && savedEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (emailInput) emailInput.value = savedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
});
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const icon = this.querySelector('i');
        const isPassword = passwordInput.type === 'password';
        
        // Toggle password visibility
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Update icon
        if (isPassword) {
            icon.className = 'fas fa-eye-slash';
            icon.style.color = '#00C6FF';
        } else {
            icon.className = 'fas fa-eye';
            icon.style.color = '#6B7280';
        }
        
        // Animate button
        this.style.transform = 'translateY(-50%) scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
        
        // Focus back on input
        passwordInput.focus();
    });
    
    // Also handle click on the icon itself
    const eyeIcon = toggleBtn.querySelector('i');
    if (eyeIcon) {
        eyeIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBtn.click();
        });
    }
>>>>>>> 4cd2a47fb587c3289f2b733b6a2fec32aa4e24d9
}