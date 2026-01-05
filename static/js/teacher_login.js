document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Login Initialized');
    
    // Initialize all components
    initParticlesBackground();
    initFormHandling();
    initPasswordToggle();
    initModalHandling();
    initLinkHandlers();
    initToastSystem();
    
    // Auto-fill remembered email
    loadRememberedEmail();
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
        
        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            shakeElement(loginForm);
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            shakeElement(loginForm);
            return;
        }
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Create FormData for POST request
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            if (rememberMe) {
                formData.append('remember', 'true');
            }
            
            // Send POST request to backend
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
            
            // Reset button state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Handle response
            if (response.ok && data.success === true) {
                // Save remember me preference
                if (rememberMe) {
                    localStorage.setItem('teacher_remembered', 'true');
                    localStorage.setItem('teacher_email', email);
                } else {
                    localStorage.removeItem('teacher_remembered');
                    localStorage.removeItem('teacher_email');
                }
                
                // Handle successful login
                handleLoginSuccess();
                
            } else {
                // Handle login error
                const errorMessage = data.error || data.message || 'Invalid email or password';
                handleLoginError(errorMessage);
            }
            
        } catch (error) {
            console.error('Login request failed:', error);
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            handleLoginError('Network error. Please check your connection.');
        }
    });
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showValidationError('email_error', 'Please enter a valid email');
            } else {
                hideValidationError('email_error');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 6) {
                showValidationError('password_error', 'Password must be at least 6 characters');
            } else {
                hideValidationError('password_error');
            }
        });
    }
}

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
        } else {
            icon.className = 'fas fa-eye';
        }
        
        // Animate button
        this.style.transform = 'translateY(-50%) scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    });
}

function initModalHandling() {
    // Close modal functions
    const closeButtons = [
        'closeForgotModal',
        'closeSuccess',
        'closeError'
    ];
    
    closeButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay');
                if (modal) {
                    hideModal(modal.id);
                }
            });
        }
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
    showToast('Redirecting to dashboard...', 'success');
    
    // Redirect to teacher dashboard
    setTimeout(() => {
        window.location.href = '/teacher-dashboard/';
    }, 1000);
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
            
            // Simulate sending reset link
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

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

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

function loadRememberedEmail() {
    const remembered = localStorage.getItem('teacher_remembered');
    const savedEmail = localStorage.getItem('teacher_email');
    
    if (remembered === 'true' && savedEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (emailInput) emailInput.value = savedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}