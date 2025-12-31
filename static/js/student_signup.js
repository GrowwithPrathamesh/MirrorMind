// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Student Registration Initialized');
    
    // Initialize all components
    initParticlesBackground();
    initFormNavigation();
    initFormValidation();
    initCalendarPicker();
    initParentSectionLogic();
    initPasswordToggle();
    initPasswordStrength();
    initFaceCapture();
    initOTPHandling();
    initTermsHandling();
    initModalHandling();
    initToastSystem();
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

// Form navigation
function initFormNavigation() {
    let currentStep = 1;
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                navigateToStep(nextStep);
            }
        });
    });
    
    // Previous button handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            navigateToStep(prevStep);
        });
    });
    
    // Navigate to specific step
    function navigateToStep(step) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show new step
        document.getElementById(`step${step}`).classList.add('active');
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
        
        // Update current step
        currentStep = step;
        
        // Special handling for specific steps
        if (step === 3) {
            // Auto-focus first OTP digit
            document.querySelector('.otp-digit[data-index="0"]').focus();
            // Send OTP automatically (simulated)
            sendOTP();
        }
        
        if (step === 4) {
            // Focus password field
            document.getElementById('password').focus();
        }
        
        // Scroll to top of form
        document.querySelector('.signup-card').scrollTop = 0;
    }
    
    // Validate current step
    function validateStep(step) {
        switch(step) {
            case 1:
                return validateStep1();
            case 2:
                return validateStep2();
            case 3:
                return validateStep3();
            case 4:
                return validateStep4();
            default:
                return true;
        }
    }
    
    // Expose navigateToStep for other functions
    window.navigateToStep = navigateToStep;
}

// Form validation
function initFormValidation() {
    // Real-time validation for step 1 fields
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const email = document.getElementById('email');
    const enrollment = document.getElementById('enrollment_no');
    const department = document.getElementById('department');
    const dob = document.getElementById('dob');
    
    // Add input event listeners for real-time validation
    [firstName, lastName, email, enrollment, dob].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearInputError(this);
            });
        }
    });
    
    if (department) {
        department.addEventListener('change', function() {
            validateField(this);
        });
    }
}

// Validate individual field
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
        highlightInputError(field, errorMessage);
    } else {
        clearInputError(field);
    }
    
    return isValid;
}

// Validate step 1
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
    
    // Check if parent section is active
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

// Validate step 2
function validateStep2() {
    const faceCaptured = document.getElementById('captureSuccess').style.display === 'flex';
    
    if (!faceCaptured) {
        showToast('Please capture your face before continuing', 'error');
        shakeElement(document.getElementById('step2'));
        return false;
    }
    
    return true;
}

// Validate step 3
function validateStep3() {
    const otpValue = document.getElementById('otp').value;
    
    if (otpValue.length !== 4) {
        showToast('Please enter the complete 4-digit code', 'error');
        shakeElement(document.querySelector('.otp-inputs'));
        return false;
    }
    
    // Simulate OTP verification
    return verifyOTP(otpValue);
}

// Validate step 4
function validateStep4() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const termsCheckbox = document.getElementById('terms');
    let isValid = true;
    
    // Validate password
    if (!password.value) {
        highlightInputError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        highlightInputError(password, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword.value) {
        highlightInputError(confirmPassword, 'Please confirm your password');
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        highlightInputError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms
    if (!termsCheckbox.checked) {
        const termsContainer = document.getElementById('termsContainer');
        termsContainer.querySelector('.terms-checkbox').classList.add('error');
        termsContainer.querySelector('.terms-error').classList.add('visible');
        shakeElement(termsContainer);
        isValid = false;
    }
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
    }
    
    return isValid;
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Highlight input error
function highlightInputError(input, message) {
    input.style.borderColor = '#FF6B6B';
    input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#FF6B6B';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.textAlign = 'left';
    
    input.parentElement.appendChild(errorDiv);
}

// Clear input error
function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    // Remove error message
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize calendar picker
function initCalendarPicker() {
    const dobInput = document.getElementById('dob');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalendar = document.getElementById('closeCalendar');
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const clearDateBtn = document.getElementById('clearDate');
    const selectDateBtn = document.getElementById('selectDate');
    
    let currentDate = new Date();
    let selectedDate = null;
    let viewingDate = new Date();
    
    // Open calendar when DOB input is clicked
    dobInput.addEventListener('click', openCalendar);
    
    // Close calendar
    closeCalendar.addEventListener('click', closeCalendarModal);
    calendarModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCalendarModal();
        }
    });
    
    // Navigation
    prevMonthBtn.addEventListener('click', () => {
        viewingDate.setMonth(viewingDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        viewingDate.setMonth(viewingDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Clear date
    clearDateBtn.addEventListener('click', () => {
        selectedDate = null;
        dobInput.value = '';
        dobInput.parentElement.classList.remove('has-age');
        renderCalendar();
    });
    
    // Select date
    selectDateBtn.addEventListener('click', () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            dobInput.value = formattedDate;
            calculateAge(selectedDate);
            closeCalendarModal();
        }
    });
    
    // Open calendar function
    function openCalendar() {
        viewingDate = new Date();
        if (dobInput.value) {
            selectedDate = parseDate(dobInput.value);
            if (selectedDate) {
                viewingDate = new Date(selectedDate);
            }
        }
        renderCalendar();
        calendarModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }
    
    // Close calendar function
    function closeCalendarModal() {
        calendarModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    // Render calendar
    function renderCalendar() {
        const year = viewingDate.getFullYear();
        const month = viewingDate.getMonth();
        
        // Update month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Clear previous calendar days
        calendarDays.innerHTML = '';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'disabled';
            calendarDays.appendChild(emptyCell);
        }
        
        // Add days of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);
            
            // Disable future dates
            if (cellDate > today) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.addEventListener('click', () => selectDate(cellDate));
                
                // Highlight selected date
                if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
                    dayCell.classList.add('selected');
                }
                
                // Highlight today
                if (cellDate.getTime() === today.getTime()) {
                    dayCell.classList.add('today');
                }
            }
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    // Select date function
    function selectDate(date) {
        selectedDate = date;
        renderCalendar();
    }
    
    // Format date as DD/MM/YYYY
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Parse date from DD/MM/YYYY format
    function parseDate(dateString) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    }
    
    // Initial render
    renderCalendar();
}

// Calculate age from DOB
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
    
    // Show/hide parent section based on age
    const parentSection = document.getElementById('parentSection');
    if (age < 10) {
        parentSection.classList.add('active');
        // Make parent fields required
        ['parent_name', 'parent_email', 'parent_mobile'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = true;
                field.disabled = false;
            }
        });
    } else {
        parentSection.classList.remove('active');
        // Make parent fields not required
        ['parent_name', 'parent_email', 'parent_mobile'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = false;
                field.disabled = true;
                field.value = '';
                clearInputError(field);
            }
        });
    }
    
    return age;
}

// Initialize parent section logic
function initParentSectionLogic() {
    // Already handled in calculateAge function
}

// Password toggle functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
            
            // Animate toggle
            this.style.transform = 'translateY(-50%) scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        });
    });
}

// Password strength indicator
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
            return;
        }
        
        passwordStrength.classList.add('visible');
        
        // Calculate strength
        let strength = 0;
        let feedback = '';
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update UI
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
    });
    
    // Password match indicator
    confirmPassword.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirm = this.value;
        
        if (confirm.length === 0) {
            passwordMatch.classList.remove('visible');
            return;
        }
        
        passwordMatch.classList.add('visible');
        
        if (password === confirm && password.length > 0) {
            passwordMatch.innerHTML = '<i class="fas fa-check-circle"></i><span>Passwords match</span>';
            passwordMatch.style.color = '#00F5D4';
        } else {
            passwordMatch.innerHTML = '<i class="fas fa-times-circle"></i><span>Passwords don\'t match</span>';
            passwordMatch.style.color = '#FF6B6B';
        }
    });
}

// Face capture simulation
function initFaceCapture() {
    const captureBtn = document.getElementById('captureFaceBtn');
    const webcamPreview = document.getElementById('webcamPreview');
    const captureSuccess = document.getElementById('captureSuccess');
    const continueAfterCapture = document.getElementById('continueAfterCapture');
    
    if (!captureBtn) return;
    
    captureBtn.addEventListener('click', function() {
        // Simulate webcam activation
        webcamPreview.classList.add('active');
        
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<div class="spinner"></div> Capturing...';
        this.disabled = true;
        
        // Simulate liveness detection delay
        setTimeout(() => {
            // Show success animation
            captureSuccess.style.display = 'flex';
            
            // Reset button
            this.innerHTML = originalText;
            this.classList.add('captured');
            this.style.background = 'linear-gradient(135deg, #00F5D4, #00C6FF)';
            this.disabled = false;
            
            // Enable continue button
            continueAfterCapture.disabled = false;
            
            // Simulate a flash effect
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            flash.style.borderRadius = '20px';
            flash.style.animation = 'fadeIn 0.2s ease-out forwards';
            flash.style.zIndex = '1';
            webcamPreview.appendChild(flash);
            
            setTimeout(() => {
                flash.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => flash.remove(), 300);
            }, 200);
            
            showToast('Face captured successfully! Liveness detected.', 'success');
        }, 2000);
    });
}

// OTP handling
function initOTPHandling() {
    let otpTimer = 120; // 2 minutes in seconds
    let timerInterval;
    const otpDigits = document.querySelectorAll('.otp-digit');
    const otpField = document.getElementById('otp');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const countdownElement = document.getElementById('countdown');
    
    // Initialize OTP timer
    updateCountdown();
    
    // OTP input handling
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function() {
            // Move to next input if current is filled
            if (this.value.length === 1 && index < otpDigits.length - 1) {
                otpDigits[index + 1].focus();
            }
            
            updateOTPValue();
        });
        
        digit.addEventListener('keydown', function(e) {
            // Move to previous input on backspace if current is empty
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpDigits[index - 1].focus();
            }
        });
    });
    
    // OTP verification
    verifyOtpBtn.addEventListener('click', function() {
        const otpValue = otpField.value;
        
        if (otpValue.length !== 4) {
            showToast('Please enter the complete 4-digit code', 'error');
            shakeElement(this);
            return;
        }
        
        // Show loading state
        const originalText = this.querySelector('span').textContent;
        this.querySelector('span').textContent = 'Verifying...';
        const spinner = this.querySelector('.spinner');
        spinner.classList.remove('hidden');
        this.disabled = true;
        
        // Simulate verification delay
        setTimeout(() => {
            if (verifyOTP(otpValue)) {
                // Navigate to next step
                navigateToStep(4);
                
                // Reset button
                this.querySelector('span').textContent = originalText;
                spinner.classList.add('hidden');
                this.disabled = false;
            } else {
                // Show error
                showToast('Invalid OTP code. Please try again.', 'error');
                shakeElement(document.querySelector('.otp-inputs'));
                
                // Reset OTP fields
                otpDigits.forEach(digit => {
                    digit.value = '';
                    digit.classList.add('shake');
                    setTimeout(() => digit.classList.remove('shake'), 600);
                });
                otpField.value = '';
                otpDigits[0].focus();
                
                // Reset button
                this.querySelector('span').textContent = originalText;
                spinner.classList.add('hidden');
                this.disabled = false;
            }
        }, 1500);
    });
    
    // Resend OTP
    resendOtpBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Reset and restart timer
        otpTimer = 120;
        updateCountdown();
        startOTPTimer();
        
        // Reset OTP fields
        otpDigits.forEach(digit => digit.value = '');
        otpField.value = '';
        otpDigits[0].focus();
        
        // Disable button
        this.disabled = true;
        this.textContent = 'Code Sent!';
        this.style.background = 'linear-gradient(135deg, #00F5D4, #00C6FF)';
        this.style.color = '#0F172A';
        this.style.borderColor = 'transparent';
        
        // Send new OTP
        sendOTP();
        
        showToast('New OTP code sent to your email', 'success');
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.textContent = 'Resend Code';
            this.style.background = '';
            this.style.color = '';
            this.style.borderColor = '';
        }, 3000);
    });
    
    // Send OTP (simulated)
    // Send OTP (simulated)
    function sendOTP() {

        if (window.calculatedAge < 10) {
            showToast(
                "Verification code has been sent to your parent/guardian’s email.",
                "info"
            );
        } else {
            showToast(
                "Verification code has been sent to your email.",
                "info"
            );
        }

        startOTPTimer();
    }

    
    // Verify OTP (simulated - always returns true for demo)
    function verifyOTP(otp) {
        // For demo purposes, accept any 4-digit code
        // In production, this would make an API call
        return otp.length === 4 && /^\d{4}$/.test(otp);
    }
    
    // Update OTP value from digits
    function updateOTPValue() {
        let otpValue = '';
        otpDigits.forEach(digit => {
            otpValue += digit.value;
        });
        otpField.value = otpValue;
    }
    
    // Start OTP timer
    function startOTPTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            otpTimer--;
            updateCountdown();
            
            if (otpTimer <= 0) {
                clearInterval(timerInterval);
                resendOtpBtn.disabled = false;
                countdownElement.textContent = '00:00';
                countdownElement.style.color = '#FF6B6B';
            } else if (otpTimer <= 30) {
                countdownElement.style.color = '#FF6B6B';
            }
        }, 1000);
    }
    
    // Update countdown display
    function updateCountdown() {
        const minutes = Math.floor(otpTimer / 60);
        const seconds = otpTimer % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Initialize timer
    startOTPTimer();
}

// Terms handling
function initTermsHandling() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');
    const acceptTerms = document.getElementById('acceptTerms');
    const termsCheckbox = document.getElementById('terms');
    
    // Open terms modal
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    
    // Open privacy modal (same modal for demo)
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    
    // Close terms modal
    closeTerms.addEventListener('click', closeTermsModal);
    termsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeTermsModal();
        }
    });
    
    // Accept terms
    acceptTerms.addEventListener('click', function() {
        termsCheckbox.checked = true;
        const termsContainer = document.getElementById('termsContainer');
        termsContainer.querySelector('.terms-checkbox').classList.remove('error');
        termsContainer.querySelector('.terms-error').classList.remove('visible');
        closeTermsModal();
        showToast('Terms accepted successfully', 'success');
    });
    
    function closeTermsModal() {
        termsModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Modal handling
function initModalHandling() {
    const closeModalBtn = document.getElementById('closeModal');
    const goToDashboardBtn = document.getElementById('goToDashboard');
    const successModal = document.getElementById('successModal');
    
    // Close modal button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideModal('successModal');
        });
    }
    
    // Go to dashboard button
    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', function() {
            showToast('Redirecting to dashboard...', 'info');
            // In production: window.location.href = '/dashboard';
            setTimeout(() => {
                hideModal('successModal');
                // Reset form
                document.getElementById('studentSignupForm').reset();
                navigateToStep(1);
            }, 1000);
        });
    }
    
    // Close modal on outside click
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal('successModal');
            }
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                hideModal(modal.id);
            });
        }
    });
}

// Show success modal
function showSuccessModal(firstName) {
    const modal = document.getElementById('successModal');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (modal && welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${firstName}!`;
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
        
        showToast('Registration successful!', 'success');
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// Form submission
function initFormSubmission() {
    const form = document.getElementById('studentSignupForm');
    const submitBtn = document.getElementById('submitForm');
    
    if (!form || !submitBtn) return;
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateStep4()) {
            return;
        }
        
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<div class="spinner"></div> Processing...';
        this.disabled = true;
        
        // Collect form data
        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            enrollment_no: document.getElementById('enrollment_no').value,
            department: document.getElementById('department').value,
            dob: document.getElementById('dob').value,
            password: document.getElementById('password').value,
            terms_accepted: document.getElementById('terms').checked
        };
        
        // Add parent data if applicable
        const parentSection = document.getElementById('parentSection');
        if (parentSection.classList.contains('active')) {
            formData.parent_name = document.getElementById('parent_name').value;
            formData.parent_email = document.getElementById('parent_email').value;
            formData.parent_mobile = document.getElementById('parent_mobile').value;
        }
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            this.innerHTML = originalText;
            this.disabled = false;
            
            // Show success modal
            showSuccessModal(formData.first_name);
            
            // Log form data (in production, this would be sent to server)
            console.log('Form submission data:', formData);
            
            // Here you would typically make an AJAX call to Django backend
            // Example:
            /*
            fetch('/api/student/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessModal(formData.first_name);
                } else {
                    showToast(data.error || 'Registration failed', 'error');
                }
            })
            .catch(error => {
                showToast('Network error. Please try again.', 'error');
            });
            */
            
        }, 2000);
    });
}

// Get CSRF token for Django
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

// Toast notification system
function initToastSystem() {
    // Toast container already exists in HTML
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} toast-icon"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">×</button>
    `;
    
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        
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

// Interactive effects
function initInteractiveEffects() {
    // Input focus effects
    const inputs = document.querySelectorAll('.input-with-icon input, .input-with-icon select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .modal-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    // Initialize form submission
    initFormSubmission();
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
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Shake element animation
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
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
    console.error('Registration page error:', e.error);
    // Fallback for any animation errors
    document.body.classList.add('animations-disabled');
});

// Add fadeOut animation for flash effect
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeStyle);



function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    document.getElementById("toastContainer").appendChild(toast);

    setTimeout(() => toast.remove(), 4500);
}