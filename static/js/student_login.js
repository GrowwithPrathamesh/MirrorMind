// student_login.js - COMPLETE FIX FOR STUCK BUTTON & TOAST ISSUES

// Global flag to prevent duplicate toasts
let toastShown = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Login - Fixed Version Loaded');
    
    // FIRST: ALWAYS reset button on page load - NO EXCEPTIONS
    forceResetButton();
    
    // Clear any previous session flags
    sessionStorage.removeItem('login_submitted');
    sessionStorage.removeItem('login_email');
    sessionStorage.removeItem('error_shown');
    sessionStorage.removeItem('success_shown');
    
    // Initialize all features
    initAllFeatures();
});

/* =========================================================
   FORCE BUTTON RESET - THIS IS THE MAIN FIX
========================================================= */

function forceResetButton() {
    console.log('Force resetting login button...');
    
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) {
        console.error('Login button not found!');
        return;
    }
    
    // GUARANTEE: Button is always in normal state on page load
    loginBtn.disabled = false;
    loginBtn.classList.remove('loading');
    
    // Always set to normal state
    loginBtn.innerHTML = `
        <span class="btn-text">Sign In</span>
        <svg class="btn-icon" viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        <div class="btn-ripple-container"></div>
        <div class="spinner hidden"></div>
    `;
    
    // Reset form state
    const form = document.getElementById('studentLoginForm');
    if (form) {
        form.classList.remove('submitting');
        form.classList.remove('form-error');
    }
    
    // Mark body as loaded
    document.body.classList.add('loaded');
    
    console.log('Button reset complete');
}

/* =========================================================
   INITIALIZE ALL FEATURES
========================================================= */

function initAllFeatures() {
    // Setup form submission
    setupFormSubmission();
    
    // Setup password toggle
    setupPasswordToggle();
    
    // Setup input listeners
    setupInputListeners();
    
    // Check for errors (ONLY ONCE)
    checkDjangoErrors();
    
    // Check for success message (ONLY ONCE)
    checkSuccessMessage();
    
    // Setup toast system
    setupToastSystem();
    
    // Setup other effects
    setupEffects();
}

/* =========================================================
   FORM SUBMISSION - FIXED VERSION
========================================================= */

function setupFormSubmission() {
    const form = document.getElementById('studentLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!form || !loginBtn) {
        console.error('Form or login button not found');
        return;
    }
    
    // Prevent multiple submissions
    let isSubmitting = false;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('Already submitting, ignoring...');
            return;
        }
        
        console.log('Form submission started');
        isSubmitting = true;
        
        // Reset button first
        forceResetButton();
        
        // Validate form
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        let isValid = true;
        
        // Clear previous errors
        clearInputError(email);
        clearInputError(password);
        
        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Invalid email format');
            isValid = false;
        }
        
        // Validate password
        if (!password.value.trim()) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (!isValid) {
            showToast('Please fix the errors before submitting', 'warning', 3000);
            shakeElement(form);
            isSubmitting = false; // Reset flag
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Store submission info
        sessionStorage.setItem('login_submitted', 'true');
        sessionStorage.setItem('login_email', email.value);
        
        // Submit form using Django's POST (traditional form submission)
        // This ensures CSRF token works properly
        console.log('Submitting form via traditional POST...');
        
        // Allow form to submit normally after setting up state
        setTimeout(() => {
            form.submit();
        }, 100);
        
        // Safety timeout to reset button if something goes wrong
        setTimeout(() => {
            if (isSubmitting) {
                console.log('Submission timeout, resetting button');
                forceResetButton();
                isSubmitting = false;
                showToast('Submission taking longer than expected. Please check your connection.', 'warning', 3000);
            }
        }, 10000); // 10 second timeout
    });
    
    function showLoadingState() {
        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = `
            <div class="spinner"></div>
            <span class="btn-text">Authenticating...</span>
            <div class="btn-ripple-container"></div>
        `;
        
        // Mark form as submitting
        form.classList.add('submitting');
    }
}

/* =========================================================
   INPUT LISTENERS - RESET BUTTON WHEN USER TYPES
========================================================= */

function setupInputListeners() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!emailInput || !passwordInput || !loginBtn) return;
    
    // Reset button when user types in email
    emailInput.addEventListener('input', function() {
        if (loginBtn.disabled || loginBtn.classList.contains('loading')) {
            console.log('Email input detected - resetting button');
            forceResetButton();
        }
        clearInputError(this);
    });
    
    // Reset button when user types in password
    passwordInput.addEventListener('input', function() {
        if (loginBtn.disabled || loginBtn.classList.contains('loading')) {
            console.log('Password input detected - resetting button');
            forceResetButton();
        }
        clearInputError(this);
    });
    
    // Also reset on focus
    emailInput.addEventListener('focus', function() {
        if (loginBtn.disabled) {
            forceResetButton();
        }
    });
    
    passwordInput.addEventListener('focus', function() {
        if (loginBtn.disabled) {
            forceResetButton();
        }
    });
}

/* =========================================================
   ERROR HANDLING - PREVENTS DUPLICATE TOASTS
========================================================= */

function checkDjangoErrors() {
    const djangoErrorElement = document.getElementById('djangoError');
    
    if (djangoErrorElement && djangoErrorElement.value) {
        const errorMessage = djangoErrorElement.value.trim();
        
        if (errorMessage) {
            console.log('Django error found:', errorMessage);
            
            // Check if we've already shown this error
            const errorKey = 'error_' + btoa(errorMessage).substring(0, 10);
            if (sessionStorage.getItem(errorKey)) {
                console.log('Error already shown, skipping');
                return;
            }
            
            // Mark error as shown
            sessionStorage.setItem(errorKey, 'true');
            
            // Reset button first
            forceResetButton();
            
            // Show error toast
            setTimeout(() => {
                showToast(errorMessage, 'error', 5000);
            }, 500);
            
            // Shake form
            const form = document.getElementById('studentLoginForm');
            if (form) {
                setTimeout(() => {
                    shakeElement(form);
                }, 600);
            }
            
            // Clear password field
            const passwordField = document.getElementById("password");
            if (passwordField) {
                passwordField.value = "";
            }
            
            // Restore email from session if available
            const storedEmail = sessionStorage.getItem("login_email");
            if (storedEmail) {
                const emailField = document.getElementById("email");
                if (emailField) {
                    emailField.value = storedEmail;
                }
            }
            
            // Clear session storage
            sessionStorage.removeItem("login_submitted");
            sessionStorage.removeItem("login_email");
        }
    }
}

/* =========================================================
   SUCCESS MESSAGE HANDLING - WITH REDIRECT TOAST
========================================================= */

function checkSuccessMessage() {
    // Check if we've already shown success message on this page load
    if (toastShown) {
        return;
    }
    
    // Check URL for success parameter
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    
    // Check hidden field
    const successElement = document.getElementById('successMessage');
    
    if (successParam === 'true' || (successElement && successElement.value === 'true')) {
        console.log('Login success detected');
        
        // Mark toast as shown
        toastShown = true;
        
        // Reset button
        forceResetButton();
        
        // Clear any previous session flags
        sessionStorage.removeItem('login_submitted');
        sessionStorage.removeItem('login_email');
        sessionStorage.removeItem('error_shown');
        
        // Show success toast with redirect message
        setTimeout(() => {
            showToast('🎉 Login successful! Redirecting to dashboard...', 'success', 3000);
            
            // Add redirecting animation to the page
            document.body.classList.add('redirecting');
            
            // Clear URL parameter
            if (successParam === 'true') {
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/student/dashboard/';
            }, 2000);
        }, 300);
    }
}

/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            
            if (passwordField) {
                const isPassword = passwordField.type === 'password';
                passwordField.type = isPassword ? 'text' : 'password';
                
                // Update icon
                const eyeIcon = this.querySelector('.eye-icon');
                if (eyeIcon) {
                    if (isPassword) {
                        eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
                    } else {
                        eyeIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
                    }
                }
            }
        });
    });
}

/* =========================================================
   TOAST SYSTEM - PREVENTS DUPLICATES
========================================================= */

function setupToastSystem() {
    // Store active toasts to prevent duplicates
    const activeToasts = new Set();
    
    window.showToast = function(message, type = 'info', duration = 4000) {
        // Check for duplicate messages
        const toastKey = message + type;
        if (activeToasts.has(toastKey)) {
            console.log('Toast already shown:', message);
            return;
        }
        
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.error('Toast container not found');
            return;
        }
        
        // Add to active toasts
        activeToasts.add(toastKey);
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                break;
            case 'error':
                icon = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                break;
            default:
                icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
        }
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.4s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                activeToasts.delete(toastKey);
            }, 400);
        }, duration);
    };
}

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function showError(input, message) {
    const errorElement = document.getElementById(input.id + '_error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
    input.style.borderColor = '#FF6B6B';
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 600);
}

function clearInputError(input) {
    const errorElement = document.getElementById(input.id + '_error');
    if (errorElement) {
        errorElement.classList.remove('active');
        errorElement.textContent = '';
    }
    input.style.borderColor = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 600);
}

/* =========================================================
   OTHER EFFECTS
========================================================= */

function setupEffects() {
    // Card hover effect
    const card = document.querySelector('.login-card');
    const glow = document.querySelector('.card-hover-glow');
    
    if (card && glow) {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            glow.style.setProperty('--mouse-x', `${x}%`);
            glow.style.setProperty('--mouse-y', `${y}%`);
        });
    }
    
    // Logo animation
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.addEventListener('click', function() {
            this.style.animation = 'logoClick 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    }
    
    // Ripple effects
    const buttons = document.querySelectorAll('.btn-primary, .forgot-password');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled || this.classList.contains('loading')) return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
            }, 600);
        });
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible again, reset button just in case
        forceResetButton();
    }
});

// Handle page reload
window.addEventListener('beforeunload', function() {
    // Clear all session flags
    sessionStorage.removeItem('login_submitted');
    sessionStorage.removeItem('login_email');
});