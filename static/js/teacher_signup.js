document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Teacher Registration Initialized');
    
    // Initialize all functionality
    initParticlesBackground();
    initFormNavigation();
    initFormValidation();
    initPasswordToggle();
    initPasswordStrength();
    initOTPHandling();
    initToastSystem();
    initSuccessModal();
    
    // Add particles to background
    addParticles();
});

// Core State Variables
let currentStep = 1;
let emailForVerification = '';
let otpTimer = 300;
let otpTimerInterval;

// Particle Background
function initParticlesBackground() {
    addParticles();
}

function addParticles() {
    const particleLayer = document.querySelector('.particle-layer');
    if (!particleLayer) return;
    
    particleLayer.innerHTML = '';
    
    const particleCount = 30;
    
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

// Form Navigation
function initFormNavigation() {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    function navigateToStep(step) {
        document.querySelectorAll('.form-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });
        
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
            currentStep = step;
            
            stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            
            if (currentStep === 1) {
                if (validateStep1()) {
                    navigateToStep(nextStep);
                    showToast('Personal information saved successfully', 'success');
                }
            }
        });
    });
    
    // Previous button handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            navigateToStep(prevStep);
        });
    });
    
    // Send OTP button handler
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', async function() {
            if (validateStep2()) {
                const email = document.getElementById('email').value;
                emailForVerification = email;
                
                // Show loading state
                const originalText = sendOtpBtn.innerHTML;
                sendOtpBtn.innerHTML = '<div class="spinner"></div> Sending OTP...';
                sendOtpBtn.disabled = true;
                
                try {
                    // Call backend to send OTP
                    const response = await fetch('/teacher/send-otp/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCSRFToken()
                        },
                        body: JSON.stringify({ email: email })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Navigate to OTP step
                        navigateToStep(3);
                        showToast(`OTP sent to ${email}. Check your email.`, 'success');
                        
                        // Update verification email display
                        document.getElementById('verificationEmail').textContent = email;
                        
                        // Start OTP timer
                        startOTPTimer();
                        
                        // Focus first OTP digit
                        setTimeout(() => {
                            const firstDigit = document.querySelector('.otp-digit[data-index="0"]');
                            if (firstDigit) firstDigit.focus();
                        }, 100);
                    } else {
                        showToast(data.error || 'Failed to send OTP', 'error');
                    }
                } catch (error) {
                    console.error('Error sending OTP:', error);
                    showToast('Error sending OTP. Please try again.', 'error');
                } finally {
                    sendOtpBtn.innerHTML = originalText;
                    sendOtpBtn.disabled = false;
                }
            }
        });
    }
    
    window.navigateToStep = navigateToStep;
}

// Form Validation
function initFormValidation() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const teacherId = document.getElementById('teacherId');
    const email = document.getElementById('email');
    const department = document.getElementById('department');
    const institute = document.getElementById('institute');
    const qualification = document.getElementById('qualification');
    const experience = document.getElementById('experience');
    
    const inputs = [firstName, lastName, teacherId, email, department, institute];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
            });
        }
    });
    
    if (qualification) {
        qualification.addEventListener('change', function() {
            validateField(this);
        });
    }
    
    if (experience) {
        experience.addEventListener('change', function() {
            validateField(this);
        });
    }
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    switch (field.id) {
        case 'firstName':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'First name is required';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'First name must be at least 2 characters';
            }
            break;
            
        case 'lastName':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Last name is required';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Last name must be at least 2 characters';
            }
            break;
            
        case 'teacherId':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Teacher ID is required';
            } else if (field.value.trim().length < 3) {
                isValid = false;
                errorMessage = 'Teacher ID must be at least 3 characters';
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
            
        case 'department':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Department/Subject is required';
            }
            break;
            
        case 'institute':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Institute name is required';
            }
            break;
            
        case 'qualification':
        case 'experience':
            if (!field.value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;
    }
    
    if (!isValid) {
        showValidationError(field.id + '_error', errorMessage);
        highlightInputError(field);
    } else {
        hideValidationError(field.id + '_error');
        clearInputError(field);
    }
    
    return isValid;
}

function validateStep1() {
    let isValid = true;
    const fields = [
        'firstName',
        'lastName',
        'teacherId',
        'email',
        'department',
        'institute',
        'qualification',
        'experience'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
    }
    
    return isValid;
}

function validateStep2() {
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
    
    if (!isValid) {
        showToast('Please fix all errors before proceeding', 'error');
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
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
}

function getPasswordErrorMessage(password) {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
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

// OTP Handling
function initOTPHandling() {
    const otpDigits = document.querySelectorAll('.otp-digit');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    
    // Auto-focus and auto-tab for OTP digits
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 1) {
                this.classList.add('filled');
                this.classList.remove('error');
                
                // Auto-focus next digit
                if (index < otpDigits.length - 1) {
                    otpDigits[index + 1].focus();
                } else {
                    // Auto-verify when all digits are filled
                    autoVerifyOTP();
                }
            } else {
                this.classList.remove('filled');
            }
            
            hideValidationError('otp_error');
        });
        
        digit.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpDigits[index - 1].focus();
                otpDigits[index - 1].value = '';
                otpDigits[index - 1].classList.remove('filled');
            }
        });
        
        digit.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = pastedData.replace(/[^0-9]/g, '');
            
            if (numbers.length === 6) {
                numbers.split('').forEach((num, idx) => {
                    if (idx < otpDigits.length) {
                        otpDigits[idx].value = num;
                        otpDigits[idx].classList.add('filled');
                        otpDigits[idx].classList.remove('error');
                    }
                });
                
                otpDigits[5].focus();
                setTimeout(() => autoVerifyOTP(), 100);
            }
        });
    });
    
    // Verify OTP button
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', function() {
            verifyOTP();
        });
    }
    
    // Resend OTP button
    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', async function() {
            if (this.disabled) return;
            
            if (!emailForVerification || !validateEmail(emailForVerification)) {
                showToast('Please enter a valid email address first', 'warning');
                return;
            }
            
            this.disabled = true;
            this.innerHTML = '<div class="spinner"></div> Sending...';
            
            try {
                // Call backend to resend OTP
                const response = await fetch('/teacher/send-otp/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify({ email: emailForVerification })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast('New OTP sent successfully!', 'success');
                    startOTPTimer();
                    
                    // Reset OTP fields
                    resetOTPFields();
                    
                    setTimeout(() => {
                        this.innerHTML = 'Resend Code';
                        this.disabled = true;
                    }, 3000);
                } else {
                    this.innerHTML = 'Resend Code';
                    showToast(data.error || 'Failed to resend OTP', 'error');
                }
            } catch (error) {
                this.innerHTML = 'Resend Code';
                console.error('Error resending OTP:', error);
                showToast('Failed to resend OTP. Please try again.', 'error');
            }
        });
    }
    
    function getOTPValue() {
        let otpValue = '';
        otpDigits.forEach(digit => {
            otpValue += digit.value;
        });
        return otpValue;
    }
    
    async function autoVerifyOTP() {
        const otpValue = getOTPValue();
        if (otpValue.length === 6) {
            await verifyOTP();
        }
    }
    
    async function verifyOTP() {
        const otpValue = getOTPValue();
        const otpErrorElement = document.getElementById('otp_error');
        const verificationResult = document.getElementById('otpVerificationResult');
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        
        if (otpValue.length !== 6) {
            showValidationError('otp_error', 'Please enter all 6 digits');
            shakeOTPFields();
            return false;
        }
        
        // Show loading
        const originalText = verifyOtpBtn.innerHTML;
        verifyOtpBtn.innerHTML = '<div class="spinner"></div> Verifying...';
        verifyOtpBtn.disabled = true;
        
        try {
            // Call backend to verify OTP
            const response = await fetch('/teacher/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ 
                    otp: otpValue, 
                    email: emailForVerification 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success - Email verified
                hideValidationError('otp_error');
                verificationResult.classList.remove('hidden');
                
                otpDigits.forEach(digit => {
                    digit.disabled = true;
                    digit.classList.add('filled');
                });
                
                verifyOtpBtn.disabled = true;
                
                // Set OTP in hidden field for form submission
                document.getElementById('otp').value = otpValue;
                
                clearInterval(otpTimerInterval);
                
                // Show success toast
                showToast('Email verified successfully! Creating account...', 'success');
                
                // Submit the form
                setTimeout(() => {
                    submitRegistrationForm();
                }, 1500);
                
                return true;
            } else {
                // Incorrect OTP
                showValidationError('otp_error', data.error || 'Invalid verification code');
                shakeOTPFields();
                resetOTPFields();
                showToast(data.error || 'Invalid verification code', 'error');
                
                verifyOtpBtn.innerHTML = originalText;
                verifyOtpBtn.disabled = false;
                return false;
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showValidationError('otp_error', 'Error verifying OTP');
            verifyOtpBtn.innerHTML = originalText;
            verifyOtpBtn.disabled = false;
            return false;
        }
    }
    
    function resetOTPFields() {
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled', 'error');
            digit.disabled = false;
        });
        setTimeout(() => {
            const firstDigit = document.querySelector('.otp-digit[data-index="0"]');
            if (firstDigit) firstDigit.focus();
        }, 50);
    }
    
    function shakeOTPFields() {
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach(digit => {
            digit.classList.add('error');
        });
        
        setTimeout(() => {
            otpDigits.forEach(digit => {
                digit.classList.remove('error');
            });
        }, 500);
    }
}

// OTP Timer Functions
function startOTPTimer() {
    const countdownElement = document.getElementById('otpCountdown');
    const resendBtn = document.getElementById('resendOtpBtn');
    
    clearInterval(otpTimerInterval);
    
    otpTimer = 300;
    updateOTPTimerDisplay();
    
    resendBtn.disabled = true;
    
    otpTimerInterval = setInterval(() => {
        otpTimer--;
        updateOTPTimerDisplay();
        
        if (otpTimer <= 0) {
            clearInterval(otpTimerInterval);
            resendBtn.disabled = false;
            countdownElement.textContent = '00:00';
            countdownElement.style.color = '#EF4444';
            showToast('OTP has expired. Please request a new code.', 'warning');
        } else if (otpTimer <= 60) {
            countdownElement.style.color = '#EF4444';
        }
    }, 1000);
}

function updateOTPTimerDisplay() {
    const countdownElement = document.getElementById('otpCountdown');
    const minutes = Math.floor(otpTimer / 60);
    const seconds = otpTimer % 60;
    countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (otpTimer <= 60) {
        countdownElement.style.color = '#EF4444';
    } else {
        countdownElement.style.color = '';
    }
}

// Password Toggle
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.setAttribute('viewBox', '0 0 24 24');
                eyeIcon.innerHTML = '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4.5 12 4.5c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97A11.892 11.892 0 0 0 1 11.5c2.73 4.39 7 7 11 7 1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33a2.97 2.97 0 0 0-2.64-2.64l2.64 2.64z"/>';
            } else {
                passwordField.type = 'password';
                eyeIcon.setAttribute('viewBox', '0 0 24 24');
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            }
            
            this.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        });
    });
}

// Password Strength
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBar = passwordStrength.querySelector('.strength-bar');
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
        } else if (strength === 3) {
            strengthBar.classList.add('medium');
            feedback = 'Medium strength';
        } else {
            strengthBar.classList.add('strong');
            feedback = 'Strong password';
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
            passwordMatch.style.color = '#059669';
            hideValidationError('confirm_password_error');
        } else {
            passwordMatch.innerHTML = '<svg class="match-icon" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg><span>Passwords don\'t match</span>';
            passwordMatch.style.color = '#EF4444';
            showValidationError('confirm_password_error', 'Passwords do not match');
        }
    });
}

// Form Submission
async function submitRegistrationForm() {
    const form = document.getElementById('teacherSignupForm');
    const submitBtn = document.querySelector('.btn-verify-otp');
    
    if (!form) return;
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner"></div> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // Create FormData object
        const formData = new FormData(form);
        
        // Submit the form
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccessModal();
        } else {
            showToast(data.error || 'Registration failed', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Navigate back to step 2 to fix errors
            navigateToStep(2);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Toast System
function initToastSystem() {
    // Toast container is already in HTML
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
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4500);
    }
}

// Success Modal
function initSuccessModal() {
    const successModal = document.getElementById('successModal');
    const goToLoginBtn = document.getElementById('goToLogin');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    
    function showSuccessModal() {
        successModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }
    
    function closeSuccessModal() {
        successModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            closeSuccessModal();
            setTimeout(() => {
                window.location.href = '/teacher/login/';
            }, 300);
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeSuccessModal);
    }
    
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
    
    window.showSuccessModal = showSuccessModal;
}

// Utility Functions
function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfToken ? csrfToken.value : '';
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}