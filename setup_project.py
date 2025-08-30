#!/usr/bin/env python3
"""Setup script to initialize the skincare RAG project."""

import os
import sys
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def check_requirements():
    """Check if all required files and directories exist."""
    required_dirs = ['Data', 'config', 'utils', 'backend', 'frontend']
    required_files = [
        'requirements.txt',
        '.env.example',
        'config/settings.py',
        'utils/document_processor.py',
        'utils/vector_store.py',
        'backend/api.py',
        'backend/models.py',
        'backend/rag_pipeline.py'
    ]
    
    missing_items = []
    
    for directory in required_dirs:
        if not Path(directory).exists():
            missing_items.append(f"Directory: {directory}")
    
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_items.append(f"File: {file_path}")
    
    if missing_items:
        logger.error("Missing required items:")
        for item in missing_items:
            logger.error(f"  - {item}")
        return False
    
    logger.info("✅ All required files and directories found")
    return True

def check_data_files():
    """Check if PDF files exist in Data directory."""
    data_dir = Path('Data')
    pdf_files = list(data_dir.glob('*.pdf'))
    
    if not pdf_files:
        logger.warning("⚠️  No PDF files found in Data/ directory")
        logger.info("Please add your skincare PDF documents to the Data/ folder")
        return False
    
    logger.info(f"✅ Found {len(pdf_files)} PDF files in Data/ directory:")
    for pdf_file in pdf_files:
        logger.info(f"  - {pdf_file.name}")
    
    return True

def check_environment():
    """Check if .env file exists and has required variables."""
    env_file = Path('.env')
    
    if not env_file.exists():
        logger.warning("⚠️  .env file not found")
        logger.info("Please copy .env.example to .env and fill in your API keys:")
        logger.info("  cp .env.example .env")
        return False
    
    # Check for OpenAI API key
    with open('.env', 'r') as f:
        env_content = f.read()
        if 'OPENAI_API_KEY=your_openai_api_key_here' in env_content:
            logger.warning("⚠️  Please update your OpenAI API key in .env file")
            return False
    
    logger.info("✅ Environment file configured")
    return True

def create_directories():
    """Create necessary directories."""
    directories = ['vector_store', 'logs']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        logger.info(f"📁 Created directory: {directory}")

def main():
    """Main setup function."""
    logger.info("🔧 Setting up Skincare RAG Project...")
    logger.info("=" * 50)
    
    # Check requirements
    if not check_requirements():
        logger.error("❌ Setup failed: Missing required files")
        sys.exit(1)
    
    # Check data files
    data_ok = check_data_files()
    
    # Check environment
    env_ok = check_environment()
    
    # Create directories
    create_directories()
    
    logger.info("=" * 50)
    
    if data_ok and env_ok:
        logger.info("🎉 Project setup complete!")
        logger.info("\nNext steps:")
        logger.info("1. Install dependencies: uv add -r requirements.txt")
        logger.info("2. Run backend: python run_backend.py")
        logger.info("3. In another terminal, run frontend:")
        logger.info("   cd frontend && npm install && npm start")
    else:
        logger.warning("⚠️  Setup completed with warnings")
        logger.info("Please address the warnings above before running the application")

if __name__ == "__main__":
    main()