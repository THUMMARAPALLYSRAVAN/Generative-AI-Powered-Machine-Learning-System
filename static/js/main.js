// ==================== GLOBAL VARIABLES ====================
let currentTopic = '';
let userProfile = {};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupEventListeners();
});

// ==================== PROFILE MANAGEMENT ====================
function loadUserProfile() {
    fetch('/api/profile')
        .then(response => response.json())
        .then(data => {
            userProfile = data;
            updateProfileDisplay();
        })
        .catch(error => console.error('Error loading profile:', error));
}

function updateProfileDisplay() {
    // Update sidebar displays
    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.textContent = userProfile.id || 'User';
    }

    const learningStyleSelect = document.getElementById('learningStyle');
    if (learningStyleSelect) {
        learningStyleSelect.value = userProfile.learning_style || 'visual';
    }

    const skillLevelSelect = document.getElementById('skillLevel');
    if (skillLevelSelect) {
        skillLevelSelect.value = userProfile.level || 'beginner';
    }

    const codeExamplesCheckbox = document.getElementById('codeExamples');
    if (codeExamplesCheckbox) {
        codeExamplesCheckbox.checked = userProfile.preferences?.code_examples !== false;
    }

    const visualizationsCheckbox = document.getElementById('visualizations');
    if (visualizationsCheckbox) {
        visualizationsCheckbox.checked = userProfile.preferences?.visualizations !== false;
    }

    const audioLessonsCheckbox = document.getElementById('audioLessons');
    if (audioLessonsCheckbox) {
        audioLessonsCheckbox.checked = userProfile.preferences?.audio_lessons === true;
    }

    const detailedExplanationsCheckbox = document.getElementById('detailedExplanations');
    if (detailedExplanationsCheckbox) {
        detailedExplanationsCheckbox.checked = userProfile.preferences?.detailed_explanations !== false;
    }

    const completedCountElement = document.getElementById('completedCount');
    if (completedCountElement) {
        completedCountElement.textContent = userProfile.completed_lessons?.length || 0;
    }

    const currentLevelElement = document.getElementById('currentLevel');
    if (currentLevelElement) {
        currentLevelElement.textContent = userProfile.level?.charAt(0).toUpperCase() + userProfile.level?.slice(1) || 'Beginner';
    }
}

function saveProfile() {
    const preferences = {
        code_examples: document.getElementById('codeExamples')?.checked || false,
        visualizations: document.getElementById('visualizations')?.checked || false,
        audio_lessons: document.getElementById('audioLessons')?.checked || false,
        detailed_explanations: document.getElementById('detailedExplanations')?.checked || false
    };

    const profileData = {
        learning_style: document.getElementById('learningStyle')?.value || 'visual',
        level: document.getElementById('skillLevel')?.value || 'beginner',
        preferences: preferences
    };

    fetch('/api/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(response => response.json())
    .then(data => {
        userProfile = data;
        showNotification('Profile saved successfully!', 'success');
        updateProfileDisplay();
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        showNotification('Error saving profile', 'error');
    });
}

// ==================== TOPIC SELECTION ====================
function selectTopic(topic) {
    currentTopic = topic;
    loadModalContent(topic);
    openModal();
}

function openModal() {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== MODAL CONTENT LOADING ====================
function loadModalContent(topic) {
    if (!topic) return;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = topic;
    }

    // Reset all tabs to loading state
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        if (tab.id !== 'explanation') {
            tab.classList.remove('active');
        }
        const contentDiv = tab.querySelector('[id$="Content"]');
        if (contentDiv) {
            contentDiv.innerHTML = '<div class="loading"><p>Loading...</p></div>';
        }
    });

    // Make explanation tab active
    document.getElementById('explanation').classList.add('active');

    // Load content for each section
    loadExplanation(topic);
    loadCodeExample(topic);
    loadVisualGuide(topic);
    loadAudioScript(topic);
    loadQuiz(topic);
}

function loadExplanation(topic) {
    const contentDiv = document.getElementById('explanationContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><p>Generating explanation...</p></div>';

    fetch('/api/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ concept: topic })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            contentDiv.innerHTML = `<pre>${escapeHtml(data.explanation)}</pre>`;
        } else {
            contentDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading explanation:', error);
        contentDiv.innerHTML = '<p style="color: red;">Error loading explanation</p>';
    });
}

function loadCodeExample(topic) {
    const contentDiv = document.getElementById('codeContent');
    if (!contentDiv) return;

    // Check if code examples are disabled in preferences
    if (userProfile.preferences?.code_examples === false) {
        contentDiv.innerHTML = '<p>Code examples are disabled in your preferences</p>';
        return;
    }

    contentDiv.innerHTML = '<div class="loading"><p>Generating code example...</p></div>';

    fetch('/api/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            concept: topic,
            language: 'python'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            contentDiv.innerHTML = `<pre><code>${escapeHtml(data.code)}</code></pre>`;
        } else {
            contentDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading code:', error);
        contentDiv.innerHTML = '<p style="color: red;">Error loading code example</p>';
    });
}

function loadVisualGuide(topic) {
    const contentDiv = document.getElementById('visualContent');
    if (!contentDiv) return;

    // Check if visualizations are disabled in preferences
    if (userProfile.preferences?.visualizations === false) {
        contentDiv.innerHTML = '<p>Visual guides are disabled in your preferences</p>';
        return;
    }

    contentDiv.innerHTML = '<div class="loading"><p>Generating visual guide...</p></div>';

    fetch('/api/visual', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ concept: topic })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            contentDiv.innerHTML = `<pre>${escapeHtml(data.visual_guide)}</pre>`;
        } else {
            contentDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading visual guide:', error);
        contentDiv.innerHTML = '<p style="color: red;">Error loading visual guide</p>';
    });
}

function loadAudioScript(topic) {
    const contentDiv = document.getElementById('audioContent');
    if (!contentDiv) return;

    // Check if audio lessons are enabled in preferences
    if (userProfile.preferences?.audio_lessons !== true) {
        contentDiv.innerHTML = '<p>Audio lessons are disabled in your preferences. Enable them in settings to see audio content.</p>';
        return;
    }

    contentDiv.innerHTML = '<div class="loading"><p>Generating audio script...</p></div>';

    fetch('/api/audio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ concept: topic })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            contentDiv.innerHTML = `<pre>${escapeHtml(data.audio_script)}</pre>`;
        } else {
            contentDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading audio script:', error);
        contentDiv.innerHTML = '<p style="color: red;">Error loading audio script</p>';
    });
}

function loadQuiz(topic) {
    const contentDiv = document.getElementById('quizContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><p>Generating quiz...</p></div>';

    fetch('/api/quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: topic })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.quiz) {
            displayQuiz(data.quiz, contentDiv);
        } else {
            contentDiv.innerHTML = `<p style="color: red;">Error: ${data.error || 'Failed to load quiz'}</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading quiz:', error);
        contentDiv.innerHTML = '<p style="color: red;">Error loading quiz</p>';
    });
}

function displayQuiz(quiz, containerDiv) {
    let quizHtml = '';
    
    quiz.forEach((question, idx) => {
        quizHtml += `
            <div class="quiz-question">
                <h4>Question ${idx + 1}: ${escapeHtml(question.question)}</h4>
                <div class="quiz-options">
        `;
        
        question.options.forEach((option, optIdx) => {
            quizHtml += `
                <label class="quiz-option">
                    <input type="radio" name="q${idx}" value="${option}" class="quiz-radio">
                    ${option}
                </label>
            `;
        });
        
        quizHtml += `
                </div>
                <p class="quiz-explanation" id="exp${idx}" style="display: none;">
                    <strong>✓ Correct Answer:</strong> ${escapeHtml(question.correct_answer)}<br>
                    <strong>Explanation:</strong> ${escapeHtml(question.explanation)}
                </p>
            </div>
        `;
    });
    
    quizHtml += '<button class="btn btn-success" onclick="checkQuizAnswers()" style="width: 100%; margin-top: 1rem;">Submit Answers</button>';
    
    containerDiv.innerHTML = quizHtml;
}

function checkQuizAnswers() {
    const quizRadios = document.querySelectorAll('.quiz-radio:checked');
    
    if (quizRadios.length === 0) {
        showNotification('Please answer all questions before submitting', 'warning');
        return;
    }
    
    quizRadios.forEach(radio => {
        const questionDiv = radio.closest('.quiz-question');
        const questionIdx = radio.name.replace('q', '');
        const explanationDiv = document.getElementById(`exp${questionIdx}`);
        
        if (explanationDiv) {
            explanationDiv.style.display = 'block';
        }
    });
    
    showNotification('Quiz submitted! Review your answers above.', 'success');
}

// ==================== TAB SWITCHING ====================
function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target?.classList.add('active');
}

// ==================== UTILITY FUNCTIONS ====================
function copyCode() {
    let code = '';
    const codeElement = document.querySelector('#codeContent code');
    
    if (!codeElement) {
        const preElement = document.querySelector('#codeContent pre');
        code = preElement?.textContent || '';
    } else {
        code = codeElement.textContent;
    }

    if (code) {
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Error copying code:', err);
            showNotification('Error copying code', 'error');
        });
    }
}

function speakAudio() {
    const audioText = document.getElementById('audioContent')?.textContent;
    
    if (!audioText || audioText.includes('Audio lessons are disabled')) {
        showNotification('Audio content not available. Enable it in preferences.', 'warning');
        return;
    }

    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(audioText);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        speechSynthesis.speak(utterance);
        showNotification('Playing audio...', 'info');
    } else {
        showNotification('Speech synthesis not supported in your browser', 'warning');
    }
}

function markLessonComplete() {
    if (!currentTopic) return;

    fetch('/api/complete-lesson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lesson_id: currentTopic })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            userProfile = { ...userProfile, completed_lessons: data.completed_lessons };
            updateProfileDisplay();
            showNotification('🎉 Lesson marked as completed! Great job!', 'success');
        }
    })
    .catch(error => {
        console.error('Error completing lesson:', error);
        showNotification('Error marking lesson as complete', 'error');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#667eea'
    };
    return colors[type] || colors['info'];
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Close modal when clicking outside
    const modal = document.getElementById('contentModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Keyboard shortcut for closing modal (ESC key)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
