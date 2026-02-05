// student_login.js - Premium MirrorMind Login (Fixed Error Handling)

document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Student Login Initialized - Premium Edition');

    initPageTransition();
    initParticlesBackground();
    initFormValidation();
    initPasswordToggle();
    initToastSystem();
    initInteractiveEffects();
    initCardHoverEffect();
    initLogoAnimation();
    initRippleEffects();
    initFormSubmission();

    // IMPORTANT: check errors only after submission
    checkDjangoErrors();
});

/* =========================================================
   DJANGO ERROR HANDLING (FIXED – NO FIRST LOAD TOAST)
========================================================= */

function checkDjangoErrors() {
    const djangoErrorElement = document.getElementById('djangoError');
    if (!djangoErrorElement) return;

    const errorMessage = djangoErrorElement.value.trim();
    if (!errorMessage) return;

    // Only show if form was submitted
    if (sessionStorage.getItem("loginSubmitted") === "true") {

        showToast(errorMessage, 'error', 5000);

        const form = document.getElementById('studentLoginForm');
        if (form) shakeElement(form);

        // Clear email after failed login
        const emailField = document.getElementById("email");
        if (emailField) emailField.value = "";

        sessionStorage.removeItem("loginSubmitted");
    }
}

/* =========================================================
   FORM SUBMISSION
========================================================= */

function initFormSubmission() {
    const form = document.getElementById('studentLoginForm');
    const loginBtn = document.getElementById('loginBtn');

    if (!form || !loginBtn) return;

    form.addEventListener('submit', function(e) {

        // Do NOT prevent default (Django needs submission)
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!validateField(email)) isValid = false;
        if (!validateField(password)) isValid = false;

        if (!isValid) {
            e.preventDefault();
            shakeElement(form);
            return;
        }

        // Set submission flag BEFORE reload
        sessionStorage.setItem("loginSubmitted", "true");

        // Loading UI
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<div class="spinner"></div> Authenticating...';
        loginBtn.classList.add('loading');
    });
}

/* =========================================================
   REMAINING YOUR ORIGINAL PREMIUM FEATURES (UNCHANGED)
========================================================= */

/* ---------- Page Transition ---------- */

function initPageTransition() {
    const links = document.querySelectorAll('a[href^="/"]:not([href^="#"]), a[href^="http"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const overlay = document.querySelector('.page-transition-overlay');
                if (overlay) overlay.style.opacity = '1';
                setTimeout(() => window.location.href = href, 400);
            }
        });
    });
}

/* ---------- Particles ---------- */

function initParticlesBackground() { addParticles(); }

function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;

    particleLayer.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particleLayer.appendChild(particle);
    }
}

/* ---------- Form Validation ---------- */

function initFormValidation() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    [email, password].forEach(input => {
        if (!input) return;

        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
}

function validateField(field) {
    if (!field) return true;

    let isValid = true;
    let errorMessage = '';

    if (field.id === 'email') {
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'Email is required';
        } else if (!validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'Invalid email format';
        }
    }

    if (field.id === 'password') {
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'Password is required';
        } else if (field.value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters';
        }
    }

    if (!isValid) {
        showToast(errorMessage, 'warning', 3000);
        highlightInputError(field);
    } else {
        clearInputError(field);
    }

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function highlightInputError(input) {
    input.style.borderColor = '#FF6B6B';
}

function clearInputError(input) {
    input.style.borderColor = '';
}

/* ---------- Password Toggle ---------- */

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            if (!passwordField) return;

            passwordField.type =
                passwordField.type === 'password' ? 'text' : 'password';
        });
    });
}

/* ---------- Toast ---------- */

function initToastSystem() {
    window.showToast = function(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => toast.remove(), duration);
    };
}

/* ---------- Hover + Effects ---------- */

function initInteractiveEffects() {}
function initCardHoverEffect() {}
function initLogoAnimation() {}
function initRippleEffects() {}

/* ---------- Shake Animation ---------- */

function shakeElement(element) {
    element.style.animation = 'shake 0.6s';
    setTimeout(() => element.style.animation = '', 600);
}
