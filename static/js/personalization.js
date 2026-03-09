// ==================== PERSONALIZATION LOGIC ====================

/**
 * Update content based on user's learning style
 */
function adaptContentToLearningStyle(topic, learningStyle) {
    const adaptations = {
        'visual': {
            emphasis: 'Focus on visual explanations, diagrams, and color-coded examples',
            recommendation: 'Use mindmaps, flowcharts, and infographics'
        },
        'auditory': {
            emphasis: 'Emphasize verbal descriptions and explanations',
            recommendation: 'Use metaphors, discussions, and logical flow'
        },
        'reading': {
            emphasis: 'Provide detailed text-based content',
            recommendation: 'Use comprehensive written explanations with examples'
        },
        'kinesthetic': {
            emphasis: 'Focus on hands-on practice and interactive examples',
            recommendation: 'Include interactive exercises and real-world applications'
        }
    };

    const adaptation = adaptations[learningStyle] || adaptations['visual'];
    console.log(`Content adapted for ${learningStyle} learner:`, adaptation);
    return adaptation;
}

/**
 * Adjust difficulty based on user's skill level
 */
function adjustDifficultyLevel(level) {
    const difficulties = {
        'beginner': {
            explanation_length: 'brief',
            code_complexity: 'simple',
            examples_count: 3
        },
        'intermediate': {
            explanation_length: 'moderate',
            code_complexity: 'medium',
            examples_count: 5
        },
        'advanced': {
            explanation_length: 'detailed',
            code_complexity: 'complex',
            examples_count: 7
        }
    };

    return difficulties[level] || difficulties['beginner'];
}

/**
 * Recommend next topic based on completed lessons
 */
function recommendNextTopic(completedLessons) {
    const topicProgression = {
        'Supervised Learning': ['Linear Regression', 'Logistic Regression', 'Support Vector Machines'],
        'Linear Regression': ['Logistic Regression', 'Feature Engineering', 'Model Evaluation Metrics'],
        'Logistic Regression': ['Support Vector Machines', 'Decision Trees', 'Neural Networks'],
        'Unsupervised Learning': ['K-Means Clustering', 'Principal Component Analysis'],
        'K-Means Clustering': ['Hierarchical Clustering', 'DBSCAN'],
        'Neural Networks': ['Deep Learning', 'Convolutional Neural Networks'],
        'Decision Trees': ['Random Forests', 'Gradient Boosting'],
    };

    const lastCompleted = completedLessons[completedLessons.length - 1];
    return topicProgression[lastCompleted] || [];
}

/**
 * Track user engagement and learning progress
 */
function trackUserProgress(userId, lessonId, metrics) {
    const progressData = {
        userId: userId,
        lessonId: lessonId,
        timestamp: new Date().toISOString(),
        metrics: {
            timeSpent: metrics.timeSpent || 0,
            quizScore: metrics.quizScore || null,
            contentInteractions: metrics.contentInteractions || {}
        }
    };

    console.log('Progress tracked:', progressData);
    return progressData;
}

/**
 * Calculate learning efficiency score
 */
function calculateLearningScore(completedLessons, quizScores, timeSpent) {
    let score = 0;
    
    // Points for completing lessons (max 40)
    score += Math.min(completedLessons.length * 5, 40);
    
    // Points for quiz performance (max 40)
    if (quizScores && quizScores.length > 0) {
        const avgScore = quizScores.reduce((a, b) => a + b, 0) / quizScores.length;
        score += Math.min(avgScore * 0.4, 40);
    }
    
    // Points for consistency (max 20)
    if (timeSpent && timeSpent > 0) {
        score += Math.min(Math.log(timeSpent) * 5, 20);
    }
    
    return Math.min(Math.round(score), 100);
}

/**
 * Personalize content delivery based on learning patterns
 */
function optimizeContentDelivery(userProfile) {
    const optimizations = {
        visual: {
            priority: ['visual', 'code', 'explanation', 'audio'],
            contentFormat: 'diagrams-first',
            visualDensity: 'high'
        },
        auditory: {
            priority: ['audio', 'explanation', 'code', 'visual'],
            contentFormat: 'explanation-first',
            readAloudByDefault: true
        },
        reading: {
            priority: ['explanation', 'code', 'visual', 'audio'],
            contentFormat: 'text-first',
            detailLevel: 'detailed'
        },
        kinesthetic: {
            priority: ['code', 'visual', 'explanation', 'audio'],
            contentFormat: 'practice-first',
            interactiveExercises: true
        }
    };

    return optimizations[userProfile.learning_style] || optimizations.visual;
}

/**
 * Generate personalized learning plan
 */
function generateLearningPlan(completedLessons, skillLevel, learningStyle) {
    const allTopics = [
        'Supervised Learning',
        'Unsupervised Learning',
        'Neural Networks',
        'Decision Trees',
        'Support Vector Machines',
        'K-Means Clustering',
        'Linear Regression',
        'Logistic Regression',
        'Feature Engineering',
        'Model Evaluation Metrics'
    ];

    const remainingTopics = allTopics.filter(t => !completedLessons.includes(t));
    const recommendations = recommendNextTopic(completedLessons);

    const plan = {
        completed: completedLessons,
        remaining: remainingTopics,
        recommended_next: recommendations,
        estimated_completion_time: Math.round(remainingTopics.length * 2.5), // hours
        personalized_for: {
            learning_style: learningStyle,
            skill_level: skillLevel
        }
    };

    return plan;
}

/**
 * Adapt explanations based on user queries and comprehension
 */
function adaptExplanationDetail(initialExplanation, userProfile, comprehensionLevel = 1.0) {
    // comprehensionLevel: 0.5 = need simpler explanation, 1.0 = good, 1.5 = need more detail

    if (comprehensionLevel < 0.8) {
        // User needs simpler explanation
        return adaptForSimplification(initialExplanation);
    } else if (comprehensionLevel > 1.2) {
        // User needs more details
        return adaptForEnhancement(initialExplanation);
    }

    return initialExplanation;
}

function adaptForSimplification(explanation) {
    // Remove complex terminology, use analogies
    let simplified = explanation
        .replace(/(?:complex|intricate|sophisticated|advanced)/gi, 'important')
        .replace(/(?:furthermore|moreover|additionally)/gi, 'also');
    return simplified;
}

function adaptForEnhancement(explanation) {
    // Add more technical details and examples
    return explanation + '\n\n[Additional technical details and edge cases available upon request]';
}

/**
 * Suggest breaks based on learning duration
 */
function suggestBreak(minutesStudied) {
    const breakGuidelines = {
        25: 'Time for a 5-minute break!',
        50: 'Time for a 10-minute break!',
        90: 'Time for a 15-minute break! You\'ve been studying hard!'
    };

    for (const [minutes, message] of Object.entries(breakGuidelines)) {
        if (minutesStudied === parseInt(minutes)) {
            return message;
        }
    }

    return null;
}

/**
 * Generate achievement badges based on progress
 */
function generateAchievementBadges(userProfile) {
    const badges = [];

    // Badges based on completed lessons
    if (userProfile.completed_lessons.length >= 3) {
        badges.push('🌟 Getting Started - Completed 3 lessons');
    }
    if (userProfile.completed_lessons.length >= 5) {
        badges.push('🎯 Dedicated Learner - Completed 5 lessons');
    }
    if (userProfile.completed_lessons.length >= 10) {
        badges.push('🏆 ML Master - Completed 10 lessons');
    }

    // Badge for learning style consistency
    if (userProfile.learning_style) {
        badges.push(`📚 ${userProfile.learning_style.charAt(0).toUpperCase() + userProfile.learning_style.slice(1)} Learner`);
    }

    // Badge for reaching advanced level
    if (userProfile.level === 'advanced') {
        badges.push('🚀 Advanced Scholar - Reached Advanced Level');
    }

    return badges;
}

/**
 * Personalized content importance scoring
 */
function scoreContentRelevance(topic, userProfile, completedLessons) {
    let score = 0;

    // Score based on learning path
    const learningPath = generateLearningPlan(completedLessons, userProfile.level, userProfile.learning_style);
    if (learningPath.recommended_next.includes(topic)) {
        score += 50; // Recommended topic
    }

    // Score based on skill level alignment
    const baseDifficulty = {
        'Supervised Learning': 1,
        'Linear Regression': 2,
        'Logistic Regression': 2,
        'Neural Networks': 4,
        'Decision Trees': 3,
        'Support Vector Machines': 3,
        'K-Means Clustering': 2,
        'Unsupervised Learning': 1,
        'Feature Engineering': 3,
        'Model Evaluation Metrics': 2
    };

    const levelMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const userLevel = levelMap[userProfile.level] || 1;
    const topicDifficulty = baseDifficulty[topic] || 2;

    if (Math.abs(topicDifficulty - userLevel) <= 1) {
        score += 30; // Well-matched difficulty
    }

    score += 20; // Base relevance

    return score;
}

/**
 * Weekly learning progress summary
 */
function generateWeeklyProgressSummary(progressHistory) {
    const summary = {
        lessons_completed: progressHistory.filter(p => p.type === 'lesson_completed').length,
        quiz_average: calculateAverage(progressHistory.filter(p => p.type === 'quiz').map(p => p.score)),
        total_time_spent: progressHistory.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
        learning_streak: calculateStreak(progressHistory),
        topics_explored: [...new Set(progressHistory.map(p => p.topic))].length
    };

    return summary;
}

function calculateAverage(scores) {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function calculateStreak(progressHistory) {
    // Calculate consecutive days of learning
    const dates = progressHistory
        .map(p => new Date(p.timestamp).toDateString())
        .filter((date, index, array) => array.indexOf(date) === index);
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < dates.length; i++) {
        const date = new Date(dates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (date.toDateString() === expectedDate.toDateString()) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

/**
 * Export personalization utilities
 */
const PersonalizationUtils = {
    adaptContentToLearningStyle,
    adjustDifficultyLevel,
    recommendNextTopic,
    trackUserProgress,
    calculateLearningScore,
    optimizeContentDelivery,
    generateLearningPlan,
    adaptExplanationDetail,
    suggestBreak,
    generateAchievementBadges,
    scoreContentRelevance,
    generateWeeklyProgressSummary
};

// Add personalization info display
function displayPersonalizationInfo(userProfile) {
    const optimization = optimizeContentDelivery(userProfile);
    const adaptation = adaptContentToLearningStyle('', userProfile.learning_style);
    const difficulty = adjustDifficultyLevel(userProfile.level);

    const infoBox = document.createElement('div');
    infoBox.className = 'personalization-info';
    infoBox.innerHTML = `
        <div style="background: #e7f3ff; padding: 1rem; border-radius: 5px; border-left: 4px solid #667eea; margin-bottom: 1rem;">
            <strong>🎯 Personalized for You:</strong><br>
            Learning Style: <span style="color: #667eea; font-weight: bold;">${userProfile.learning_style.charAt(0).toUpperCase() + userProfile.learning_style.slice(1)}</span><br>
            Skill Level: <span style="color: #667eea; font-weight: bold;">${userProfile.level.charAt(0).toUpperCase() + userProfile.level.slice(1)}</span><br>
            Content Order: ${optimization.priority.join(' → ')}
        </div>
    `;

    return infoBox;
}
