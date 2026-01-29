// student_signup.js - Enhanced with Premium Animations & Interactions
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Student Registration Initialized - Premium Edition');
    
    // Initialize all premium features
    initPageTransition();
    initParticlesBackground();
    initFormNavigation();
    initFormValidation();
    initCalendarPicker();
    initPasswordToggle();
    initPasswordStrength();
    initOTPHandling();
    initTermsHandling();
    initFormSubmission();
    initToastSystem();
    initInteractiveEffects();
    initCardHoverEffect();
    initLogoAnimation();
    initScrollAnimations();
    initRippleEffects();
});

function initPageTransition() {
    // Add page transition on link clicks
    const links = document.querySelectorAll('a[href^="/"]:not([href^="#"]), a[href^="http"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Show transition overlay
                const overlay = document.querySelector('.page-transition-overlay');
                overlay.style.opacity = '1';
                
                // Animate overlay
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
}

function initParticlesBackground() {
    addParticles();
}

function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;
    
    particleLayer.innerHTML = '';
    
    const particleCount = 40; // Increased for more premium feel
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Enhanced particle properties
        const size = 2 + Math.random() * 3;
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 20;
        
        particle.style.setProperty('--i', Math.random());
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Random gradient for particles
        const gradients = [
            'linear-gradient(45deg, #00C6FF, #8B5CF6)',
            'linear-gradient(45deg, #00F5D4, #00C6FF)',
            'linear-gradient(45deg, #8B5CF6, #22D3EE)'
        ];
        particle.style.background = gradients[Math.floor(Math.random() * gradients.length)];
        
        particleLayer.appendChild(particle);
    }
}

function initCardHoverEffect() {
    const card = document.querySelector('.signup-card');
    const cardGlow = document.querySelector('.card-hover-glow');
    
    if (!card || !cardGlow) return;
    
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        cardGlow.style.setProperty('--mouse-x', `${x}%`);
        cardGlow.style.setProperty('--mouse-y', `${y}%`);
    });
    
    // Add subtle tilt effect on mousemove
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
    });
    
    card.addEventListener('mouseleave', function() {
        cardGlow.style.opacity = '0';
    });
    
    card.addEventListener('mouseenter', function() {
        cardGlow.style.opacity = '1';
    });
}

function initLogoAnimation() {
    const logoText = document.querySelector('.logo-text');
    const logoContainer = document.querySelector('.logo-container');
    
    if (!logoText || !logoContainer) return;
    
    // Enhanced hover effect
    logoText.addEventListener('mouseenter', function() {
        this.style.animation = 'gradientText 1.5s linear infinite, logoHover 0.6s ease forwards';
        
        // Create particle burst effect
        createLogoParticles(logoContainer);
    });
    
    logoText.addEventListener('mouseleave', function() {
        this.style.animation = 'gradientText 3s linear infinite, floatLogo 6s ease-in-out infinite';
    });
    
    // Click effect
    logoText.addEventListener('click', function(e) {
        e.preventDefault();
        createClickRipple(e, this);
        
        // Gentle bounce animation
        this.style.animation = 'gradientText 1.5s linear infinite, logoClick 0.8s ease';
        setTimeout(() => {
            this.style.animation = 'gradientText 3s linear infinite, floatLogo 6s ease-in-out infinite';
        }, 800);
    });
}

function createLogoParticles(container) {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'logo-particle';
        
        const size = 2 + Math.random() * 4;
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, #00C6FF, #8B5CF6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        
        container.appendChild(particle);
        
        // Animate particle
        const keyframes = [
            {
                transform: `translate(-50%, -50%) translate(0, 0) scale(1)`,
                opacity: 1
            },
            {
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ];
        
        const options = {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        };
        
        particle.animate(keyframes, options).onfinish = () => particle.remove();
    }
}

function initRippleEffects() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.type !== 'submit') {
            button.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        }
    });
    
    // Add ripple effect to form inputs on focus
    const inputs = document.querySelectorAll('.input-field input, .input-field select');
    inputs.forEach(input => {
        input.addEventListener('focus', function(e) {
            createInputRipple(e, this.parentElement);
        });
    });
}

function createRippleEffect(event, element) {
    // Use existing ripple container if available
    let rippleContainer = element.querySelector('.btn-ripple-container');
    if (!rippleContainer) {
        rippleContainer = document.createElement('div');
        rippleContainer.className = 'btn-ripple-container';
        element.appendChild(rippleContainer);
    }
    
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 0;
    `;
    
    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function createInputRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = rect.width;
    const x = event.clientX - rect.left - size / 2;
    const y = rect.height / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 198, 255, 0.1);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function createClickRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 198, 255, 0.3) 0%, transparent 70%);
        transform: scale(0);
        animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
}

function initScrollAnimations() {
    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe form groups for staggered animation
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(group);
    });
    
    // Add animation class when element comes into view
    const animateInClass = 'animate-in';
    const animateElements = document.querySelectorAll('.form-group, .action-buttons, .card-footer');
    
    animateElements.forEach(el => {
        el.classList.remove(animateInClass);
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

function initFormNavigation() {
    let currentStep = 1;
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressFill = document.getElementById('progressFill');
    const progressGlow = document.querySelector('.progress-glow');
    
    // Enhanced step animation
    function animateStepTransition(fromStep, toStep) {
        const fromElement = document.getElementById(`step${fromStep}`);
        const toElement = document.getElementById(`step${toStep}`);
        
        if (!fromElement || !toElement) return;
        
        // Animate out current step
        // fromElement.style.animation = 'slideOutLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        
        setTimeout(() => {
            fromElement.classList.remove('active');
            fromElement.style.animation = '';
            
            // Animate in next step
            toElement.classList.add('active');
            toElement.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            
            setTimeout(() => {
                toElement.style.animation = '';
            }, 400);
        }, 400);
    }
    
    // Add CSS for slide animations
    const slideAnimations = document.createElement('style');
    slideAnimations.textContent = `
        @keyframes slideOutLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50px);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(50px);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(slideAnimations);
    
    function updateProgress(step) {
        // Updated for 3 steps instead of 4
        const progressPercentage = ((step - 1) / 2) * 100;
        
        // Animate progress fill
        progressFill.style.width = `${progressPercentage}%`;
        
        // Trigger glow animation
        if (progressGlow) {
            progressGlow.style.animation = 'none';
            void progressGlow.offsetWidth; // Trigger reflow
            progressGlow.style.animation = 'progressGlow 2s ease-in-out';
        }
        
        // Animate step circles
        progressSteps.forEach((stepEl, index) => {
            const stepNumber = index + 1;
            setTimeout(() => {
                if (stepNumber <= step) {
                    stepEl.classList.add('active');
                    // Add bounce animation
                    const circle = stepEl.querySelector('.step-circle');
                    circle.style.animation = 'stepActivate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    setTimeout(() => {
                        circle.style.animation = '';
                    }, 600);
                } else {
                    stepEl.classList.remove('active');
                }
            }, index * 100);
        });
        
        // Add step activation animation
        const stepActivateStyle = document.createElement('style');
        stepActivateStyle.textContent = `
            @keyframes stepActivate {
                0% {
                    transform: scale(0.5);
                    opacity: 0;
                }
                70% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1.1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(stepActivateStyle);
    }
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                if (currentStep === 1 && nextStep === 2) {
                    sendOTPAndNavigate();
                } else {
                    animateStepTransition(currentStep, nextStep);
                    currentStep = nextStep;
                    updateProgress(nextStep);
                    
                    // Focus first input in new step
                    setTimeout(() => {
                        const firstInput = document.querySelector(`#step${nextStep} input`);
                        if (firstInput) firstInput.focus();
                    }, 500);
                }
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            
            // Animate step transition for previous
            const fromElement = document.getElementById(`step${currentStep}`);
            const toElement = document.getElementById(`step${prevStep}`);
            
            if (fromElement && toElement) {
                fromElement.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                
                setTimeout(() => {
                    fromElement.classList.remove('active');
                    fromElement.style.animation = '';
                    
                    toElement.classList.add('active');
                    toElement.style.animation = 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    
                    setTimeout(() => {
                        toElement.style.animation = '';
                    }, 400);
                }, 400);
            }
            
            currentStep = prevStep;
            updateProgress(prevStep);
        });
    });
    
    async function sendOTPAndNavigate() {
        const email = document.getElementById('email').value.trim();
        const enrollment = document.getElementById('enrollment_no').value.trim();
        
        if (!email || !enrollment) {
            showToast('Please fill in all required fields', 'error');
            return false;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            highlightInputError(document.getElementById('email'));
            return false;
        }
        
        if (enrollment.length < 3) {
            showToast('Enrollment number is too short', 'error');
            highlightInputError(document.getElementById('enrollment_no'));
            return false;
        }
        
        const continueBtn = document.getElementById('step1Continue');
        const originalText = continueBtn.innerHTML;
        continueBtn.innerHTML = '<div class="spinner"></div> Sending OTP...';
        continueBtn.disabled = true;
        
        try {
            const csrfToken = getCSRFToken();
            const response = await fetch('/email_otp_handler/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    action: 'send_otp',
                    email: email,
                    purpose: 'signup'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('otpEmailDisplay').textContent = email;
                
                // Animate transition to step 2
                animateStepTransition(currentStep, 2);
                currentStep = 2;
                updateProgress(2);
                
                // Focus first OTP input with animation
                setTimeout(() => {
                    const firstOtpInput = document.querySelector('.otp-digit[data-index="0"]');
                    if (firstOtpInput) {
                        firstOtpInput.focus();
                        // Add focus animation
                        firstOtpInput.parentElement.style.animation = 'otpFocusPulse 0.6s ease';
                        setTimeout(() => {
                            firstOtpInput.parentElement.style.animation = '';
                        }, 600);
                    }
                }, 500);
                
                showToast('OTP sent to your email', 'success');
                
                // Add OTP focus pulse animation
                const otpFocusStyle = document.createElement('style');
                otpFocusStyle.textContent = `
                    @keyframes otpFocusPulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                    }
                `;
                document.head.appendChild(otpFocusStyle);
                
            } else {
                showToast(data.error || 'Failed to send OTP', 'error');
                continueBtn.innerHTML = originalText;
                continueBtn.disabled = false;
                
                // Add shake animation to button
                continueBtn.style.animation = 'shake 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    continueBtn.style.animation = '';
                }, 600);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            showToast('Failed to send OTP. Please try again.', 'error');
            continueBtn.innerHTML = originalText;
            continueBtn.disabled = false;
        }
    }
    
    function navigateToStep(step) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${step}`).classList.add('active');
        
        currentStep = step;
        updateProgress(step);
        
        if (step === 3) {
            setTimeout(() => {
                document.getElementById('password').focus();
            }, 300);
        }
    }
    
    function validateStep(step) {
        switch(step) {
            case 1:
                return validateStep1();
            case 2:
                return true; // OTP validation handled separately
            case 3:
                return validateStep3();
            default:
                return true;
        }
    }
    
    updateProgress(currentStep);
    
    window.navigateToStep = navigateToStep;
}

function initFormValidation() {
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const email = document.getElementById('email');
    const enrollment = document.getElementById('enrollment_no');
    const department = document.getElementById('department');
    const dob = document.getElementById('dob');
    
    [firstName, lastName, email, enrollment, dob].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
                // Add typing animation
                this.parentElement.classList.add('typing');
                setTimeout(() => {
                    this.parentElement.classList.remove('typing');
                }, 300);
            });
        }
    });
    
    if (department) {
        department.addEventListener('change', function() {
            validateField(this);
            // Add selection animation
            this.style.animation = 'selectBounce 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    }
    
    // Add typing animation style
    const typingStyle = document.createElement('style');
    typingStyle.textContent = `
        @keyframes selectBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        
        .input-field.typing .input-icon {
            animation: iconType 0.3s ease;
        }
        
        @keyframes iconType {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(typingStyle);
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    switch (field.id) {
        case 'first_name':
        case 'last_name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;
            
        case 'email':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!validateEmail(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'enrollment_no':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Enrollment number is required';
            } else if (field.value.trim().length < 3) {
                isValid = false;
                errorMessage = 'Enrollment number is too short';
            }
            break;
            
        case 'department':
            if (!field.value) {
                isValid = false;
                errorMessage = 'Please select a department';
            }
            break;
            
        case 'dob':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Date of birth is required';
            }
            break;
            
        case 'parent_name':
        case 'parent_email':
        case 'parent_mobile':
            const parentSection = document.getElementById('parentSection');
            if (parentSection.classList.contains('active') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required for students under 10';
            }
            break;
    }
    
    if (!isValid) {
        showValidationError(field.id + '_error', errorMessage);
        highlightInputError(field);
        
        // Add error animation
        field.style.animation = 'inputErrorShake 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            field.style.animation = '';
        }, 600);
    } else {
        hideValidationError(field.id + '_error');
        clearInputError(field);
        
        // Add success animation for valid fields
        if (field.value.trim()) {
            field.parentElement.classList.add('valid');
            setTimeout(() => {
                field.parentElement.classList.remove('valid');
            }, 1000);
        }
    }
    
    // Add input error shake animation
    const errorShakeStyle = document.createElement('style');
    errorShakeStyle.textContent = `
        @keyframes inputErrorShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .input-field.valid .input-icon {
            animation: iconSuccess 0.6s ease;
        }
        
        @keyframes iconSuccess {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); color: #00F5D4; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(errorShakeStyle);
    
    return isValid;
}

function validateStep1() {
    let isValid = true;
    const fields = [
        'first_name',
        'last_name',
        'email',
        'enrollment_no',
        'department',
        'dob'
    ];
    
    const parentSection = document.getElementById('parentSection');
    if (parentSection.classList.contains('active')) {
        fields.push('parent_name', 'parent_email', 'parent_mobile');
    }
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
        shakeElement(document.getElementById('step1'));
    }
    
    return isValid;
}

function validateStep3() {
    let isValid = true;
    
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    
    if (!validatePassword(password.value)) {
        showValidationError('password_error', getPasswordErrorMessage(password.value));
        isValid = false;
    } else {
        hideValidationError('password_error');
    }
    
    if (password.value !== confirmPassword.value) {
        showValidationError('confirm_password_error', 'Passwords do not match');
        isValid = false;
    } else {
        hideValidationError('confirm_password_error');
    }
    
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        const termsContainer = document.getElementById('termsContainer');
        termsContainer.querySelector('.terms-checkbox').classList.add('error');
        termsContainer.querySelector('.terms-error').classList.add('visible');
        shakeElement(termsContainer);
        showToast('Please accept the terms and conditions', 'error');
        isValid = false;
    } else {
        const termsContainer = document.getElementById('termsContainer');
        termsContainer.querySelector('.terms-checkbox').classList.remove('error');
        termsContainer.querySelector('.terms-error').classList.remove('visible');
    }
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
        shakeElement(document.getElementById('step3'));
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
}

function getPasswordErrorMessage(password) {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
}

function showValidationError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
        
        // Add error icon animation
        errorElement.style.animation = 'errorAppear 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            errorElement.style.animation = '';
        }, 400);
    }
    
    // Add error appear animation
    const errorAppearStyle = document.createElement('style');
    errorAppearStyle.textContent = `
        @keyframes errorAppear {
            0% {
                opacity: 0;
                transform: translateY(-10px) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(errorAppearStyle);
}

function hideValidationError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.classList.remove('active');
    }
}

function highlightInputError(input) {
    input.style.borderColor = '#FF6B6B';
    input.style.boxShadow = 
        '0 0 0 4px rgba(255, 107, 107, 0.1), ' +
        '0 0 20px rgba(255, 107, 107, 0.1)';
    
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = '';
    errorDiv.style.animation = 'fadeIn 0.3s ease';
    
    input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }
    
    const errorId = input.id + '_error';
    hideValidationError(errorId);
}

function initCalendarPicker() {
    const dobInput = document.getElementById('dob');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalendar = document.getElementById('closeCalendar');
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const prevYearBtn = document.getElementById('prevYear');
    const nextYearBtn = document.getElementById('nextYear');
    const clearDateBtn = document.getElementById('clearDate');
    const selectDateBtn = document.getElementById('selectDate');
    
    let selectedDate = null;
    let currentDate = new Date();
    let viewingYear = currentDate.getFullYear();
    let viewingMonth = currentDate.getMonth();
    
    function populateYearSelect() {
        yearSelect.innerHTML = '';
        const currentYear = currentDate.getFullYear();
        for (let year = currentYear - 100; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        yearSelect.value = viewingYear;
    }
    
    dobInput.addEventListener('click', openCalendar);
    
    closeCalendar.addEventListener('click', closeCalendarModal);
    calendarModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCalendarModal();
        }
    });
    
    yearSelect.addEventListener('change', function() {
        viewingYear = parseInt(this.value);
        renderCalendar();
        // Add transition animation
        calendarDays.style.animation = 'calendarTransition 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = '';
        }, 300);
    });
    
    monthSelect.addEventListener('change', function() {
        viewingMonth = parseInt(this.value);
        renderCalendar();
        // Add transition animation
        calendarDays.style.animation = 'calendarTransition 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = '';
        }, 300);
    });
    
    prevYearBtn.addEventListener('click', () => {
        viewingYear--;
        yearSelect.value = viewingYear;
        renderCalendar();
        // Add slide animation
        calendarDays.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = 'slideInLeft 0.3s ease';
            setTimeout(() => {
                calendarDays.style.animation = '';
            }, 300);
        }, 300);
    });
    
    nextYearBtn.addEventListener('click', () => {
        viewingYear++;
        yearSelect.value = viewingYear;
        renderCalendar();
        // Add slide animation
        calendarDays.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = 'slideInRight 0.3s ease';
            setTimeout(() => {
                calendarDays.style.animation = '';
            }, 300);
        }, 300);
    });
    
    prevMonthBtn.addEventListener('click', () => {
        viewingMonth--;
        if (viewingMonth < 0) {
            viewingMonth = 11;
            viewingYear--;
        }
        monthSelect.value = viewingMonth;
        yearSelect.value = viewingYear;
        renderCalendar();
        // Add slide animation
        calendarDays.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = 'slideInLeft 0.3s ease';
            setTimeout(() => {
                calendarDays.style.animation = '';
            }, 300);
        }, 300);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        viewingMonth++;
        if (viewingMonth > 11) {
            viewingMonth = 0;
            viewingYear++;
        }
        monthSelect.value = viewingMonth;
        yearSelect.value = viewingYear;
        renderCalendar();
        // Add slide animation
        calendarDays.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
            calendarDays.style.animation = 'slideInRight 0.3s ease';
            setTimeout(() => {
                calendarDays.style.animation = '';
            }, 300);
        }, 300);
    });
    
    clearDateBtn.addEventListener('click', () => {
        selectedDate = null;
        dobInput.value = '';
        dobInput.parentElement.classList.remove('has-age');
        renderCalendar();
        
        // Add clear animation
        clearDateBtn.style.animation = 'buttonClick 0.3s ease';
        setTimeout(() => {
            clearDateBtn.style.animation = '';
        }, 300);
    });
    
    selectDateBtn.addEventListener('click', () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            dobInput.value = formattedDate;
            calculateAge(selectedDate);
            closeCalendarModal();
            hideValidationError('dob_error');
            
            // Add selection animation to input
            dobInput.style.animation = 'dateSelected 0.6s ease';
            setTimeout(() => {
                dobInput.style.animation = '';
            }, 600);
        }
    });
    
    function openCalendar() {
        if (dobInput.value) {
            selectedDate = parseDate(dobInput.value);
            if (selectedDate) {
                viewingYear = selectedDate.getFullYear();
                viewingMonth = selectedDate.getMonth();
            }
        } else {
            viewingYear = currentDate.getFullYear();
            viewingMonth = currentDate.getMonth();
        }
        
        populateYearSelect();
        yearSelect.value = viewingYear;
        monthSelect.value = viewingMonth;
        renderCalendar();
        
        calendarModal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Add modal open animation
        calendarModal.style.animation = 'modalOpen 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            calendarModal.style.animation = '';
        }, 400);
    }
    
    function closeCalendarModal() {
        calendarModal.style.animation = 'modalClose 0.3s ease';
        setTimeout(() => {
            calendarModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            calendarModal.style.animation = '';
        }, 300);
    }
    
    function renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        currentMonthYear.textContent = `${monthNames[viewingMonth]} ${viewingYear}`;
        
        const firstDay = new Date(viewingYear, viewingMonth, 1);
        const lastDay = new Date(viewingYear, viewingMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        calendarDays.innerHTML = '';
        
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'disabled';
            calendarDays.appendChild(emptyCell);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            
            const cellDate = new Date(viewingYear, viewingMonth, day);
            cellDate.setHours(0, 0, 0, 0);
            
            if (cellDate > today) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.addEventListener('click', () => selectDate(cellDate));
                
                if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
                    dayCell.classList.add('selected');
                }
                
                if (cellDate.getTime() === today.getTime()) {
                    dayCell.classList.add('today');
                }
                
                // Add hover effect
                dayCell.addEventListener('mouseenter', () => {
                    if (!dayCell.classList.contains('selected')) {
                        dayCell.style.transform = 'scale(1.05)';
                    }
                });
                
                dayCell.addEventListener('mouseleave', () => {
                    if (!dayCell.classList.contains('selected')) {
                        dayCell.style.transform = 'scale(1)';
                    }
                });
            }
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    function selectDate(date) {
        selectedDate = date;
        
        // Add selection animation to all cells
        const dayCells = calendarDays.querySelectorAll('div');
        dayCells.forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Find and animate selected cell
        const selectedCell = Array.from(calendarDays.children).find(cell => 
            cell.textContent == date.getDate() && !cell.classList.contains('disabled')
        );
        
        if (selectedCell) {
            selectedCell.classList.add('selected');
            
            // Add selection animation
            selectedCell.style.animation = 'dateSelect 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                selectedCell.style.animation = '';
            }, 400);
        }
        
        renderCalendar();
    }
    
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
    
    function parseDate(dateString) {
        try {
            if (dateString.includes('-')) {
                const [year, month, day] = dateString.split('-').map(Number);
                return new Date(year, month - 1, day);
            } else if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts.map(Number);
                    return new Date(year, month - 1, day);
                }
            }
        } catch (e) {
            console.error('Date parse error:', e);
        }
        return null;
    }
    
    function calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        const ageDisplay = document.getElementById('ageDisplay');
        ageDisplay.textContent = `${age} years`;
        
        const dobContainer = document.getElementById('dob').parentElement;
        dobContainer.classList.add('has-age');
        
        const parentSection = document.getElementById('parentSection');
        if (age < 10) {
            parentSection.classList.add('active');
            ['parent_name', 'parent_email', 'parent_mobile'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.required = true;
                    field.disabled = false;
                    
                    // Add slide in animation for parent section
                    parentSection.style.animation = 'sectionExpand 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        parentSection.style.animation = '';
                    }, 500);
                }
            });
        } else {
            parentSection.classList.remove('active');
            ['parent_name', 'parent_email', 'parent_mobile'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.required = false;
                    field.disabled = true;
                    field.value = '';
                    hideValidationError(fieldId + '_error');
                }
            });
        }
        
        window.calculatedAge = age;
        return age;
    }
    
    // Add calendar animations
    const calendarAnimations = document.createElement('style');
    calendarAnimations.textContent = `
        @keyframes modalOpen {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes modalClose {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
        }
        
        @keyframes calendarTransition {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        @keyframes buttonClick {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
        }
        
        @keyframes dateSelected {
            0%, 100% { background-color: #F2F5F9; }
            50% { background-color: rgba(0, 198, 255, 0.1); }
        }
        
        @keyframes sectionExpand {
            from {
                max-height: 0;
                opacity: 0;
            }
            to {
                max-height: 500px;
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(calendarAnimations);
    
    populateYearSelect();
    renderCalendar();
}

function getCSRFToken() {
    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfInput) {
        return csrfInput.value;
    }
    const csrfCookie = document.cookie.match(/csrftoken=([^;]+)/);
    return csrfCookie ? csrfCookie[1] : '';
}

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            
            // Add toggle animation
            this.style.animation = 'toggleBounce 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.setAttribute('viewBox', '0 0 24 24');
                eyeIcon.innerHTML = '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4.5 12 4.5c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97A11.892 11.892 0 0 0 1 11.5c2.73 4.39 7 7 11 7 1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33a2.97 2.97 0 0 0-2.64-2.64l2.64 2.64z"/>';
                
                // Add reveal animation
                passwordField.style.animation = 'revealPassword 0.3s ease';
                setTimeout(() => {
                    passwordField.style.animation = '';
                }, 300);
            } else {
                passwordField.type = 'password';
                eyeIcon.setAttribute('viewBox', '0 0 24 24');
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
                
                // Add hide animation
                passwordField.style.animation = 'hidePassword 0.3s ease';
                setTimeout(() => {
                    passwordField.style.animation = '';
                }, 300);
            }
            
            this.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        });
    });
    
    // Add password toggle animations
    const toggleAnimations = document.createElement('style');
    toggleAnimations.textContent = `
        @keyframes toggleBounce {
            0%, 100% { transform: translateY(-50%) scale(1); }
            50% { transform: translateY(-50%) scale(0.9); }
        }
        
        @keyframes revealPassword {
            0% { letter-spacing: 0; }
            50% { letter-spacing: 1px; }
            100% { letter-spacing: 0; }
        }
        
        @keyframes hidePassword {
            0% { letter-spacing: 0; }
            50% { letter-spacing: -1px; }
            100% { letter-spacing: 0; }
        }
    `;
    document.head.appendChild(toggleAnimations);
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBar = passwordStrength.querySelector('.strength-bar');
    const strengthFill = strengthBar.querySelector('.strength-fill');
    const strengthText = passwordStrength.querySelector('.strength-text');
    const confirmPassword = document.getElementById('confirm_password');
    const passwordMatch = document.getElementById('passwordMatch');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            passwordStrength.classList.remove('visible');
            hideValidationError('password_error');
            return;
        }
        
        passwordStrength.classList.add('visible');
        
        let strength = 0;
        let feedback = '';
        
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        strengthBar.className = 'strength-bar';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            feedback = 'Weak password';
            strengthFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF9B6B)';
        } else if (strength === 3) {
            strengthBar.classList.add('medium');
            feedback = 'Medium strength';
            strengthFill.style.background = 'linear-gradient(90deg, #FFD93D, #FFB347)';
        } else {
            strengthBar.classList.add('strong');
            feedback = 'Strong password';
            strengthFill.style.background = 'linear-gradient(90deg, #00F5D4, #00C6FF)';
        }
        
        // Animate strength bar
        const percentage = (strength / 5) * 100;
        strengthFill.style.width = `${percentage}%`;
        
        // Add strength particles for strong passwords
        if (strength >= 4) {
            createStrengthParticles(strengthBar);
        }
        
        strengthText.textContent = feedback;
        
        if (!validatePassword(password)) {
            showValidationError('password_error', getPasswordErrorMessage(password));
        } else {
            hideValidationError('password_error');
        }
    });
    
    confirmPassword.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirm = this.value;
        
        if (confirm.length === 0) {
            passwordMatch.classList.remove('visible');
            hideValidationError('confirm_password_error');
            return;
        }
        
        passwordMatch.classList.add('visible');
        
        if (password === confirm && password.length > 0) {
            passwordMatch.innerHTML = '<svg class="match-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>Passwords match</span>';
            passwordMatch.style.color = '#00F5D4';
            hideValidationError('confirm_password_error');
            
            // Add celebration animation for match
            if (validatePassword(password)) {
                createPasswordMatchCelebration(passwordMatch);
            }
        } else {
            passwordMatch.innerHTML = '<svg class="match-icon" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg><span>Passwords don\'t match</span>';
            passwordMatch.style.color = '#FF6B6B';
            showValidationError('confirm_password_error', 'Passwords do not match');
        }
    });
    
    function createStrengthParticles(container) {
        const particles = container.querySelector('.strength-particles') || document.createElement('div');
        particles.className = 'strength-particles';
        container.appendChild(particles);
        
        // Clear existing particles
        particles.innerHTML = '';
        
        // Create new particles
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'strength-particle';
            
            const size = 2 + Math.random() * 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 1;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: #00F5D4;
                border-radius: 50%;
                left: ${left}%;
                top: 50%;
                transform: translateY(-50%);
                animation: strengthParticle 1.5s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 4px #00F5D4;
            `;
            
            particles.appendChild(particle);
        }
        
        // Add particle animation
        const particleAnimation = document.createElement('style');
        particleAnimation.textContent = `
            @keyframes strengthParticle {
                0%, 100% {
                    opacity: 0;
                    transform: translateY(-50%) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-50%) scale(1);
                }
            }
        `;
        document.head.appendChild(particleAnimation);
    }
    
    function createPasswordMatchCelebration(container) {
        // Create celebration particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            
            const size = 4 + Math.random() * 3;
            const angle = (i / 5) * Math.PI * 2;
            const distance = 20 + Math.random() * 10;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #00F5D4, #00C6FF);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            container.appendChild(particle);
            
            // Animate particle
            const keyframes = [
                {
                    transform: `translate(-50%, -50%) translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ];
            
            const options = {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            };
            
            particle.animate(keyframes, options).onfinish = () => particle.remove();
        }
    }
}

function initOTPHandling() {
    let otpTimer = 120;
    let timerInterval;
    const otpDigits = document.querySelectorAll('.otp-digit');
    const otpField = document.getElementById('otp');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const countdownElement = document.getElementById('countdown');
    const timerCircle = document.querySelector('.timer-circle');
    
    // Initialize timer circle
    if (timerCircle) {
        timerCircle.style.strokeDashoffset = '0';
    }
    
    updateCountdown();
    
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 1 && index < otpDigits.length - 1) {
                // Add input transition animation
                otpDigits[index + 1].style.animation = 'nextInputFocus 0.3s ease';
                setTimeout(() => {
                    otpDigits[index + 1].style.animation = '';
                }, 300);
                otpDigits[index + 1].focus();
            }

            updateOTPValue();
            hideValidationError('otp_error');

            // Add digit input animation
            this.parentElement.style.animation = 'digitInput 0.3s ease';
            setTimeout(() => {
                this.parentElement.style.animation = '';
            }, 300);

            if (isOTPComplete()) {
                verifyOTP();
            }
        });

        
        digit.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                // Add backspace animation
                otpDigits[index - 1].style.animation = 'prevInputFocus 0.3s ease';
                setTimeout(() => {
                    otpDigits[index - 1].style.animation = '';
                }, 300);
                otpDigits[index - 1].focus();
            }
            
            if (e.key === 'Enter' && isOTPComplete()) {
                verifyOTP();
            }
            
            if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                setTimeout(() => {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    updateOTPValue();
                    
                    // Add paste animation
                    this.parentElement.style.animation = 'digitPaste 0.5s ease';
                    setTimeout(() => {
                        this.parentElement.style.animation = '';
                    }, 500);
                }, 10);
            }
        });
        
        digit.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = pastedData.replace(/[^0-9]/g, '');
            
            if (numbers.length === 6) {
                // Add paste animation to all digits
                otpDigits.forEach(d => {
                    d.parentElement.style.animation = 'digitPaste 0.5s ease';
                    setTimeout(() => {
                        d.parentElement.style.animation = '';
                    }, 500);
                });
                
                numbers.split('').forEach((num, idx) => {
                    if (idx < otpDigits.length) {
                        otpDigits[idx].value = num;
                    }
                });
                updateOTPValue();
                otpDigits[5].focus();
            }
        });
        
        // Add focus animation
        digit.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'translateY(-2px)';
        });
        
        digit.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'translateY(0)';
        });
    });
    
    async function verifyOTP() {
        const otpDigits = document.querySelectorAll('.otp-digit');
        let otpValue = '';
        otpDigits.forEach(digit => otpValue += digit.value);
        
        if (otpValue.length !== 6) {
            showValidationError('otp_error', 'OTP must be exactly 6 digits');
            shakeElement(document.querySelector('.otp-inputs'));
            return;
        }
        
        if (!/^\d{6}$/.test(otpValue)) {
            showValidationError('otp_error', 'OTP must contain only numbers');
            shakeElement(document.querySelector('.otp-inputs'));
            return;
        }
        
        const email = document.getElementById('email').value;
        
        try {
            const csrfToken = getCSRFToken();
            
            // Add loading animation to OTP inputs
            otpDigits.forEach(digit => {
                digit.style.animation = 'otpLoading 1s ease infinite';
            });
            
            const response = await fetch('/email_otp_handler/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    action: 'verify_otp',
                    email: email,
                    otp: otpValue,
                    purpose: 'signup'
                })
            });
            
            // Remove loading animation
            otpDigits.forEach(digit => {
                digit.style.animation = '';
            });
            
            const data = await response.json();
            
            if (data.verified) {
                clearInterval(timerInterval);
                
                // Add success animation to OTP inputs
                otpDigits.forEach(digit => {
                    digit.style.animation = 'otpSuccess 0.6s ease';
                    setTimeout(() => {
                        digit.style.animation = '';
                    }, 600);
                });
                
                showToast('OTP verified successfully!', 'success');
                
                // Add verification success celebration
                createVerificationCelebration();
                
                setTimeout(() => {
                    navigateToStep(3);
                }, 800);
            } else {
                showToast(data.error || 'OTP verification failed', 'error');
                shakeElement(document.querySelector('.otp-inputs'));
                highlightInputError(document.querySelector('.otp-digit'));
                
                // Add error animation to OTP inputs
                otpDigits.forEach(digit => {
                    digit.style.animation = 'otpError 0.6s ease';
                    setTimeout(() => {
                        digit.style.animation = '';
                    }, 600);
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showToast('Failed to verify OTP. Please try again.', 'error');
            
            // Remove loading animation on error
            otpDigits.forEach(digit => {
                digit.style.animation = '';
            });
        }
    }
    
    resendOtpBtn.addEventListener('click', async function() {
        if (this.disabled) return;
        
        const originalText = this.innerHTML;
        this.innerHTML = '<div class="spinner"></div> Sending...';
        this.disabled = true;
        
        // Add click animation
        this.style.animation = 'resendClick 0.3s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
        
        try {
            const csrfToken = getCSRFToken();
            const email = document.getElementById('email').value;
            
            const response = await fetch('/email_otp_handler/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    action: 'send_otp',
                    email: email,
                    purpose: 'signup'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                otpTimer = 120;
                updateCountdown();
                startOTPTimer();
                
                // Reset OTP inputs with animation
                otpDigits.forEach((digit, index) => {
                    digit.style.animation = 'digitClear 0.3s ease';
                    setTimeout(() => {
                        digit.value = '';
                        digit.style.animation = '';
                    }, 300);
                });
                otpField.value = '';
                
                // Focus first input with animation
                setTimeout(() => {
                    otpDigits[0].focus();
                    otpDigits[0].parentElement.style.animation = 'firstInputFocus 0.6s ease';
                    setTimeout(() => {
                        otpDigits[0].parentElement.style.animation = '';
                    }, 600);
                }, 400);
                
                this.innerHTML = 'Code Sent!';
                this.style.background = 'linear-gradient(135deg, #00F5D4, #00C6FF)';
                this.style.color = '#0F172A';
                this.style.borderColor = 'transparent';
                
                showToast('New OTP code sent', 'success');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                    this.disabled = false;
                }, 3000);
            } else {
                showToast(data.error || 'Failed to resend OTP', 'error');
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Add error shake animation
                this.style.animation = 'shake 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            showToast('Failed to resend OTP', 'error');
            this.innerHTML = originalText;
            this.disabled = false;
        }
    });
    
    function createVerificationCelebration() {
        const otpContainer = document.querySelector('.otp-container');
        if (!otpContainer) return;
        
        // Create celebration particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            
            const size = 3 + Math.random() * 3;
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const duration = 800 + Math.random() * 400;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #00F5D4, #00C6FF);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 10;
            `;
            
            otpContainer.appendChild(particle);
            
            // Animate particle
            const keyframes = [
                {
                    transform: `translate(-50%, -50%) translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ];
            
            const options = {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            };
            
            particle.animate(keyframes, options).onfinish = () => particle.remove();
        }
    }
    
    function isOTPComplete() {
        let complete = true;
        otpDigits.forEach(digit => {
            if (!digit.value) complete = false;
        });
        return complete;
    }
    
    function updateOTPValue() {
        let otpValue = '';
        otpDigits.forEach(digit => {
            otpValue += digit.value;
        });
        otpField.value = otpValue;
    }
    
    function startOTPTimer() {
        clearInterval(timerInterval);
        
        // Reset timer circle
        if (timerCircle) {
            timerCircle.style.strokeDashoffset = '0';
            timerCircle.style.animation = 'timerCountdown 120s linear forwards';
        }
        
        timerInterval = setInterval(() => {
            otpTimer--;
            updateCountdown();
            
            if (otpTimer <= 0) {
                clearInterval(timerInterval);
                resendOtpBtn.disabled = false;
                countdownElement.textContent = '00:00';
                countdownElement.style.color = '#FF6B6B';
                
                // Add expired animation
                countdownElement.style.animation = 'timerExpired 0.6s ease infinite';
            } else if (otpTimer <= 30) {
                countdownElement.style.color = '#FF6B6B';
                
                // Add warning pulse animation
                if (otpTimer <= 10) {
                    countdownElement.style.animation = 'timerWarning 0.5s ease infinite';
                }
            }
        }, 1000);
    }
    
    function updateCountdown() {
        const minutes = Math.floor(otpTimer / 60);
        const seconds = otpTimer % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Add OTP animations
    const otpAnimations = document.createElement('style');
    otpAnimations.textContent = `
        @keyframes nextInputFocus {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes prevInputFocus {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
        }
        
        @keyframes digitInput {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes digitPaste {
            0%, 100% { background-color: #F2F5F9; }
            50% { background-color: rgba(0, 198, 255, 0.1); }
        }
        
        @keyframes firstInputFocus {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @keyframes digitClear {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes otpLoading {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        @keyframes otpSuccess {
            0%, 100% { 
                border-color: #E5E7EB;
                background-color: #F2F5F9;
            }
            50% { 
                border-color: #00F5D4;
                background-color: rgba(0, 245, 212, 0.1);
            }
        }
        
        @keyframes otpError {
            0%, 100% { 
                border-color: #E5E7EB;
                background-color: #F2F5F9;
            }
            50% { 
                border-color: #FF6B6B;
                background-color: rgba(255, 107, 107, 0.1);
            }
        }
        
        @keyframes resendClick {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
        }
        
        @keyframes timerExpired {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes timerWarning {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(otpAnimations);
    
    startOTPTimer();
}

function initTermsHandling() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');
    const acceptTerms = document.getElementById('acceptTerms');
    const termsCheckbox = document.getElementById('terms');
    const checkboxAnimation = document.querySelector('.checkbox-animation');
    
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Add modal open animation
        termsModal.style.animation = 'termsModalOpen 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            termsModal.style.animation = '';
        }, 400);
    });
    
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Add modal open animation
        termsModal.style.animation = 'termsModalOpen 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            termsModal.style.animation = '';
        }, 400);
    });
    
    closeTerms.addEventListener('click', closeTermsModal);
    termsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeTermsModal();
        }
    });
    
    acceptTerms.addEventListener('click', function() {
        termsCheckbox.checked = true;
        const termsContainer = document.getElementById('termsContainer');
        termsContainer.querySelector('.terms-checkbox').classList.remove('error');
        termsContainer.querySelector('.terms-error').classList.remove('visible');
        
        // Add checkbox check animation
        if (checkboxAnimation) {
            checkboxAnimation.style.animation = 'checkboxCheck 0.6s ease';
            setTimeout(() => {
                checkboxAnimation.style.animation = '';
            }, 600);
        }
        
        closeTermsModal();
        showToast('Terms accepted successfully', 'success');
    });
    
    // Add checkbox interaction
    termsCheckbox.addEventListener('change', function() {
        if (this.checked && checkboxAnimation) {
            checkboxAnimation.style.animation = 'checkboxCheck 0.6s ease';
            setTimeout(() => {
                checkboxAnimation.style.animation = '';
            }, 600);
        }
    });
    
    function closeTermsModal() {
        termsModal.style.animation = 'termsModalClose 0.3s ease';
        setTimeout(() => {
            termsModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            termsModal.style.animation = '';
        }, 300);
    }
    
    // Add terms modal animations
    const termsAnimations = document.createElement('style');
    termsAnimations.textContent = `
        @keyframes termsModalOpen {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes termsModalClose {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
        }
        
        @keyframes checkboxCheck {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            70% {
                opacity: 1;
                transform: scale(1.2);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(termsAnimations);
}

function initFormSubmission() {
    const form = document.getElementById('studentSignupForm');
    const submitBtn = document.getElementById('submitForm');
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep1()) return;
        if (!validateStep3()) return;
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner"></div> Processing...';
        submitBtn.disabled = true;
        
        // Add submission animation
        submitBtn.style.animation = 'submitProcessing 1s ease infinite';
        
        try {
            const formData = new FormData(form);
            const csrfToken = getCSRFToken();
            
            const response = await fetch('/student-signup/', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            
            // Remove processing animation
            submitBtn.style.animation = '';
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showToast('Registration successful! Redirecting to Face Capture...', 'success');
                
                // Add success celebration
                createSubmissionCelebration();
                
                // Redirect to face-capture page after successful registration
                setTimeout(() => {
                    // Show page transition
                    const overlay = document.querySelector('.page-transition-overlay');
                    overlay.style.opacity = '1';
                    
                    setTimeout(() => {
                        window.location.href = '/face-capture/';
                    }, 400);
                }, 1500);
            } else {
                showToast(data.error || 'Registration failed', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Add error animation
                submitBtn.style.animation = 'submitError 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    submitBtn.style.animation = '';
                }, 600);
                
                // Handle specific errors
                if (data.error && data.error.includes('email')) {
                    showValidationError('email_error', 'Email already registered');
                    highlightInputError(document.getElementById('email'));
                    navigateToStep(1);
                } else if (data.error && data.error.includes('OTP') || data.error.includes('verified')) {
                    showToast('OTP verification expired. Please restart registration.', 'error');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.animation = '';
        }
    });
    
    function createSubmissionCelebration() {
        const card = document.querySelector('.signup-card');
        if (!card) return;
        
        // Create celebration particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            
            const size = 4 + Math.random() * 4;
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const duration = 1000 + Math.random() * 500;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #00C6FF, #00F5D4, #8B5CF6);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
                filter: blur(${Math.random() * 2}px);
            `;
            
            card.appendChild(particle);
            
            // Animate particle
            const keyframes = [
                {
                    transform: `translate(-50%, -50%) translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ];
            
            const options = {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            };
            
            particle.animate(keyframes, options).onfinish = () => particle.remove();
        }
        
        // Add success glow to card
        card.style.animation = 'cardSuccessGlow 2s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 2000);
    }
    
    // Add submission animations
    const submissionAnimations = document.createElement('style');
    submissionAnimations.textContent = `
        @keyframes submitProcessing {
            0%, 100% { 
                box-shadow: 
                    0 8px 20px rgba(0, 198, 255, 0.2),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            50% { 
                box-shadow: 
                    0 8px 30px rgba(0, 198, 255, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.2),
                    0 0 40px rgba(0, 198, 255, 0.3);
            }
        }
        
        @keyframes submitError {
            0%, 100% { 
                background: linear-gradient(135deg, #00C6FF, #00F5D4, #8B5CF6);
            }
            50% { 
                background: linear-gradient(135deg, #FF6B6B, #FF9B6B);
            }
        }
        
        @keyframes cardSuccessGlow {
            0%, 100% { 
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.9),
                    0 0 0 1px rgba(0, 198, 255, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            50% { 
                box-shadow: 
                    0 20px 60px rgba(0, 198, 255, 0.3),
                    0 0 0 1px rgba(0, 198, 255, 0.8),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 80px rgba(0, 198, 255, 0.4);
            }
        }
    `;
    document.head.appendChild(submissionAnimations);
}

function initToastSystem() {
    // Enhanced toast system with premium animations
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v6z"/></svg>';
        if (type === 'success') icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
        if (type === 'error') icon = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v6z"/></svg>';
        
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
            
            // Add toast enter animation
            toast.style.animation = 'toastEnter 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            // Auto dismiss with exit animation
            setTimeout(() => {
                toast.style.animation = 'toastExit 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                setTimeout(() => toast.remove(), 400);
            }, 4500);
            
            // Add hover pause
            toast.addEventListener('mouseenter', () => {
                toast.style.animationPlayState = 'paused';
            });
            
            toast.addEventListener('mouseleave', () => {
                toast.style.animationPlayState = 'running';
            });
        }
        
        // Add toast animations
        const toastAnimations = document.createElement('style');
        toastAnimations.textContent = `
            @keyframes toastEnter {
                from { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes toastExit {
                to { 
                    transform: translateX(120%) scale(0.8); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(toastAnimations);
    };
}

function initInteractiveEffects() {
    const inputs = document.querySelectorAll('.input-field input, .input-field select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            
            // Add focus animation
            this.style.animation = 'inputFocus 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Add typing indicator
        let typingTimer;
        input.addEventListener('input', function() {
            clearTimeout(typingTimer);
            this.parentElement.classList.add('typing');
            typingTimer = setTimeout(() => {
                this.parentElement.classList.remove('typing');
            }, 1000);
        });
    });
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .modal-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
    
    // Add input focus animation
    const inputFocusAnimation = document.createElement('style');
    inputFocusAnimation.textContent = `
        @keyframes inputFocus {
            0%, 100% { 
                box-shadow: 
                    0 0 0 4px rgba(139, 92, 246, 0.15),
                    0 8px 25px rgba(139, 92, 246, 0.2);
            }
            50% { 
                box-shadow: 
                    0 0 0 4px rgba(139, 92, 246, 0.25),
                    0 12px 35px rgba(139, 92, 246, 0.3),
                    0 0 40px rgba(139, 92, 246, 0.15);
            }
        }
    `;
    document.head.appendChild(inputFocusAnimation);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

// Add all animation styles
const globalAnimations = document.createElement('style');
globalAnimations.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes logoClick {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .input-field.focused .input-icon {
        animation: iconFocus 0.3s ease;
    }
    
    @keyframes iconFocus {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(globalAnimations);