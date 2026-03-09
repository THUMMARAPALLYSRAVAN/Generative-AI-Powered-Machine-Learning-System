import os
import json
from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
import hashlib

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here-change-in-production')
Session(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# User profiles for personalization (in-memory, can be replaced with database)
user_profiles = {}

# Learning styles
LEARNING_STYLES = ['visual', 'auditory', 'reading', 'kinesthetic']

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
    """Generate concept explanation using Gemini API"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""You are an expert ML educator. Generate a {learning_style}-friendly explanation for the concept: "{concept}" 
        at {level} level. 
        
        For visual learners: Focus on diagrams, charts, and visual analogies.
        For auditory learners: Use metaphors, stories, and conversational tone.
        For reading learners: Provide detailed text explanations with examples.
        For kinesthetic learners: Include hands-on examples and interactive exercises.
        
        Keep the explanation concise but comprehensive. Format with clear sections."""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

def generate_code_example(concept, language='python', level='beginner'):
    """Generate code examples using Gemini API"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Generate a {level}-level {language} code example for: "{concept}"
        
        Include:
        1. Clear, well-commented code
        2. Explanation of each part
        3. Expected output
        4. Common mistakes to avoid
        
        Format the response with code blocks and explanations."""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating code: {str(e)}"

def generate_visual_description(concept):
    """Generate description for visual representations"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Generate a detailed description for creating an educational visual/diagram for: "{concept}"
        
        Include:
        1. What should be shown visually
        2. Color suggestions
        3. Key elements to highlight
        4. Layout recommendations
        5. Interactive elements to consider
        
        This will be used to create SVG diagrams."""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating visual description: {str(e)}"

def generate_audio_script(concept, level='beginner'):
    """Generate script for audio lessons"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Create an engaging audio lesson script for: "{concept}" at {level} level.
        
        Requirements:
        1. Conversational, friendly tone
        2. Include real-world examples
        3. Duration: 2-3 minutes when read aloud
        4. Add engagement markers [PAUSE], [QUESTION], [HIGHLIGHT]
        5. Suitable for text-to-speech conversion
        
        Format: Clear sections with timing notes."""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating audio script: {str(e)}"

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
    """Get explanation for a concept"""
    data = request.json
    concept = data.get('concept', '')
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    try:
        explanation = generate_concept_explanation(
            concept, 
            profile['learning_style'], 
            profile['level']
        )
        return jsonify({
            'success': True,
            'explanation': explanation
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/code', methods=['POST'])
def api_code():
    """Generate code example"""
    data = request.json
    concept = data.get('concept', '')
    language = data.get('language', 'python')
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    try:
        code = generate_code_example(concept, language, profile['level'])
        return jsonify({
            'success': True,
            'code': code
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/visual', methods=['POST'])
def api_visual():
    """Generate visual guide"""
    data = request.json
    concept = data.get('concept', '')
    
    try:
        visual = generate_visual_description(concept)
        return jsonify({
            'success': True,
            'visual_guide': visual
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/audio', methods=['POST'])
def api_audio():
    """Generate audio script"""
    data = request.json
    concept = data.get('concept', '')
    user_id = get_user_id()
    profile = get_user_profile(user_id)
    
    try:
        audio_script = generate_audio_script(concept, profile['level'])
        return jsonify({
            'success': True,
            'audio_script': audio_script
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
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
    data = request.json
    topic = data.get('topic', '')
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Create a 5-question multiple choice quiz for: "{topic}"
        
        Format your response as a JSON array with this structure:
        [
            {{
                "question": "Question text",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "A",
                "explanation": "Why this is correct"
            }}
        ]
        
        Return ONLY the JSON array, no other text."""
        
        response = model.generate_content(prompt)
        
        # Parse JSON from response
        json_str = response.text.strip()
        if json_str.startswith('```'):
            json_str = json_str.split('```')[1]
            if json_str.startswith('json'):
                json_str = json_str[4:]
        
        quiz_data = json.loads(json_str)
        
        return jsonify({
            'success': True,
            'quiz': quiz_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
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
