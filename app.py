"""
LearnSphere - AI-Powered Machine Learning Learning System
A personalized ML education platform using Flask and Google Gemini API
"""

import os
import json
from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
import hashlib
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
Session(app)

# Configure Gemini API with error handling
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Gemini API configured successfully")
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {str(e)}")
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

# User profiles for personalization (in-memory storage)
user_profiles = {}

# Learning styles
LEARNING_STYLES = ['visual', 'auditory', 'reading', 'kinesthetic']
SKILL_LEVELS = ['beginner', 'intermediate', 'advanced']

def get_user_id():
    """Get or create user ID from session"""
    if 'user_id' not in session:
        session['user_id'] = hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]
    return session['user_id']

def get_user_profile(user_id):
    """Get user profile or create new one"""
    if user_id not in user_profiles:
        user_profiles[user_id] = {
            'id': user_id,
            'learning_style': 'visual',
            'level': 'beginner',
            'completed_lessons': [],
            'preferences': {
                'code_examples': True,
                'visualizations': True,
                'audio_lessons': False,
                'detailed_explanations': True
            }
        }
    return user_profiles[user_id]

def generate_concept_explanation(concept, learning_style, level):
    """Generate concept explanation using Gemini API with style adaptation"""
    if not GEMINI_API_KEY:
        return "Error: Gemini API key not configured. Please add GEMINI_API_KEY to .env file."
    
    try:
        if learning_style not in LEARNING_STYLES:
            learning_style = 'visual'
        if level not in SKILL_LEVELS:
            level = 'beginner'
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        style_guide = {
            'visual': 'Focus on diagrams, charts, visual analogies, and flowcharts.',
            'auditory': 'Use metaphors, stories, conversational tone, and verbal explanations.',
            'reading': 'Provide detailed text explanations with multiple examples and definitions.',
            'kinesthetic': 'Include hands-on examples, practice exercises, and real-world applications.'
        }
        
        prompt = f"""You are an expert ML educator teaching {concept} to a {level} learner.

Generate an explanation that is {style_guide.get(learning_style, style_guide['visual'])}

Requirements:
- Keep explanation concise but comprehensive
- Use clear sections with headers
- Include 2-3 relevant examples
- Explain key concepts simply
- Avoid unnecessary jargon

Topic: {concept}
Learning Style: {learning_style}
Level: {level}"""
        
        response = model.generate_content(prompt)
        if response and response.text:
            logger.info(f"Generated explanation for {concept}")
            return response.text
        else:
            return "Could not generate explanation. Please try again."
            
    except Exception as e:
        logger.error(f"Error generating explanation for {concept}: {str(e)}")
        return f"Error generating content: {str(e)}"

def generate_code_example(concept, language='python', level='beginner'):
    """Generate code examples using Gemini API"""
    if not GEMINI_API_KEY:
        return "Error: Gemini API key not configured."
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        complexity_level = {
            'beginner': 'simple, basic syntax, few functions',
            'intermediate': 'moderate complexity, good practices, multiple functions',
            'advanced': 'complex patterns, optimization, design patterns'
        }
        
        prompt = f"""Generate a {complexity_level.get(level, 'simple')} {language} code example for: "{concept}"

Requirements:
- Write clean, well-documented code
- Include detailed comments explaining each section
- Add type hints where applicable
- Show expected output
- Highlight common mistakes to avoid
- Include 3-5 lines of execution examples

Format the response clearly with:
[CODE]
[EXPLANATION]
[OUTPUT]
[COMMON MISTAKES]"""
        
        response = model.generate_content(prompt)
        if response and response.text:
            logger.info(f"Generated code example for {concept}")
            return response.text
        else:
            return "Could not generate code example."
            
    except Exception as e:
        logger.error(f"Error generating code for {concept}: {str(e)}")
        return f"Error generating code: {str(e)}"

def generate_visual_description(concept):
    """Generate description for visual representations"""
    if not GEMINI_API_KEY:
        return "Error: Gemini API key not configured."
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Create a detailed visual/diagram description for: "{concept}"

Include:
1. What should be shown visually (objects, elements, relationships)
2. Color suggestions (background, highlights, text)
3. Key elements to emphasize or highlight
4. Layout and composition recommendations
5. Interactive elements to consider
6. Size and proportion guidelines

This description will be used by a designer to create an educational visual."""
        
        response = model.generate_content(prompt)
        if response and response.text:
            logger.info(f"Generated visual description for {concept}")
            return response.text
        else:
            return "Could not generate visual guide."
            
    except Exception as e:
        logger.error(f"Error generating visual for {concept}: {str(e)}")
        return f"Error generating visual: {str(e)}"

def generate_audio_script(concept, level='beginner'):
    """Generate script for audio lessons"""
    if not GEMINI_API_KEY:
        return "Error: Gemini API key not configured."
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Create an engaging audio lesson script for: "{concept}" at {level} level.

Requirements:
1. Conversational, friendly, and engaging tone
2. Include 2-3 real-world examples or analogies
3. Duration: 2-3 minutes when read aloud (approximately 300-450 words)
4. Add speech markers: [PAUSE 2s], [QUESTION], [EMPHASIS]
5. Suitable for text-to-speech (clear language, proper punctuation)
6. End with a summary and call-to-action

Format:
[INTRODUCTION]
[MAIN CONTENT with markers]
[SUMMARY]
[CALL TO ACTION]"""
        
        response = model.generate_content(prompt)
        if response and response.text:
            logger.info(f"Generated audio script for {concept}")
            return response.text
        else:
            return "Could not generate audio script."
            
    except Exception as e:
        logger.error(f"Error generating audio for {concept}: {str(e)}")
        return f"Error generating audio: {str(e)}"

def get_personalized_content(concept, user_id):
    """Get personalized learning content based on user profile"""
    profile = get_user_profile(user_id)
    
    return {
        'concept': concept,
        'learning_style': profile['learning_style'],
        'level': profile['level'],
        'explanation': generate_concept_explanation(concept, profile['learning_style'], profile['level']),
        'code_example': generate_code_example(concept, 'python', profile['level']) if profile['preferences']['code_examples'] else None,
        'visual_guide': generate_visual_description(concept) if profile['preferences']['visualizations'] else None,
        'audio_script': generate_audio_script(concept, profile['level']) if profile['preferences']['audio_lessons'] else None
    }

# Routes
@app.route('/')
def index():
    """Home page"""
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    return render_template('index.html', profile=profile)

@app.route('/dashboard')
def dashboard():
    """Learning dashboard"""
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    ml_topics = [
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
    ]
    
    return render_template('dashboard.html', 
                         profile=profile, 
                         topics=ml_topics,
                         learning_styles=LEARNING_STYLES)

@app.route('/lesson/<topic>')
def lesson(topic):
    """Individual lesson page"""
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    return render_template('lesson.html', topic=topic, profile=profile)

@app.route('/api/profile', methods=['GET', 'POST'])
def api_profile():
    """Update or get user profile"""
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    if request.method == 'POST':
        data = request.json
        if 'learning_style' in data:
            profile['learning_style'] = data['learning_style']
        if 'level' in data:
            profile['level'] = data['level']
        if 'preferences' in data:
            profile['preferences'].update(data['preferences'])
        user_profiles[user_id] = profile
    
    return jsonify(profile)

@app.route('/api/content/<topic>', methods=['GET'])
def api_content(topic):
    """Get personalized learning content for a topic"""
    user_id = get_user_id()
    
    try:
        content = get_personalized_content(topic, user_id)
        return jsonify({
            'success': True,
            'data': content
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/explain', methods=['POST'])
def api_explain():
    """API endpoint to get explanation for a concept"""
    try:
        data = request.json
        concept = data.get('concept', '').strip()
        
        if not concept:
            return jsonify({
                'success': False,
                'error': 'Concept is required'
            }), 400
        
        user_id = get_user_id()
        profile = get_user_profile(user_id)
        
        explanation = generate_concept_explanation(
            concept, 
            profile['learning_style'], 
            profile['level']
        )
        
        return jsonify({
            'success': True,
            'explanation': explanation,
            'learning_style': profile['learning_style'],
            'level': profile['level']
        })
    except Exception as e:
        logger.error(f"Error in /api/explain: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.route('/api/code', methods=['POST'])
def api_code():
    """API endpoint to generate code example"""
    try:
        data = request.json
        concept = data.get('concept', '').strip()
        language = data.get('language', 'python')
        
        if not concept:
            return jsonify({
                'success': False,
                'error': 'Concept is required'
            }), 400
        
        user_id = get_user_id()
        profile = get_user_profile(user_id)
        
        code = generate_code_example(concept, language, profile['level'])
        
        return jsonify({
            'success': True,
            'code': code,
            'language': language
        })
    except Exception as e:
        logger.error(f"Error in /api/code: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.route('/api/visual', methods=['POST'])
def api_visual():
    """API endpoint to generate visual guide"""
    try:
        data = request.json
        concept = data.get('concept', '').strip()
        
        if not concept:
            return jsonify({
                'success': False,
                'error': 'Concept is required'
            }), 400
        
        visual = generate_visual_description(concept)
        
        return jsonify({
            'success': True,
            'visual_guide': visual
        })
    except Exception as e:
        logger.error(f"Error in /api/visual: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.route('/api/audio', methods=['POST'])
def api_audio():
    """API endpoint to generate audio script"""
    try:
        data = request.json
        concept = data.get('concept', '').strip()
        
        if not concept:
            return jsonify({
                'success': False,
                'error': 'Concept is required'
            }), 400
        
        user_id = get_user_id()
        profile = get_user_profile(user_id)
        
        audio_script = generate_audio_script(concept, profile['level'])
        
        return jsonify({
            'success': True,
            'audio_script': audio_script
        })
    except Exception as e:
        logger.error(f"Error in /api/audio: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.route('/api/complete-lesson', methods=['POST'])
def api_complete_lesson():
    """Mark lesson as completed"""
    data = request.json
    lesson_id = data.get('lesson_id', '')
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    if lesson_id not in profile['completed_lessons']:
        profile['completed_lessons'].append(lesson_id)
    
    return jsonify({
        'success': True,
        'completed_lessons': profile['completed_lessons']
    })

@app.route('/api/quiz', methods=['POST'])
def api_quiz():
    """Generate quiz for a topic"""
    if not GEMINI_API_KEY:
        return jsonify({
            'success': False,
            'error': 'Gemini API key not configured'
        }), 503
    
    try:
        data = request.json
        topic = data.get('topic', '').strip()
        
        if not topic:
            return jsonify({
                'success': False,
                'error': 'Topic is required'
            }), 400
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Create a 5-question multiple choice quiz for: "{topic}"

Format ONLY as a JSON array, no additional text:
[
    {{
        "question": "Clear question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A",
        "explanation": "Why this is the correct answer with details."
    }}
]

Requirements:
- Each question must have exactly 4 options
- Explanations should be educational and detailed
- Mix difficulty levels
- Include practical examples
- Return ONLY valid JSON, no markdown, no extra text"""
        
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return jsonify({
                'success': False,
                'error': 'Failed to generate quiz'
            }), 500
        
        # Parse JSON from response - handle various formats
        json_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if json_text.startswith('```'):
            parts = json_text.split('```')
            json_text = parts[1] if len(parts) > 1 else json_text
            if json_text.startswith('json'):
                json_text = json_text[4:]
        
        json_text = json_text.strip()
        
        try:
            quiz_data = json.loads(json_text)
            
            # Validate quiz structure
            if not isinstance(quiz_data, list) or len(quiz_data) == 0:
                raise ValueError("Quiz is not a valid list")
            
            for q in quiz_data:
                if not all(k in q for k in ['question', 'options', 'correct_answer', 'explanation']):
                    raise ValueError("Quiz question missing required fields")
                if len(q['options']) != 4:
                    raise ValueError("Each question must have exactly 4 options")
            
            logger.info(f"Generated quiz for {topic}")
            return jsonify({
                'success': True,
                'quiz': quiz_data
            })
            
        except json.JSONDecodeError as je:
            logger.error(f"JSON parse error in quiz: {str(je)}")
            return jsonify({
                'success': False,
                'error': f"Invalid quiz format from API: {str(je)}"
            }), 500
            
    except Exception as e:
        logger.error(f"Error in /api/quiz: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.errorhandler(404)
def not_found(error):
    """404 error handler"""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
