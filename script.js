// 프론트엔드 수업 1일차 - HTML 기초 학습용 스크립트

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const contentCards = document.querySelectorAll('.content-card');
const tipItems = document.querySelectorAll('.tip-item');

// ===== Page Load Animation =====
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to cards
    contentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Initialize progress tracking
    initializeProgress();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Show welcome message
    showWelcomeMessage();
});

// ===== Progress Tracking =====
function initializeProgress() {
    const progress = getStoredProgress();
    updateProgressDisplay(progress);
}

function getStoredProgress() {
    return JSON.parse(localStorage.getItem('htmlLearningProgress')) || {
        day1: false,
        currentSection: 0,
        completedSections: []
    };
}

function saveProgress(progress) {
    localStorage.setItem('htmlLearningProgress', JSON.stringify(progress));
}

function updateProgressDisplay(progress) {
    const progressBar = createProgressBar();
    const header = document.querySelector('.header-content');
    header.appendChild(progressBar);
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
        <p class="progress-text">학습 진행률: 0%</p>
    `;
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .progress-container {
            margin-top: 1.5rem;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
            transition: width 0.3s ease;
        }
        .progress-text {
            text-align: center;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
    
    return progressContainer;
}

// ===== Interactive Features =====
function addInteractiveFeatures() {
    // Add code copying functionality
    addCodeCopyButtons();
    
    // Add section completion tracking
    addSectionTracking();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add scroll progress
    addScrollProgress();
    
    // Add theme toggle
    addThemeToggle();
}

// ===== Code Copy Functionality =====
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-example');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '📋';
        copyButton.title = 'Copy Code';
        
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('pre').textContent;
            copyToClipboard(code);
            showCopyFeedback(copyButton);
        });
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
    
    // Add CSS for copy button
    const style = document.createElement('style');
    style.textContent = `
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.3rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s ease;
            z-index: 10;
        }
        .copy-btn:hover {
            background: var(--secondary-color);
            transform: scale(1.05);
        }
        .copy-btn.copied {
            background: var(--success-color);
        }
    `;
    document.head.appendChild(style);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✓';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('copied');
    }, 2000);
}

// ===== Section Completion Tracking =====
function addSectionTracking() {
    const sections = document.querySelectorAll('.content-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                markSectionAsViewed(entry.target);
            }
        });
    }, { threshold: 0.6 });
    
    sections.forEach(section => observer.observe(section));
}

function markSectionAsViewed(section) {
    if (!section.classList.contains('viewed')) {
        section.classList.add('viewed');
        updateProgress();
        
        // Visual feedback
        const checkmark = document.createElement('div');
        checkmark.className = 'section-checkmark';
        checkmark.innerHTML = '✓';
        section.appendChild(checkmark);
        
        setTimeout(() => {
            if (checkmark.parentNode) {
                checkmark.remove();
            }
        }, 2000);
    }
}

function updateProgress() {
    const totalSections = document.querySelectorAll('.content-card').length;
    const viewedSections = document.querySelectorAll('.content-card.viewed').length;
    const progressPercentage = Math.round((viewedSections / totalSections) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `학습 진행률: ${progressPercentage}%`;
        
        // Save progress
        const progress = getStoredProgress();
        progress.day1 = progressPercentage === 100;
        progress.currentSection = viewedSections;
        saveProgress(progress);
        
        // Show completion message
        if (progressPercentage === 100) {
            showCompletionMessage();
        }
    }
}

// ===== Keyboard Navigation =====
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    scrollToSection('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    scrollToSection('down');
                    break;
            }
        }
    });
}

function scrollToSection(direction) {
    const sections = Array.from(document.querySelectorAll('.content-card'));
    const currentIndex = getCurrentSectionIndex();
    
    let targetIndex;
    if (direction === 'up' && currentIndex > 0) {
        targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1;
    }
    
    if (targetIndex !== undefined) {
        sections[targetIndex].scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function getCurrentSectionIndex() {
    const sections = Array.from(document.querySelectorAll('.content-card'));
    const scrollY = window.scrollY + window.innerHeight / 2;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
            return i;
        }
    }
    return 0;
}

// ===== Scroll Progress =====
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 1000;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    document.querySelector('.scroll-progress').style.width = `${scrollPercent}%`;
}

// ===== Theme Toggle =====
function addThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = '🌙';
    toggleButton.title = 'Toggle Dark Mode';
    
    toggleButton.addEventListener('click', toggleTheme);
    
    document.body.appendChild(toggleButton);
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
            z-index: 1000;
        }
        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: var(--hover-shadow);
        }
        body.dark-mode {
            --background-light: #2d3748;
            --white: #1a202c;
            --text-dark: #f7fafc;
            --text-light: #e2e8f0;
            --border-color: #4a5568;
        }
    `;
    document.head.appendChild(style);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.innerHTML = isDark ? '☀️' : '🌙';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ===== Messages =====
function showWelcomeMessage() {
    setTimeout(() => {
        showToast('😊 오늘도 열심히 공부해보자!', 'success');
    }, 1000);
}

function showCompletionMessage() {
    showToast('🎉 1일차 수업 완료! 다음 시간에 CSS 배우자!', 'success', 5000);
    
    // Enable next button
    const nextBtn = document.querySelector('.nav-btn.next');
    if (nextBtn) {
        nextBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        nextBtn.style.animation = 'pulse 2s infinite';
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Add CSS if not exists
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--white);
                color: var(--text-dark);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: var(--card-shadow);
                border-left: 4px solid var(--primary-color);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 1001;
                max-width: 300px;
            }
            .toast.show {
                transform: translateX(0);
            }
            .toast.toast-success {
                border-left-color: var(--success-color);
            }
            .toast.toast-warning {
                border-left-color: var(--warning-color);
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Navigation Functions =====
function nextLesson() {
    const progress = getStoredProgress();
    
    if (!progress.day1) {
        showToast('⚠️ 모든 섹션을 완료한 후 다음 강의로 진행하세요!', 'warning');
        return;
    }
    
    showToast('🚀 Day 2: CSS 기초로 이동합니다!', 'success');
    
    // Simulate navigation (in real app, this would route to day2)
    setTimeout(() => {
        window.location.href = '../day2/index.html';
    }, 1500);
}

// ===== Utility Functions =====
function addSectionCheckmark() {
    const style = document.createElement('style');
    style.textContent = `
        .section-checkmark {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--success-color);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            animation: checkmarkAnimation 0.5s ease-out;
        }
        @keyframes checkmarkAnimation {
            0% {
                transform: scale(0) rotate(180deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.2) rotate(90deg);
                opacity: 0.8;
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Initialize =====
// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        setTimeout(() => {
            const themeButton = document.querySelector('.theme-toggle');
            if (themeButton) {
                themeButton.innerHTML = '☀️';
            }
        }, 100);
    }
});

// Add section checkmark styles
addSectionCheckmark();

// 개발자 콘솔 메시지
console.log(`
📚 프론트엔드 수업 1일차 - HTML 기초
===============================
오늘도 열심히 공부하자!

단축키:
- Ctrl/Cmd + ↑/↓: 위아래 섹션 이동
- 코드박스 클릭하면 복사됨

화이팅! 💪
`);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nextLesson,
        updateProgress,
        showToast
    };
}