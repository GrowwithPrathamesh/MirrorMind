// Page Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
            initLiveClass();
        }, 600);
    }, 1500);
});

// Initialize Live Class
function initLiveClass() {
    initClassTimer();
    initVideoControls();
    initAttendanceCounters();
    initEmotionChart();
    initChatSystem();
    initActionButtons();
    initConfirmationModal();
    initRealTimeUpdates();
    initToastSystem();
}

// Class Timer
function initClassTimer() {
    const timerElement = document.getElementById('classTimer');
    const modalDuration = document.getElementById('modalDuration');
    let seconds = 0;
    
    function updateTimer() {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            timerElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            modalDuration.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            modalDuration.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    // Start timer
    setInterval(updateTimer, 1000);
}

// Video Controls
function initVideoControls() {
    const videoContainer = document.getElementById('videoContainer');
    const toggleVideoBtn = document.getElementById('toggleVideo');
    const toggleAudioBtn = document.getElementById('toggleAudio');
    const screenShareBtn = document.getElementById('screenShare');
    const recordBtn = document.getElementById('recordClass');
    
    let videoActive = true;
    let audioActive = true;
    let screenSharing = false;
    let recording = false;
    
    // Toggle Video
    toggleVideoBtn.addEventListener('click', function() {
        videoActive = !videoActive;
        const icon = this.querySelector('i');
        
        if (videoActive) {
            icon.className = 'fas fa-video';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            showToast('Video turned on', 'success');
        } else {
            icon.className = 'fas fa-video-slash';
            this.style.background = 'rgba(245, 101, 101, 0.2)';
            showToast('Video turned off', 'warning');
        }
        
        // Add animation effect
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Toggle Audio
    toggleAudioBtn.addEventListener('click', function() {
        audioActive = !audioActive;
        const icon = this.querySelector('i');
        
        if (audioActive) {
            icon.className = 'fas fa-microphone';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            showToast('Microphone turned on', 'success');
        } else {
            icon.className = 'fas fa-microphone-slash';
            this.style.background = 'rgba(245, 101, 101, 0.2)';
            showToast('Microphone turned off', 'warning');
        }
        
        // Add animation effect
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Screen Share
    screenShareBtn.addEventListener('click', function() {
        screenSharing = !screenSharing;
        
        if (screenSharing) {
            this.classList.add('active');
            showToast('Screen sharing started', 'success');
        } else {
            this.classList.remove('active');
            showToast('Screen sharing stopped', 'warning');
        }
        
        // Add ripple effect
        createRippleEffect(this);
    });
    
    // Record Class
    recordBtn.addEventListener('click', function() {
        recording = !recording;
        const indicator = this.querySelector('.record-indicator');
        
        if (recording) {
            indicator.style.animation = 'pulse 1.5s infinite';
            this.style.background = 'rgba(245, 101, 101, 0.4)';
            showToast('Recording started', 'danger');
        } else {
            indicator.style.animation = 'none';
            this.style.background = 'rgba(245, 101, 101, 0.2)';
            showToast('Recording stopped', 'info');
        }
        
        // Add animation effect
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Video container hover effect
    videoContainer.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        this.style.transform = 'translateY(-4px)';
    });
    
    videoContainer.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
        this.style.transform = '';
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = '0px';
    ripple.style.top = '0px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(function() {
        if (ripple.parentNode === element) {
            ripple.remove();
        }
    }, 600);
}

// Attendance Counters
function initAttendanceCounters() {
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const lateCount = document.getElementById('lateCount');
    
    // Animate counters
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
    
    // Initial animation
    setTimeout(function() {
        animateCounter(presentCount, 35);
        animateCounter(absentCount, 2);
        animateCounter(lateCount, 1);
    }, 1000);
}

// Emotion Chart
function initEmotionChart() {
    const canvas = document.getElementById('emotionChart');
    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['Focused', 'Neutral', 'Bored', 'Happy'],
        datasets: [{
            data: [42, 35, 18, 5],
            backgroundColor: [
                'rgba(28, 167, 236, 0.8)',
                'rgba(107, 114, 128, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(72, 187, 120, 0.8)'
            ],
            borderColor: [
                'rgba(28, 167, 236, 1)',
                'rgba(107, 114, 128, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(72, 187, 120, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 15
        }]
    };
    
    // Draw animated pie chart
    drawAnimatedPieChart(ctx, data);
}

function drawAnimatedPieChart(ctx, data) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    let startAngle = 0;
    const animationDuration = 1500;
    const startTime = Date.now();
    
    function animate() {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        let animatedStartAngle = 0;
        
        // Draw each segment with animation
        data.datasets[0].data.forEach(function(value, index) {
            const sliceAngle = (2 * Math.PI * value) / total;
            const animatedAngle = sliceAngle * progress;
            
            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, animatedStartAngle, animatedStartAngle + animatedAngle);
            ctx.closePath();
            
            // Fill and stroke
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fill();
            ctx.strokeStyle = data.datasets[0].borderColor[index];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add glow for focused segment
            if (index === 0) {
                ctx.save();
                ctx.shadowColor = 'rgba(28, 167, 236, 0.5)';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
            }
            
            animatedStartAngle += animatedAngle;
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = '#F5F7FA';
        ctx.fill();
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Chat System
function initChatSystem() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Sample student names for random messages
    const students = ['Alex Morgan', 'Sarah Chen', 'James Wilson', 'Maya Patel', 'David Kim'];
    const messages = [
        'Great explanation!',
        'Could you repeat that?',
        'I have a question about this topic',
        'This makes sense now, thank you!',
        'What are the prerequisites for next class?',
        'Can you share the slides?',
        'Very interesting topic!',
        'I need help with the assignment',
        'When is the due date?',
        'Thanks for the clarification'
    ];
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('teacher', 'Dr. Chen', message);
            chatInput.value = '';
            
            // Auto-scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate student response after delay
            setTimeout(simulateStudentResponse, 2000 + Math.random() * 3000);
        }
    }
    
    function simulateStudentResponse() {
        const student = students[Math.floor(Math.random() * students.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        // Show typing indicator
        typingIndicator.style.display = 'flex';
        
        setTimeout(function() {
            typingIndicator.style.display = 'none';
            addMessage('student', student, message);
            
            // Occasionally add AI system message
            if (Math.random() > 0.7) {
                setTimeout(function() {
                    addSystemMessage('AI detected increased engagement during discussion');
                }, 1000);
            }
        }, 1500 + Math.random() * 2000);
    }
    
    function addMessage(type, sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'teacher') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=Dr+Chen&background=7C3AED&color=fff" alt="${sender}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender">${sender}</span>
                        <span class="time">${getCurrentTime()}</span>
                    </div>
                    <div class="message-text">${text}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(sender)}&background=1CA7EC&color=fff" alt="${sender}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender">${sender}</span>
                        <span class="time">${getCurrentTime()}</span>
                    </div>
                    <div class="message-text">${text}</div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        
        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <i class="fas fa-info-circle"></i>
                    ${text}
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Initialize with a few sample messages
    setTimeout(function() {
        simulateStudentResponse();
    }, 3000);
}

// Action Buttons
function initActionButtons() {
    const muteAllBtn = document.getElementById('muteAllBtn');
    const takeAttendanceBtn = document.getElementById('takeAttendanceBtn');
    const shareScreenBtn = document.getElementById('shareScreenBtn');
    const endClassActionBtn = document.getElementById('endClassActionBtn');
    
    // Mute All
    muteAllBtn.addEventListener('click', function() {
        const originalText = this.querySelector('.btn-label').textContent;
        this.querySelector('.btn-label').textContent = 'Muting...';
        this.disabled = true;
        
        setTimeout(function() {
            muteAllBtn.querySelector('.btn-label').textContent = 'All Muted';
            muteAllBtn.classList.add('active');
            showToast('All students muted', 'warning');
            
            // Reset after 5 seconds
            setTimeout(function() {
                muteAllBtn.querySelector('.btn-label').textContent = originalText;
                muteAllBtn.disabled = false;
                muteAllBtn.classList.remove('active');
            }, 5000);
        }, 1500);
    });
    
    // Take Attendance
    takeAttendanceBtn.addEventListener('click', function() {
        this.querySelector('.btn-label').textContent = 'Taking...';
        this.disabled = true;
        
        setTimeout(function() {
            takeAttendanceBtn.querySelector('.btn-label').textContent = 'Attendance Taken';
            takeAttendanceBtn.classList.add('active');
            showToast('Attendance recorded successfully', 'success');
            
            // Update attendance counters
            updateAttendanceCounters();
            
            // Reset after 3 seconds
            setTimeout(function() {
                takeAttendanceBtn.querySelector('.btn-label').textContent = 'Take Attendance';
                takeAttendanceBtn.disabled = false;
                takeAttendanceBtn.classList.remove('active');
            }, 3000);
        }, 2000);
    });
    
    // Share Screen
    shareScreenBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            showToast('Screen sharing started', 'success');
        } else {
            showToast('Screen sharing stopped', 'warning');
        }
    });
    
    // End Class (action bar)
    endClassActionBtn.addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'flex';
    });
}

function updateAttendanceCounters() {
    // Simulate attendance update
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const lateCount = document.getElementById('lateCount');
    
    const newPresent = Math.min(38, parseInt(presentCount.textContent) + 1);
    const newAbsent = Math.max(0, parseInt(absentCount.textContent) - 1);
    
    presentCount.textContent = newPresent;
    absentCount.textContent = newAbsent;
    
    // Update chart
    const presentBar = document.querySelector('.chart-bar.present');
    const absentBar = document.querySelector('.chart-bar.absent');
    const lateBar = document.querySelector('.chart-bar.late');
    
    presentBar.style.width = `${(newPresent / 38) * 100}%`;
    absentBar.style.width = `${(newAbsent / 38) * 100}%`;
    lateBar.style.width = `${(parseInt(lateCount.textContent) / 38) * 100}%`;
}

// Confirmation Modal
function initConfirmationModal() {
    const endClassBtn = document.getElementById('endClassBtn');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEnd = document.getElementById('cancelEnd');
    const confirmEnd = document.getElementById('confirmEnd');
    
    // Open modal
    endClassBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // Close modal
    closeModal.addEventListener('click', closeModalFunc);
    cancelEnd.addEventListener('click', closeModalFunc);
    
    // Confirm end class
    confirmEnd.addEventListener('click', function() {
        this.disabled = true;
        this.querySelector('span').textContent = 'Ending...';
        
        setTimeout(function() {
            showToast('Class ended successfully. Session data saved.', 'success');
            closeModalFunc();
            
            // Redirect or show summary (in real app)
            setTimeout(function() {
                alert('Class session completed. Redirecting to dashboard...');
                // window.location.href = 'teacher-dashboard.html';
            }, 1000);
        }, 2000);
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    function closeModalFunc() {
        modal.style.animation = 'fadeIn 0.3s var(--transition-smooth) reverse';
        setTimeout(function() {
            modal.style.display = 'none';
            modal.style.animation = '';
            confirmEnd.disabled = false;
            confirmEnd.querySelector('span').textContent = 'End Class';
        }, 300);
    }
}

// Real-time Updates
function initRealTimeUpdates() {
    // Simulate real-time updates for engagement and alerts
    setInterval(function() {
        updateEngagementMetrics();
        simulateNewAlert();
    }, 10000); // Update every 10 seconds
}

function updateEngagementMetrics() {
    // Randomly update engagement metrics
    const engagementValue = document.querySelector('.center-value');
    const focusedBar = document.querySelector('.focused .bar-fill');
    const focusedValue = document.querySelector('.focused .stat-value');
    const neutralBar = document.querySelector('.neutral .bar-fill');
    const neutralValue = document.querySelector('.neutral .stat-value');
    const boredBar = document.querySelector('.bored .bar-fill');
    const boredValue = document.querySelector('.bored .stat-value');
    const happyBar = document.querySelector('.happy .bar-fill');
    const happyValue = document.querySelector('.happy .stat-value');
    
    // Generate new values (keeping sum = 100)
    const newFocused = Math.max(30, Math.min(50, Math.floor(Math.random() * 20) + 40));
    const newNeutral = Math.max(25, Math.min(40, Math.floor(Math.random() * 15) + 30));
    const newBored = Math.max(10, Math.min(25, Math.floor(Math.random() * 15) + 10));
    const newHappy = 100 - newFocused - newNeutral - newBored;
    
    // Update values with animation
    animateValueChange(engagementValue, Math.floor((newFocused + newNeutral * 0.5) / 1.5));
    animateBarChange(focusedBar, focusedValue, newFocused);
    animateBarChange(neutralBar, neutralValue, newNeutral);
    animateBarChange(boredBar, boredValue, newBored);
    animateBarChange(happyBar, happyValue, newHappy);
}

function animateValueChange(element, newValue) {
    const current = parseInt(element.textContent.replace('%', ''));
    const diff = newValue - current;
    const steps = 20;
    const stepValue = diff / steps;
    let currentStep = 0;
    
    const interval = setInterval(function() {
        currentStep++;
        const value = Math.floor(current + (stepValue * currentStep));
        element.textContent = `${value}%`;
        
        if (currentStep >= steps) {
            clearInterval(interval);
            element.textContent = `${newValue}%`;
        }
    }, 50);
}

function animateBarChange(bar, valueElement, newValue) {
    const current = parseInt(valueElement.textContent.replace('%', ''));
    const diff = newValue - current;
    const steps = 20;
    const stepValue = diff / steps;
    let currentStep = 0;
    
    const interval = setInterval(function() {
        currentStep++;
        const value = Math.floor(current + (stepValue * currentStep));
        valueElement.textContent = `${value}%`;
        bar.style.width = `${value}%`;
        
        if (currentStep >= steps) {
            clearInterval(interval);
            valueElement.textContent = `${newValue}%`;
            bar.style.width = `${newValue}%`;
        }
    }, 50);
}

function simulateNewAlert() {
    if (Math.random() > 0.6) { // 40% chance of new alert
        const alerts = [
            {
                icon: 'fa-exclamation-triangle',
                title: 'Engagement Drop',
                message: 'Overall engagement decreased by 8%'
            },
            {
                icon: 'fa-user-clock',
                title: 'Student Inactive',
                message: '1 student inactive for 5+ minutes'
            },
            {
                icon: 'fa-lightbulb',
                title: 'AI Insight',
                message: 'Optimal teaching moment detected'
            },
            {
                icon: 'fa-chart-line',
                title: 'Performance Peak',
                message: 'Highest engagement recorded'
            }
        ];
        
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        addNewAlert(alert.icon, alert.title, alert.message);
    }
}

function addNewAlert(iconClass, title, message) {
    const alertsContainer = document.querySelector('.alerts-container');
    
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item unread';
    alertItem.innerHTML = `
        <div class="alert-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="alert-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <span class="alert-time">Just now</span>
        </div>
        <button class="alert-action">View</button>
    `;
    
    // Add to top
    alertsContainer.insertBefore(alertItem, alertsContainer.firstChild);
    
    // Initialize alert action button
    const actionBtn = alertItem.querySelector('.alert-action');
    actionBtn.addEventListener('click', function() {
        alertItem.classList.remove('unread');
        alertItem.style.backgroundColor = '';
        alertItem.style.borderLeft = '';
        alertItem.style.animation = '';
        showToast(`Alert viewed: ${title}`, 'info');
    });
    
    // Update alert summary
    const summaryValue = document.querySelector('.summary-item:first-child .summary-value');
    summaryValue.textContent = parseInt(summaryValue.textContent) + 1;
    
    // Show notification
    showToast(`New alert: ${title}`, 'warning');
    
    // Auto-remove old alerts if too many
    if (alertsContainer.children.length > 5) {
        alertsContainer.removeChild(alertsContainer.lastChild);
    }
}

// Toast System
function initToastSystem() {
    // Add styles for toast
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border-left: 4px solid #1CA7EC;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: var(--shadow-lg);
            animation: toastSlideIn 0.3s var(--transition-smooth);
            max-width: 400px;
            margin-left: auto;
        }
        
        .toast.success {
            border-left-color: #48BB78;
        }
        
        .toast.warning {
            border-left-color: #ED8936;
        }
        
        .toast.danger {
            border-left-color: #F56565;
        }
        
        .toast.info {
            border-left-color: #4299E1;
        }
        
        .toast-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(28, 167, 236, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1CA7EC;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .success .toast-icon {
            background: rgba(72, 187, 120, 0.1);
            color: #48BB78;
        }
        
        .warning .toast-icon {
            background: rgba(237, 137, 54, 0.1);
            color: #ED8936;
        }
        
        .danger .toast-icon {
            background: rgba(245, 101, 101, 0.1);
            color: #F56565;
        }
        
        .info .toast-icon {
            background: rgba(66, 153, 225, 0.1);
            color: #4299E1;
        }
        
        .toast-content {
            flex: 1;
        }
        
        .toast-content p {
            margin: 0;
            color: var(--primary-text);
            font-size: 14px;
            line-height: 1.4;
        }
        
        .toast-close {
            background: transparent;
            border: none;
            color: var(--secondary-text);
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .toast-close:hover {
            background: #F56565;
            color: white;
        }
        
        @keyframes toastSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'danger') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.animation = 'toastSlideOut 0.3s var(--transition-smooth)';
        setTimeout(function() {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s var(--transition-smooth)';
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Limit number of toasts
    if (container.children.length > 3) {
        container.removeChild(container.firstChild);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});