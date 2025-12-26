// Page Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
            initTeacherDashboard();
        }, 600);
    }, 1200);
});

// Initialize Teacher Dashboard
function initTeacherDashboard() {
    initSidebar();
    initStatsAnimations();
    initStartClassButton();
    initEmotionChart();
    initCountdownTimer();
    initNotifications();
    initScrollAnimations();
    initHoverEffects();
    initTimeFilter();
    initViewAllButtons();
}

// Sidebar Toggle
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (!sidebar || !toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        toggleBtn.style.transform = sidebar.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1200) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                toggleBtn.style.transform = 'rotate(0)';
            }
        }
    });
    
    // Active menu item
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    menuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!item.parentElement.classList.contains('active')) {
                menuItems.forEach(function(i) {
                    i.parentElement.classList.remove('active');
                });
                item.parentElement.classList.add('active');
            }
        });
    });
}

// Stats Counter Animations
function initStatsAnimations() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(function(value) {
        observer.observe(value);
    });
}

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

// Start Class Button
function initStartClassButton() {
    const startBtn = document.getElementById('startClassBtn');
    
    if (!startBtn) return;
    
    startBtn.addEventListener('click', function() {
        if (!startBtn.classList.contains('loading')) {
            startBtn.classList.add('loading');
            const btnText = startBtn.querySelector('.btn-content span');
            if (btnText) {
                btnText.textContent = 'Starting...';
            }
            
            // Add ripple effect
            createRippleEffect(startBtn);
            
            // Simulate API call
            setTimeout(function() {
                startBtn.classList.remove('loading');
                if (btnText) {
                    btnText.textContent = 'Class Started!';
                }
                startBtn.style.background = 'linear-gradient(135deg, #48BB78, #38A169)';
                startBtn.disabled = true;
                
                // Update status indicator
                const statusDot = document.querySelector('.status-dot');
                const statusText = document.querySelector('.status-text');
                if (statusDot && statusText) {
                    statusDot.style.background = '#F56565';
                    statusDot.style.boxShadow = '0 0 10px rgba(245, 101, 101, 0.5)';
                    statusText.textContent = 'Live Class Active';
                }
                
                // Show success notification
                showNotification('Live class started successfully! AI monitoring is now active.', 'success');
            }, 2000);
        }
    });
}

function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
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
    ripple.style.zIndex = '0';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(function() {
        if (ripple.parentNode === button) {
            ripple.remove();
        }
    }, 600);
}

// Emotion Chart
function initEmotionChart() {
    const canvas = document.getElementById('emotionChart');
    if (!canvas || !canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    
    // Chart data
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
    
    // Draw chart with delay
    setTimeout(function() {
        drawPieChart(ctx, data);
    }, 1200);
    
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
}

function drawPieChart(ctx, data) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    
    const total = data.datasets[0].data.reduce(function(a, b) {
        return a + b;
    }, 0);
    
    let startAngle = 0;
    const animationDuration = 1500;
    const startTime = Date.now();
    
    function animateChart() {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        let animatedStartAngle = 0;
        let lastAngle = 0;
        
        // Draw each segment with animation
        data.datasets[0].data.forEach(function(value, index) {
            const sliceAngle = (2 * Math.PI * value) / total;
            const animatedAngle = sliceAngle * progress;
            
            // Begin path for this slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, animatedStartAngle, animatedStartAngle + animatedAngle);
            ctx.closePath();
            
            // Fill with color
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fill();
            
            // Add border
            ctx.strokeStyle = data.datasets[0].borderColor[index];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add glow effect to focused segment
            if (index === 0) {
                ctx.save();
                ctx.shadowColor = 'rgba(28, 167, 236, 0.5)';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
            }
            
            animatedStartAngle += animatedAngle;
            lastAngle = animatedStartAngle;
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = '#F5F7FA';
        ctx.fill();
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add center text
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 16px Segoe UI, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Emotion', centerX, centerY - 8);
        
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Segoe UI, system-ui, sans-serif';
        ctx.fillText('Analysis', centerX, centerY + 8);
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animateChart);
        }
    }
    
    animateChart();
}

// Countdown Timer
function initCountdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const classCountdownElement = document.getElementById('classCountdown');
    
    if (!hoursElement || !minutesElement || !secondsElement || !classCountdownElement) return;
    
    function updateCountdown() {
        // Set target time to 1 hour, 30 minutes, 45 seconds from now for demo
        const now = new Date();
        const targetTime = new Date(now.getTime() + (1 * 60 * 60 * 1000) + (30 * 60 * 1000) + (45 * 1000));
        
        const timeDiff = targetTime - now;
        
        if (timeDiff > 0) {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // Update global countdown
            classCountdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
            // Reset for demo (add another hour)
            hoursElement.textContent = '01';
            minutesElement.textContent = '30';
            secondsElement.textContent = '45';
            classCountdownElement.textContent = '01:30';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Notifications
function initNotifications() {
    const dismissButtons = document.querySelectorAll('.alert-dismiss');
    const markReadButton = document.querySelector('.mark-read');
    
    // Dismiss individual alerts
    dismissButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const alert = button.closest('.alert-item');
            if (alert) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateX(20px)';
                setTimeout(function() {
                    if (alert.parentNode) {
                        alert.remove();
                        updateNotificationCount();
                    }
                }, 300);
            }
        });
    });
    
    // Mark all as read
    if (markReadButton) {
        markReadButton.addEventListener('click', function() {
            const unreadAlerts = document.querySelectorAll('.alert-item.unread');
            unreadAlerts.forEach(function(alert) {
                alert.classList.remove('unread');
                alert.style.backgroundColor = '';
                alert.style.borderLeft = '';
                alert.style.animation = '';
            });
            updateNotificationCount();
            showNotification('All alerts marked as read', 'success');
        });
    }
    
    // Update notification count
    function updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.alert-item.unread').length;
        const notificationCountElement = document.querySelector('.notification-count');
        const pulseDot = document.querySelector('.pulse-dot');
        
        if (notificationCountElement) {
            notificationCountElement.textContent = unreadCount;
        }
        
        if (pulseDot) {
            pulseDot.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }
}

// Scroll Animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const contentCards = document.querySelectorAll('.content-card, .stat-card, .start-class-card');
    contentCards.forEach(function(card) {
        observer.observe(card);
    });
}

// Hover Effects
function initHoverEffects() {
    // Magnetic hover effect for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX * 5;
            const deltaY = (y - centerY) / centerY * 5;
            
            card.style.transform = `translateY(-8px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Table row hover effect
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(function(row) {
        row.addEventListener('mouseenter', function() {
            row.style.backgroundColor = 'rgba(229, 231, 235, 0.3)';
        });
        
        row.addEventListener('mouseleave', function() {
            row.style.backgroundColor = '';
        });
    });
    
    // Card hover depth effect
    const cards = document.querySelectorAll('.content-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        });
    });
}

// Time Filter
function initTimeFilter() {
    const timeFilterElements = document.querySelectorAll('.time-filter span');
    
    timeFilterElements.forEach(function(filter) {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            timeFilterElements.forEach(function(f) {
                f.classList.remove('active');
            });
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update chart data based on filter (simulated)
            showNotification(`Showing data for ${this.textContent.toLowerCase()}`, 'info');
            
            // In a real app, you would update the chart data here
            // For demo, we'll just reload the chart with new data
            const canvas = document.getElementById('emotionChart');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const newData = getFilteredData(this.textContent);
                drawPieChart(ctx, newData);
            }
        });
    });
}

function getFilteredData(filter) {
    // Simulate different data based on filter
    const dataSets = {
        'Today': [42, 35, 18, 5],
        'Week': [45, 32, 15, 8],
        'Month': [48, 30, 12, 10]
    };
    
    return {
        labels: ['Focused', 'Neutral', 'Bored', 'Happy'],
        datasets: [{
            data: dataSets[filter] || [42, 35, 18, 5],
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
}

// View All Buttons
function initViewAllButtons() {
    const viewAllButtons = document.querySelectorAll('.view-all');
    
    viewAllButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.card-header').querySelector('h3').textContent;
            showNotification(`Opening full ${cardTitle.toLowerCase()} view`, 'info');
            
            // In a real app, this would navigate to a detailed page
            // For demo, we'll simulate loading
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            setTimeout(function() {
                button.innerHTML = 'View All';
                button.disabled = false;
                showNotification(`${cardTitle} data loaded`, 'success');
            }, 1500);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `floating-notification ${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .floating-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #F5F7FA;
                border-left: 4px solid #1CA7EC;
                border-radius: 12px;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
                z-index: 1000;
                animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                backdrop-filter: blur(10px);
            }
            
            .floating-notification.success {
                border-left-color: #48BB78;
            }
            
            .floating-notification.error {
                border-left-color: #F56565;
            }
            
            .floating-notification.warning {
                border-left-color: #ED8936;
            }
            
            .notification-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(28, 167, 236, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #1CA7EC;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .success .notification-icon {
                background: rgba(72, 187, 120, 0.1);
                color: #48BB78;
            }
            
            .error .notification-icon {
                background: rgba(245, 101, 101, 0.1);
                color: #F56565;
            }
            
            .warning .notification-icon {
                background: rgba(237, 137, 54, 0.1);
                color: #ED8936;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-content p {
                margin: 0;
                color: #1F2937;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: #6B7280;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: #F56565;
                color: white;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
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
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Prepare Class Button
function initPrepareClassButton() {
    const prepareBtn = document.querySelector('.prepare-class-btn');
    
    if (prepareBtn) {
        prepareBtn.addEventListener('click', function() {
            const originalText = prepareBtn.innerHTML;
            prepareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            prepareBtn.disabled = true;
            
            setTimeout(function() {
                prepareBtn.innerHTML = originalText;
                prepareBtn.disabled = false;
                showNotification('Class materials prepared successfully!', 'success');
            }, 2000);
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.readyState === 'complete') {
            // Initialize prepare class button
            initPrepareClassButton();
        }
    });
} else {
    // Initialize prepare class button
    initPrepareClassButton();
}

// Resize handler for chart
window.addEventListener('resize', function() {
    const canvas = document.getElementById('emotionChart');
    if (canvas) {
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
        drawPieChart(ctx, data);
    }
});

// Real-time updates simulation
function simulateRealTimeUpdates() {
    // Simulate periodic updates to engagement data
    setInterval(function() {
        const engagementValue = document.querySelector('.stat-value[data-target="86"]');
        if (engagementValue) {
            const currentValue = parseInt(engagementValue.textContent);
            const newValue = Math.min(100, Math.max(60, currentValue + Math.floor(Math.random() * 6) - 3));
            engagementValue.textContent = newValue;
            engagementValue.setAttribute('data-target', newValue);
        }
        
        // Simulate occasional new alerts
        if (Math.random() > 0.8) {
            const alertTypes = [
                { icon: 'fa-exclamation-triangle', title: 'Low Engagement', message: 'Student group showing decreased focus' },
                { icon: 'fa-user-clock', title: 'Attendance Alert', message: 'Late arrival detected in current session' },
                { icon: 'fa-lightbulb', title: 'AI Insight', message: 'Optimal teaching moment detected' }
            ];
            
            const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            addNewAlert(alertType.icon, alertType.title, alertType.message);
        }
    }, 10000); // Update every 10 seconds
}

function addNewAlert(iconClass, title, message) {
    const alertsList = document.querySelector('.alerts-list');
    if (!alertsList) return;
    
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
        <button class="alert-dismiss">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add at the top of the list
    alertsList.insertBefore(alertItem, alertsList.firstChild);
    
    // Initialize dismiss button
    const dismissBtn = alertItem.querySelector('.alert-dismiss');
    dismissBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        alertItem.style.opacity = '0';
        alertItem.style.transform = 'translateX(20px)';
        setTimeout(function() {
            if (alertItem.parentNode) {
                alertItem.remove();
                updateNotificationCount();
            }
        }, 300);
    });
    
    updateNotificationCount();
    
    // Show notification for new alert
    showNotification(`New alert: ${title}`, 'warning');
}

// Start real-time updates after initial load
setTimeout(simulateRealTimeUpdates, 5000);