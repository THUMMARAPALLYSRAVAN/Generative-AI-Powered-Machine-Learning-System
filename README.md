# LearnSphere 🧠

## AI-Powered Machine Learning Learning System

LearnSphere is an intelligent, personalized learning platform that teaches Machine Learning concepts through multiple modalities: text explanations, code examples, visual guides, and audio lessons. The platform adapts content based on each user's learning style, skill level, and preferences.

---

## 🌟 Features

### Core Learning Features
- **Concept Explanations**: AI-generated, detailed explanations of ML concepts
- **Code Examples**: Real, working Python code with comprehensive comments
- **Visual Learning**: Textual descriptions for creating visual aids and diagrams
- **Audio Lessons**: Text-to-speech enabled audio explanations
- **Knowledge Quizzes**: AI-generated quiz questions for self-assessment

### Personalization Features
- **Learning Style Adaptation**: Content adapts to visual, auditory, reading, or kinesthetic preferences
- **Skill Level Adjustment**: Content difficulty scales from beginner to advanced
- **Content Preferences**: Users can toggle code examples, visualizations, and audio
- **Progress Tracking**: Track completed lessons and learning progress
- **Achievement Badges**: Earn badges as you progress

### Machine Learning Topics Covered
- Supervised Learning
- Unsupervised Learning
- Neural Networks
- Decision Trees
- Support Vector Machines
- K-Means Clustering
- Linear Regression
- Logistic Regression
- Feature Engineering
- Model Evaluation Metrics

---

## 📋 Requirements

### System Requirements
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Gemini API access (Google account required)

### Python Dependencies
See `requirements.txt` for exact versions. Key packages:
- Flask 2.3.3 - Web framework
- google-generativeai - Gemini API client
- python-dotenv - Environment variable management
- Flask-Session - Session management

---

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project
```bash
cd c:\Users\Sravan\OneDrive\Desktop\GEN AI FORAGE\LearnSphere
```

### Step 2: Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Set Up API Keys
1. Get your Gemini API key:
   - Go to https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

3. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
SECRET_KEY=generate_a_random_secret_key_here
```

### Step 5: Run the Application
```bash
python app.py
```

The application will start on `http://localhost:5000`

---

## 💻 Usage Guide

### First Visit
1. Go to `http://localhost:5000` in your browser
2. Click "Start Learning" or "Enter Dashboard"
3. Configure your profile:
   - Choose your learning style (Visual, Auditory, Reading, or Kinesthetic)
   - Select your skill level (Beginner, Intermediate, Advanced)
   - Enable/disable content types based on preferences

### Learning a Topic
1. Select a topic from the dashboard
2. A modal opens with 5 tabs:
   - **📖 Explanation**: Read the concept explanation
   - **💻 Code**: View Python code examples
   - **🎨 Visual**: See visual guide descriptions
   - **🎧 Audio**: Listen to audio script (with read-aloud button)
   - **📝 Quiz**: Test your knowledge with AI-generated questions

3. Click "Mark as Completed" to track progress

### Profile Management
- Update learning style anytime to change content adaptation
- Adjust skill level as you progress
- Toggle individual content types on/off
- View your progress stats in the sidebar

---

## 🔧 Project Structure

```
LearnSphere/
├── app.py                           # Flask application & API routes
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment variables template
├── .env                             # Your actual API keys (create from .env.example)
│
├── templates/                       # HTML templates
│   ├── index.html                  # Home page
│   ├── dashboard.html              # Learning dashboard
│   └── lesson.html                 # Individual lesson view
│
└── static/                         # Frontend assets
    ├── css/
    │   └── style.css               # Main stylesheet (responsive design)
    └── js/
        ├── main.js                 # Core functionality & API calls
        └── personalization.js      # Personalization algorithms
```

---

## 🔌 API Endpoints

### User Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile

### Content Generation
- `POST /api/explain` - Get concept explanation
- `POST /api/code` - Get code examples
- `POST /api/visual` - Get visual guide
- `POST /api/audio` - Get audio script
- `POST /api/quiz` - Get quiz questions

### Progress Tracking
- `POST /api/complete-lesson` - Mark lesson as completed

### Pages
- `GET /` - Home page
- `GET /dashboard` - Learning dashboard
- `GET /lesson/<topic>` - Individual lesson page

---

## 🎨 Customization

### Change Topics
Edit the topics list in `app.py` - `dashboard()` function:
```python
ml_topics = [
    'Your Topic Here',
    'Another Topic',
    # ...
]
```

### Adjust Learning Styles
Modify the `LEARNING_STYLES` list in `app.py`:
```python
LEARNING_STYLES = ['visual', 'auditory', 'reading', 'kinesthetic']
```

### Theme Colors
Edit CSS variables in `static/css/style.css`:
- Primary color: `#667eea`
- Secondary color: `#764ba2`
- Success color: `#28a745`

---

## 📊 How Personalization Works

### Learning Style Adaptation
The system generates content tailored to your learning preference:
- **Visual**: Emphasis on diagrams, charts, visual analogies
- **Auditory**: Conversational tone, metaphors, stories
- **Reading**: Detailed text explanations with examples
- **Kinesthetic**: Hands-on examples, interactive exercises

### Skill Level Adjustment
Content complexity scales based on your level:
- **Beginner**: Simple concepts, basic code, few examples
- **Intermediate**: Moderate explanations, medium complexity
- **Advanced**: Detailed concepts, complex code, many examples

### Preference Control
Toggle specific content types:
- Code Examples (default: on)
- Visualizations (default: on)
- Audio Lessons (default: off)
- Detailed Explanations (default: on)

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Make sure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

### API Key errors
1. Check that `.env` file exists in the project root
2. Verify your Gemini API key is correct
3. Ensure API key has no extra spaces

### Port already in use
If port 5000 is in use, modify in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change port number
```

### Content not loading
1. Check browser console for JavaScript errors (F12)
2. Verify Flask is running without errors
3. Ensure API key is valid (check Gemini console)

---

## 🔐 Security Notes

### For Production
1. Change `SECRET_KEY` in `.env` to a secure random string
2. Set `FLASK_ENV=production` in `.env`
3. Set `FLASK_DEBUG=False` in `.env`
4. Use a production WSGI server (e.g., Gunicorn)
5. Set up HTTPS/SSL
6. Use a proper database instead of in-memory profiles
7. Implement rate limiting on API endpoints
8. Add user authentication if sharing

### API Security
- Never commit `.env` file with real API keys
- Consider using environment-specific API keys
- Monitor API usage for unusual activity

---

## 📚 Technologies Used

### Backend
- **Flask**: Lightweight Python web framework
- **Google Gemini API**: AI content generation
- **Flask-Session**: User session management

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with variables
- **JavaScript (Vanilla)**: No dependencies, lightweight
- **Web Speech API**: Audio playback (native browser support)

### APIs & Services
- **Google Generative AI API**: Content generation and personalization
- **Web Browser APIs**: Session storage, speech synthesis

---

## 🚦 Getting Started Quick Start

### For Impatient Users:
```bash
# 1. Navigate to project
cd c:\Users\Sravan\OneDrive\Desktop\GEN AI FORAGE\LearnSphere

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file with API key
copy .env.example .env
# Edit .env and add your Gemini API key

# 5. Run
python app.py

# 6. Open browser to http://localhost:5000
```

---

## 📈 Learning Path Recommendation

Recommended order for beginners:
1. Supervised Learning (foundations)
2. Unsupervised Learning (contrast)
3. Linear Regression (core ML)
4. Logistic Regression (classification)
5. Decision Trees (alternative approach)
6. Neural Networks (advanced)
7. Feature Engineering (practical skills)
8. Model Evaluation Metrics (assessment)

---

## 🤝 Contributing & Extending

### Add New Topics
1. Add topic to the topics list in `dashboard()` function
2. Access via `/lesson/<topic_name>` URL
3. All content will be generated automatically

### Add New Learning Styles
1. Edit `LEARNING_STYLES` in `app.py`
2. Update prompt templates in content generation functions
3. Modify CSS for styling

### Customize AI Prompts
Edit the prompt templates in these functions in `app.py`:
- `generate_concept_explanation()`
- `generate_code_example()`
- `generate_visual_description()`
- `generate_audio_script()`

---

## 📞 Support & Resources

### Documentation
- Flask: https://flask.palletsprojects.com/
- Google Generative AI: https://ai.google.dev/
- JavaScript Web APIs: https://developer.mozilla.org/en-US/docs/Web/API

### Common Issues
- API rate limits? Implement caching or request throttling
- Want database persistence? Switch from in-memory to SQLAlchemy
- Need authentication? Add Flask-Login extension

---

## 📝 License

This project is created for educational purposes as part of the "Gen AI Forage" initiative.

---

## 🎯 Project Goals Achieved

✅ **Concept Explanation** - AI-generated, style-adapted explanations  
✅ **Code Generation** - Working Python examples with comments  
✅ **Visual Learning Aids** - Descriptive guides for creating visuals  
✅ **Audio Lessons** - Text-to-speech enabled audio scripts  
✅ **Personalized Learning** - Adapts to style, level, and preferences  
✅ **Multiple Technologies** - Flask, Python, HTML, CSS, JS, Gemini API  

---

**Happy Learning with LearnSphere! 🚀📚**
#   G e n e r a t i v e - A I - P o w e r e d - M a c h i n e - L e a r n i n g - S y s t e m  
 