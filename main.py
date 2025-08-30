#!/usr/bin/env python3
"""Main script to process and index documents for the skincare RAG system."""

import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from utils.document_processor import DocumentProcessor
from utils.vector_store import VectorStoreManager
from config.settings import get_settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Main function to process documents and create vector store."""
    # Load environment variables
    load_dotenv()
    
    # Get settings
    settings = get_settings()
    
    logger.info("🚀 Starting document processing and indexing...")
    logger.info(f"Vector DB Type: {settings.VECTOR_DB_TYPE}")
    logger.info(f"Data Path: {settings.DATA_PATH}")
    
    # Initialize document processor
    doc_processor = DocumentProcessor(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP
    )
    
    # Process documents
    logger.info("📄 Processing PDF documents...")
    documents = doc_processor.process_documents(settings.DATA_PATH)
    
    if not documents:
        logger.error("❌ No documents were processed. Check your Data/ directory.")
        sys.exit(1)
    
    logger.info(f"✅ Processed {len(documents)} document chunks")
    
    # Initialize vector store manager
    vector_manager = VectorStoreManager(
        embedding_model=settings.EMBEDDING_MODEL,
        vector_db_type=settings.VECTOR_DB_TYPE,
        pinecone_api_key=settings.PINECONE_API_KEY,
        pinecone_environment=settings.PINECONE_ENVIRONMENT,
        pinecone_index_name=settings.PINECONE_INDEX_NAME
    )
    
    # Create and save vector store
    logger.info("🔍 Creating vector store...")
    try:
        vector_store = vector_manager.create_vector_store(documents)
        
        if settings.VECTOR_DB_TYPE == "faiss":
            vector_manager.save_vector_store(settings.VECTOR_STORE_PATH)
            logger.info(f"💾 Vector store saved to {settings.VECTOR_STORE_PATH}")
        else:
            logger.info("☁️ Documents indexed in Pinecone cloud")
        
        logger.info("🎉 Document indexing completed successfully!")
        
        # Test the vector store
        logger.info("🧪 Testing vector store with sample query...")
        test_results = vector_manager.similarity_search("acne treatment", k=3)
        logger.info(f"Found {len(test_results)} relevant documents for 'acne treatment'")
        
        for i, doc in enumerate(test_results[:2]):
            logger.info(f"Sample result {i+1}: {doc.page_content[:100]}...")
    
    except Exception as e:
        logger.error(f"❌ Error creating vector store: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
