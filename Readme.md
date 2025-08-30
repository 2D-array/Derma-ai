# 🌟 Skincare RAG Assistant

An AI-powered Retrieval-Augmented Generation (RAG) application that provides personalized skincare recommendations based on authoritative dermatology literature.

## 📋 Overview

This application combines the power of large language models with a comprehensive knowledge base of skincare and dermatology texts to provide evidence-based, personalized skincare recommendations. Users fill out a detailed questionnaire about their skin type, concerns, and lifestyle, and receive tailored morning/evening routines, lifestyle tips, and targeted remedies.

## 🏗️ Architecture

```
skincare-rag-bot/
├── Data/                    # PDF documents (dermatology books)
├── backend/                 # FastAPI backend with RAG pipeline
│   ├── api.py              # FastAPI application
│   ├── models.py           # Pydantic data models
│   └── rag_pipeline.py     # RAG implementation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js         # Main application
│   └── package.json       # Frontend dependencies
├── config/                 # Configuration management
├── utils/                  # Utility functions
│   ├── document_processor.py  # PDF processing
│   └── vector_store.py        # Vector database management
└── requirements.txt        # Python dependencies
```

## 🚀 Features

### Backend (FastAPI + Python)
- **Document Processing**: Extracts and chunks text from PDF documents
- **Vector Database**: FAISS-based similarity search for relevant content retrieval
- **RAG Pipeline**: Combines retrieved context with user inputs for LLM processing
- **Evidence-Based**: Enforces grounding in retrieved literature, prevents hallucination
- **Structured Output**: Returns organized recommendations (morning/evening routines, tips, remedies)

### Frontend (React)
- **Interactive Questionnaire**: Comprehensive form for skin assessment
- **User-Friendly Interface**: Clean, responsive design
- **Real-time Results**: Displays personalized recommendations
- **Source Attribution**: Shows which documents informed the recommendations

## 📚 Data Sources

The application uses three authoritative dermatology texts:
- Andrews Diseases of the Skin Clinical Dermatology
- Cosmeceuticals and Active Cosmetics (3rd Edition)
- Textbook of Dermatology

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenRouter API key (or OpenAI API key)

### 1. Clone and Setup Python Environment

```bash
# Install dependencies
uv add -r requirements.txt

# Or using pip
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
OPENAI_API_KEY=your_openrouter_api_key_here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

### 3. Run Setup Script

```bash
python setup_project.py
```

### 4. Start Backend Server

```bash
python run_backend.py
```

The backend will be available at `http://localhost:8000`

### 5. Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Vector Database Options
- **FAISS** (default): Local vector storage, no external dependencies
- **Pinecone**: Cloud-based vector database (requires API key)
- **Chroma**: Alternative local vector database

### LLM Models
- **openai/gpt-oss-20b:free** (default): Free model via OpenRouter
- **GPT-3.5-turbo**: Cost-effective OpenAI model
- **GPT-4**: Higher quality but more expensive
- **Other OpenRouter models**: Many free and paid options available

## 📖 Usage

1. **Fill Questionnaire**: Complete the comprehensive skin assessment
   - Skin type (oily, dry, sensitive, combination, normal)
   - Concerns (acne, pigmentation, wrinkles, etc.)
   - Allergies and sensitivities
   - Lifestyle factors (sun exposure, stress, sleep)
   - Current routine and preferences

2. **Get Recommendations**: Receive structured advice including:
   - Morning skincare routine
   - Evening skincare routine
   - Lifestyle tips
   - Targeted remedies for specific concerns

3. **Review Sources**: See which dermatology texts informed your recommendations

## 🔒 Safety Features

- **Evidence-Based Only**: Recommendations must be grounded in retrieved literature
- **Medical Disclaimers**: Clear warnings about consulting dermatologists for severe issues
- **No Hallucination**: System responds with "No reliable information found" when context is insufficient
- **Source Attribution**: All recommendations linked to specific documents

## 🧪 API Endpoints

### POST `/recommendations`
Generate skincare recommendations based on user questionnaire.

**Request Body:**
```json
{
  "questionnaire": {
    "skin_type": "combination",
    "concerns": ["acne", "pigmentation"],
    "allergies": "fragrances",
    "prefers_natural": true,
    ...
  },
  "max_recommendations": 5
}
```

**Response:**
```json
{
  "recommendations": {
    "morning_routine": ["Gentle cleanser", "Vitamin C serum", "SPF 30+"],
    "evening_routine": ["Double cleanse", "Retinol treatment", "Moisturizer"],
    "lifestyle_tips": ["Drink more water", "Use silk pillowcases"],
    "remedies": ["Niacinamide for pores", "Azelaic acid for pigmentation"],
    "sources": ["Andrews-Diseases-of-the-Skin.pdf"],
    "warnings": ["Patch test new products"]
  },
  "user_profile_summary": "User with combination skin type, primary concerns: acne, pigmentation",
  "disclaimer": "These recommendations are for informational purposes only...",
  "success": true
}
```

### POST `/rebuild-index`
Rebuild the vector store index (admin endpoint).

## 🔍 Technical Details

### Document Processing
- **Chunking**: 800-token chunks with 100-token overlap
- **Cleaning**: Removes PDF artifacts and normalizes text
- **Metadata**: Tracks source documents and chunk information

### Vector Search
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Similarity**: Cosine similarity search
- **Retrieval**: Top-k relevant chunks for context

### LLM Integration
- **Temperature**: 0.1 (low randomness for consistency)
- **Max Tokens**: 1000 per response
- **Prompt Engineering**: Structured prompts enforce evidence-based responses

## 🚨 Troubleshooting

### Common Issues

1. **"Vector store not found"**
   - Run the backend once to build the initial vector store
   - Check that PDF files exist in the `Data/` directory

2. **"OpenAI API error"**
   - Verify your OpenRouter API key in the `.env` file
   - Check your OpenRouter account status and rate limits
   - Ensure the model `openai/gpt-oss-20b:free` is available

3. **"No documents found"**
   - Ensure PDF files are in the `Data/` directory
   - Check file permissions and formats

4. **Frontend connection issues**
   - Verify backend is running on port 8000
   - Check CORS settings in `backend/api.py`

### Performance Optimization

- **Vector Store**: Pre-build and cache for faster startup
- **Chunking**: Adjust chunk size based on document complexity
- **Retrieval**: Tune k-value for optimal context vs. speed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and research purposes. Please ensure compliance with the licensing terms of the source dermatology texts.

## ⚠️ Disclaimer

This application provides general skincare information based on dermatology literature. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified dermatologist for persistent skin issues or before starting new treatments.