<<<<<<< HEAD
// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Teacher Login Initialized');
    
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
=======
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Teacher Login Initialized');
    
    // Initialize all functionality
    initParticlesBackground();
    initFormValidation();
    initPasswordToggle();
    initModals();
    initToastSystem();
    initFaceRecognition();
    initFormSubmission();
    
    // Add particles to background
    addParticles();
    
    // Start with animations
    startLogoAnimation();
});

>>>>>>> 09973ed (jdk)
function initParticlesBackground() {
    addParticles();
}

<<<<<<< HEAD
// Add particles to the background
=======
>>>>>>> 09973ed (jdk)
function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;
    
<<<<<<< HEAD
    // Clear existing particles
    particleLayer.innerHTML = '';
    
    const particleCount = 15;
    const colors = ['#4a90e2', '#6bb1f7', '#5ac8c8', '#2196F3']; // Light blue colors
=======
    particleLayer.innerHTML = '';
    
    const particleCount = 20;
>>>>>>> 09973ed (jdk)
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--i', Math.random());
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
<<<<<<< HEAD
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.background = `linear-gradient(45deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`;
        particle.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
=======
        particle.style.animationDelay = `${Math.random() * 15}s`;
>>>>>>> 09973ed (jdk)
        particleLayer.appendChild(particle);
    }
}

<<<<<<< HEAD
// Form submission handling
function initFormHandling() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm || !loginBtn) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;
        
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
        
        // Simulate API call with random success/failure
        setTimeout(() => {
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                handleLoginSuccess();
            } else {
                handleLoginError('Invalid credentials. Please try again.');
            }
        }, 1500);
    });
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                highlightInputError(this);
                showToast('Please enter a valid email address', 'error');
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
                showToast('Password must be at least 6 characters', 'error');
            } else {
                clearInputError(this);
            }
        });
        
        passwordInput.addEventListener('input', function() {
            clearInputError(this);
        });
    }
}

// Email validation helper
=======
function startLogoAnimation() {
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.style.animation = 'none';
        setTimeout(() => {
            logoText.style.animation = 'gradientText 3s linear infinite';
        }, 10);
    }
}

function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('teacherLoginForm');
    
    // Real-time email validation
    emailInput.addEventListener('blur', function() {
        validateEmailField(this);
    });
    
    emailInput.addEventListener('input', function() {
        clearInputError(this);
    });
    
    // Real-time password validation
    passwordInput.addEventListener('blur', function() {
        validatePasswordField(this);
    });
    
    passwordInput.addEventListener('input', function() {
        clearInputError(this);
    });
    
    // Form submission validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isEmailValid = validateEmailField(emailInput);
            const isPasswordValid = validatePasswordField(passwordInput);
            
            if (isEmailValid && isPasswordValid) {
                submitLoginForm();
            } else {
                showToast('Please fix the errors in the form', 'error');
                shakeElement(loginForm);
            }
        });
    }
}

function validateEmailField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('email_error');
    
    if (!value) {
        showValidationError('email_error', 'Email is required');
        highlightInputError(field);
        return false;
    }
    
    if (!validateEmail(value)) {
        showValidationError('email_error', 'Please enter a valid institutional email');
        highlightInputError(field);
        return false;
    }
    
    // Check if it's an institutional email (basic check)
    if (!value.includes('.ac.') && !value.includes('.edu')) {
        showValidationError('email_error', 'Please use your institutional email');
        highlightInputError(field);
        return false;
    }
    
    hideValidationError('email_error');
    clearInputError(field);
    return true;
}

function validatePasswordField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('password_error');
    
    if (!value) {
        showValidationError('password_error', 'Password is required');
        highlightInputError(field);
        return false;
    }
    
    if (value.length < 6) {
        showValidationError('password_error', 'Password must be at least 6 characters');
        highlightInputError(field);
        return false;
    }
    
    hideValidationError('password_error');
    clearInputError(field);
    return true;
}

>>>>>>> 09973ed (jdk)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

<<<<<<< HEAD
// Highlight input error
function highlightInputError(input) {
    input.style.borderColor = '#f44336';
    input.style.boxShadow = '0 0 0 4px rgba(244, 67, 54, 0.1)';
    
    // Add shake animation
    input.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

// Clear input error
function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

// Handle successful login
function handleLoginSuccess() {
    // Show success modal
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Start auto redirect timer
        startAutoRedirect();
        
        // Trigger confetti animation
        triggerConfetti();
    }
    
    // Show success toast
    showToast('Login successful! Welcome to MirrorMind Teacher Portal.', 'success');
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
            // Add pulse animation
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
    console.log('Redirecting to teacher dashboard...');
    showToast('Dashboard loading...', 'success');
    
    // Simulate redirect
    setTimeout(() => {
        hideModal('successModal');
    }, 500);
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
        
        // Update icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
        
        // Animate toggle
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
=======
function initPasswordToggle() {
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4.5 12 4.5c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97A11.892 11.892 0 0 0 1 11.5c2.73 4.39 7 7 11 7 1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33a2.97 2.97 0 0 0-2.64-2.64l2.64 2.64z"/>';
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            }
            
            this.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        });
    }
}

function initModals() {
    // Forgot Password Modal
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const cancelReset = document.getElementById('cancelReset');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(forgotPasswordModal);
        });
    }
    
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', () => closeModal(forgotPasswordModal));
    }
    
    if (cancelReset) {
        cancelReset.addEventListener('click', () => closeModal(forgotPasswordModal));
    }
    
    // Send Reset Link
    const sendResetLink = document.getElementById('sendResetLink');
    if (sendResetLink) {
        sendResetLink.addEventListener('click', function() {
            const resetEmail = document.getElementById('resetEmail').value;
            const resetError = document.getElementById('reset_email_error');
            
            if (!resetEmail) {
                showValidationError('reset_email_error', 'Email is required');
                return;
            }
            
            if (!validateEmail(resetEmail)) {
                showValidationError('reset_email_error', 'Please enter a valid email');
                return;
            }
            
            // Show loading state
            const originalText = sendResetLink.innerHTML;
            sendResetLink.innerHTML = '<div class="spinner small"></div> Sending...';
            sendResetLink.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showToast('Password reset link sent to your email', 'success');
                closeModal(forgotPasswordModal);
                sendResetLink.innerHTML = originalText;
                sendResetLink.disabled = false;
                document.getElementById('resetEmail').value = '';
            }, 2000);
        });
    }
    
    // Close modals when clicking outside
    [forgotPasswordModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function initFaceRecognition() {
    const faceLoginBtn = document.getElementById('faceLoginBtn');
    const faceRecognitionModal = document.getElementById('faceRecognitionModal');
    const closeFaceModal = document.getElementById('closeFaceModal');
    const cancelFaceLogin = document.getElementById('cancelFaceLogin');
    const startFaceRecognition = document.getElementById('startFaceRecognition');
    
    if (faceLoginBtn) {
        faceLoginBtn.addEventListener('click', function() {
            openModal(faceRecognitionModal);
        });
    }
    
    if (closeFaceModal) {
        closeFaceModal.addEventListener('click', () => closeModal(faceRecognitionModal));
    }
    
    if (cancelFaceLogin) {
        cancelFaceLogin.addEventListener('click', () => closeModal(faceRecognitionModal));
    }
    
    if (startFaceRecognition) {
        startFaceRecognition.addEventListener('click', function() {
            // Simulate face recognition process
            const originalText = startFaceRecognition.innerHTML;
            startFaceRecognition.innerHTML = '<div class="spinner small"></div> Scanning...';
            startFaceRecognition.disabled = true;
            
            // Simulate face recognition delay
            setTimeout(() => {
                showToast('Face recognized successfully! Logging in...', 'success');
                
                // Simulate login after face recognition
                setTimeout(() => {
                    startFaceRecognition.innerHTML = originalText;
                    startFaceRecognition.disabled = false;
                    closeModal(faceRecognitionModal);
                    simulateLogin();
                }, 1500);
            }, 3000);
        });
    }
    
    // Fingerprint button
    const fingerprintBtn = document.getElementById('fingerprintBtn');
    if (fingerprintBtn) {
        fingerprintBtn.addEventListener('click', function() {
            showToast('Fingerprint authentication initialized', 'info');
            
            // Simulate fingerprint authentication
            setTimeout(() => {
                showToast('Fingerprint verified! Logging in...', 'success');
                simulateLogin();
            }, 2000);
>>>>>>> 09973ed (jdk)
        });
    }
}

<<<<<<< HEAD
// Link handlers
function initLinkHandlers() {
    // Forgot password
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Password reset link will be sent to your email.', 'info');
        });
    }
    
    // Sign Up link
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Redirecting to sign up page...', 'info');
            // In production: window.location.href = '/signup';
        });
    }
    
    // Back to home
    const backHome = document.querySelector('.back-home');
    if (backHome) {
        backHome.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Returning to homepage...', 'info');
            // In production: window.location.href = '/';
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
            // Add subtle animation
            this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'translateY(0)';
        });
        
        // Add ripple effect on focus
        input.addEventListener('focus', function(e) {
            createRippleEffect(e, this.parentElement);
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
        background: radial-gradient(circle, #4a90e2 0%, transparent 70%);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.1;
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
=======
function initFormSubmission() {
    // Form submission is already handled in initFormValidation
}

function submitLoginForm() {
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Show loading state
    loginBtn.disabled = true;
    loginSpinner.classList.remove('hidden');
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, check for specific credentials
        if (email === 'teacher@university.edu' && password === 'password123') {
            showToast('Login successful! Redirecting to dashboard...', 'success');
            
            // Store login state if remember me is checked
            if (rememberMe) {
                localStorage.setItem('teacher_remembered', 'true');
                localStorage.setItem('teacher_email', email);
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/teacher/dashboard/';
            }, 1500);
        } else {
            showToast('Invalid email or password. Please try again.', 'error');
            loginBtn.disabled = false;
            loginSpinner.classList.add('hidden');
            shakeElement(document.getElementById('teacherLoginForm'));
        }
    }, 2000);
}

function simulateLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Show loading state
    loginBtn.disabled = true;
    loginSpinner.classList.remove('hidden');
    
    // Simulate API call
    setTimeout(() => {
        showToast('Authentication successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/teacher/dashboard/';
        }, 1500);
    }, 1500);
}

function initToastSystem() {
    // Toast system is initialized
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v6z"/></svg>';
    if (type === 'success') icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    if (type === 'error') icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v6z"/></svg>';
    if (type === 'warning') icon = '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
>>>>>>> 09973ed (jdk)
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
<<<<<<< HEAD
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
    console.error('Teacher login page error:', e.error);
    // Fallback for any animation errors
    document.body.classList.add('animations-disabled');
});

// Touch device support
let isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}
=======
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4500);
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
    const inputField = input.closest('.input-field');
    if (inputField) {
        inputField.style.borderColor = '#EF4444';
        inputField.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
}

function clearInputError(input) {
    const inputField = input.closest('.input-field');
    if (inputField) {
        inputField.style.borderColor = '';
        inputField.style.boxShadow = '';
    }
}

function shakeElement(element) {
    element.style.animation = 'shake 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Auto-fill remembered email on page load
window.addEventListener('load', function() {
    const remembered = localStorage.getItem('teacher_remembered');
    const savedEmail = localStorage.getItem('teacher_email');
    
    if (remembered === 'true' && savedEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput) emailInput.value = savedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
});
>>>>>>> 09973ed (jdk)
