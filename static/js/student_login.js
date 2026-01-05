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
        
        try {
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
            });
            
            const data = await response.json();
            
            hideLoading();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            if (data.success) {
                // Login successful
                handleLoginSuccess(data.redirect_url);
            } else {
                // Login failed
                handleLoginError(data.error || 'Login failed');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
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

// Redirect to dashboard - UPDATED
function redirectToDashboard(redirectUrl = '/student/dashboard/') {
    // Actual redirect
    window.location.href = redirectUrl;
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
        continueBtn.addEventListener('click', function() {
            redirectToDashboard('/student/dashboard/');
        });
    }
    
    // ... rest of the code
}