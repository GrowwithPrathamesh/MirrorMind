document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Teacher Login Initialized');
    
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
    
    const particleCount = 20;
    
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

function initFormHandling() {
    const loginForm = document.getElementById('teacherLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm || !loginBtn) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!validateEmailField(email)) {
            showToast('Please enter a valid institutional email', 'error');
            shakeElement(loginForm);
            return;
        }
        
        if (!validatePasswordField(password)) {
            showToast('Password must be at least 6 characters', 'error');
            shakeElement(loginForm);
            return;
        }
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
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

function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        // Animate toggle
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
        });
    }
}

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