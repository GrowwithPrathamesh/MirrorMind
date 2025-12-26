// Page Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initDashboard();
        }, 600);
    }, 1200);
});

// Initialize Dashboard
function initDashboard() {
    initSidebar();
    initKPIAnimations();
    initAttendanceRing();
    initEngagementChart();
    initTimeDisplay();
    initNotifications();
    initScrollAnimations();
    initHoverEffects();
}

// Sidebar Toggle
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1200) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Active menu item
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!item.parentElement.classList.contains('active')) {
                menuItems.forEach(i => i.parentElement.classList.remove('active'));
                item.parentElement.classList.add('active');
            }
        });
    });
}

// KPI Counter Animations
function initKPIAnimations() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    kpiValues.forEach(value => observer.observe(value));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Attendance Ring Animation
function initAttendanceRing() {
    const ring = document.querySelector('.progress-ring-fill');
    const circumference = 2 * Math.PI * 80;
    const targetOffset = circumference - (94 / 100) * circumference;
    
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    ring.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        ring.style.strokeDashoffset = targetOffset;
    }, 1000);
    
    // Create gradient for ring
    const svg = document.querySelector('.progress-ring');
    const svgNS = 'http://www.w3.org/2000/svg';
    
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1CA7EC');
    
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#06B6D4');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
}

// Engagement Chart
function initEngagementChart() {
    const canvas = document.getElementById('engagementChart');
    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    
    // Chart data
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Engagement Score',
            data: [78, 82, 85, 87, 90, 85, 88],
            borderColor: '#1CA7EC',
            backgroundColor: 'rgba(28, 167, 236, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#1CA7EC',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };
    
    // Draw chart
    setTimeout(() => {
        drawChart(ctx, data);
    }, 1200);
}

function drawChart(ctx, data) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(229, 231, 235, 0.5)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i * chartHeight / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw data line
    const maxValue = 100;
    const points = data.datasets[0].data.map((value, index) => {
        const x = padding + (index * chartWidth / (data.labels.length - 1));
        const y = height - padding - (value / maxValue * chartHeight);
        return { x, y, value };
    });
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(28, 167, 236, 0.3)');
    gradient.addColorStop(1, 'rgba(28, 167, 236, 0.05)');
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = '#1CA7EC';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw points with glow effect
    points.forEach(point => {
        // Glow effect
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(28, 167, 236, 0.2)';
        ctx.fill();
        
        // Point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#1CA7EC';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
        const x = padding + (index * chartWidth / (data.labels.length - 1));
        ctx.fillText(label, x, height - padding + 20);
    });
}

// Time Display
function initTimeDisplay() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('currentTime').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 60000);
}

// Notifications
function initNotifications() {
    const dismissButtons = document.querySelectorAll('.notification-dismiss');
    const markReadButton = document.querySelector('.mark-read');
    
    dismissButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const notification = button.closest('.notification-item');
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            setTimeout(() => {
                notification.remove();
                updateNotificationCount();
            }, 300);
        });
    });
    
    markReadButton.addEventListener('click', () => {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
            notification.style.backgroundColor = '';
            notification.style.borderLeft = '';
        });
        updateNotificationCount();
    });
    
    // Update notification count
    function updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        document.querySelector('.notification-count').textContent = unreadCount;
        document.querySelector('.pulse-dot').style.display = unreadCount > 0 ? 'block' : 'none';
        
        const sidebarBadge = document.querySelector('.sidebar .notification-badge');
        if (sidebarBadge) {
            sidebarBadge.textContent = unreadCount;
            sidebarBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.chart-card, .classes-card, .notifications-card').forEach(el => {
        observer.observe(el);
    });
}

// Hover Effects
function initHoverEffects() {
    // Magnetic button effect
    const buttons = document.querySelectorAll('.kpi-card, .class-item, .notification-item');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX * 5;
            const deltaY = (y - centerY) / centerY * 5;
            
            button.style.transform = `translateY(-8px) translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Card depth effect
    const cards = document.querySelectorAll('.kpi-card, .chart-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// Resize handler for chart
window.addEventListener('resize', () => {
    const canvas = document.getElementById('engagementChart');
    if (canvas) {
        initEngagementChart();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete') {
        initDashboard();
    }
});