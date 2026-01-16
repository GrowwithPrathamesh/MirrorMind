// student_signup.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('MirrorMind Student Registration Initialized');
    
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
});

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

function initFormNavigation() {
    let currentStep = 1;
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressFill = document.getElementById('progressFill');
    
    function updateProgress(step) {
        // Updated for 3 steps instead of 4
        const progressPercentage = ((step - 1) / 2) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        progressSteps.forEach((stepEl, index) => {
            const stepNumber = index + 1;
            setTimeout(() => {
                if (stepNumber <= step) {
                    stepEl.classList.add('active');
                } else {
                    stepEl.classList.remove('active');
                }
            }, index * 100);
        });
    }
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                if (currentStep === 1 && nextStep === 2) {
                    sendOTPAndNavigate();
                } else {
                    navigateToStep(nextStep);
                }
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            navigateToStep(prevStep);
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
                navigateToStep(2);
                setTimeout(() => {
                    document.querySelector('.otp-digit[data-index="0"]').focus();
                }, 300);
                showToast('OTP sent to your email', 'success');
            } else {
                showToast(data.error || 'Failed to send OTP', 'error');
                continueBtn.innerHTML = originalText;
                continueBtn.disabled = false;
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
            });
        }
    });
    
    if (department) {
        department.addEventListener('change', function() {
            validateField(this);
        });
    }
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
    } else {
        hideValidationError(field.id + '_error');
        clearInputError(field);
    }
    
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
    }
}

function hideValidationError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.classList.remove('active');
    }
}

function highlightInputError(input) {
    input.style.borderColor = '#FF6B6B';
    input.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.1)';
    
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = '';
    
    input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
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
    });
    
    monthSelect.addEventListener('change', function() {
        viewingMonth = parseInt(this.value);
        renderCalendar();
    });
    
    prevYearBtn.addEventListener('click', () => {
        viewingYear--;
        yearSelect.value = viewingYear;
        renderCalendar();
    });
    
    nextYearBtn.addEventListener('click', () => {
        viewingYear++;
        yearSelect.value = viewingYear;
        renderCalendar();
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
    });
    
    clearDateBtn.addEventListener('click', () => {
        selectedDate = null;
        dobInput.value = '';
        dobInput.parentElement.classList.remove('has-age');
        renderCalendar();
    });
    
    selectDateBtn.addEventListener('click', () => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            dobInput.value = formattedDate;
            calculateAge(selectedDate);
            closeCalendarModal();
            hideValidationError('dob_error');
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
    }
    
    function closeCalendarModal() {
        calendarModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
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
            }
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    function selectDate(date) {
        selectedDate = date;
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
            passwordMatch.style.color = '#00F5D4';
            hideValidationError('confirm_password_error');
        } else {
            passwordMatch.innerHTML = '<svg class="match-icon" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg><span>Passwords don\'t match</span>';
            passwordMatch.style.color = '#FF6B6B';
            showValidationError('confirm_password_error', 'Passwords do not match');
        }
    });
}

function initOTPHandling() {
    let otpTimer = 120;
    let timerInterval;
    const otpDigits = document.querySelectorAll('.otp-digit');
    const otpField = document.getElementById('otp');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const countdownElement = document.getElementById('countdown');
    
    updateCountdown();
    
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 1 && index < otpDigits.length - 1) {
                otpDigits[index + 1].focus();
            }

            updateOTPValue();
            hideValidationError('otp_error');

            if (isOTPComplete()) {
                verifyOTP();
            }
        });

        
        digit.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpDigits[index - 1].focus();
            }
            
            if (e.key === 'Enter' && isOTPComplete()) {
                verifyOTP();
            }
            
            if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                setTimeout(() => {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    updateOTPValue();
                }, 10);
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
                    }
                });
                updateOTPValue();
                otpDigits[5].focus();
            }
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
            
            const data = await response.json();
            
            if (data.verified) {
                clearInterval(timerInterval);
                showToast('OTP verified successfully!', 'success');
                setTimeout(() => {
                    navigateToStep(3);
                }, 500);
            } else {
                showToast(data.error || 'OTP verification failed', 'error');
                shakeElement(document.querySelector('.otp-inputs'));
                highlightInputError(document.querySelector('.otp-digit'));
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showToast('Failed to verify OTP. Please try again.', 'error');
        }
    }
    
    resendOtpBtn.addEventListener('click', async function() {
        if (this.disabled) return;
        
        const originalText = this.innerHTML;
        this.innerHTML = '<div class="spinner"></div> Sending...';
        this.disabled = true;
        
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
                
                otpDigits.forEach(digit => digit.value = '');
                otpField.value = '';
                otpDigits[0].focus();
                
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
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            showToast('Failed to resend OTP', 'error');
            this.innerHTML = originalText;
            this.disabled = false;
        }
    });
    
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
    
    function updateCountdown() {
        const minutes = Math.floor(otpTimer / 60);
        const seconds = otpTimer % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    startOTPTimer();
}

function initTermsHandling() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');
    const acceptTerms = document.getElementById('acceptTerms');
    const termsCheckbox = document.getElementById('terms');
    
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.classList.add('no-scroll');
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
        closeTermsModal();
        showToast('Terms accepted successfully', 'success');
    });
    
    function closeTermsModal() {
        termsModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
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
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showToast('Registration successful! Redirecting to Face Capture...', 'success');
                
                // Redirect to face-capture page after successful registration
                setTimeout(() => {
                    window.location.href = '/face-capture/';
                }, 1500);
            } else {
                showToast(data.error || 'Registration failed', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
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
        }
    });
}

function initToastSystem() {
    // Toast system is already initialized
}

function showToast(message, type = 'info') {
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
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4500);
    }
}

function initInteractiveEffects() {
    const inputs = document.querySelectorAll('.input-field input, .input-field select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .modal-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

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

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);