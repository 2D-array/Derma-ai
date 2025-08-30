"""Vector store utilities for embedding storage and retrieval."""

import os
import pickle
from typing import List, Optional, Union
from pathlib import Path
import logging

from langchain.schema import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_pinecone import PineconeVectorStore
from sentence_transformers import SentenceTransformer
import pinecone

logger = logging.getLogger(__name__)


class VectorStoreManager:
    """Manages vector store operations for document embeddings."""
    
    def __init__(self, 
                 embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2",
                 vector_db_type: str = "faiss",
                 pinecone_api_key: Optional[str] = None,
                 pinecone_environment: Optional[str] = None,
                 pinecone_index_name: Optional[str] = None):
        self.embedding_model = embedding_model
        self.vector_db_type = vector_db_type
        self.pinecone_api_key = pinecone_api_key
        self.pinecone_environment = pinecone_environment
        self.pinecone_index_name = pinecone_index_name
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embedding_model,
            model_kwargs={'device': 'cpu'}
        )
        self.vector_store = None
    
    def create_vector_store(self, documents: List[Document]) -> Union[FAISS, PineconeVectorStore]:
        """Create a new vector store from documents."""
        if not documents:
            raise ValueError("No documents provided for vector store creation")
        
        logger.info(f"Creating {self.vector_db_type} vector store with {len(documents)} documents")
        
        if self.vector_db_type == "pinecone":
            # Initialize Pinecone
            if not self.pinecone_api_key or not self.pinecone_index_name:
                raise ValueError("Pinecone API key and index name are required for Pinecone vector store")
            
            # Create Pinecone vector store
            self.vector_store = PineconeVectorStore.from_documents(
                documents=documents,
                embedding=self.embeddings,
                index_name=self.pinecone_index_name,
                pinecone_api_key=self.pinecone_api_key
            )
        else:
            # Create FAISS vector store (default)
            self.vector_store = FAISS.from_documents(
                documents=documents,
                embedding=self.embeddings
            )
        
        logger.info("Vector store created successfully")
        return self.vector_store
    
    def save_vector_store(self, save_path: str) -> None:
        """Save the vector store to disk (only for FAISS)."""
        if self.vector_store is None:
            raise ValueError("No vector store to save")
        
        if self.vector_db_type == "pinecone":
            logger.info("Pinecone vector store is automatically persisted in the cloud")
            return
        
        save_dir = Path(save_path)
        save_dir.mkdir(parents=True, exist_ok=True)
        
        # Save FAISS index
        self.vector_store.save_local(str(save_dir))
        logger.info(f"Vector store saved to {save_path}")
    
    def load_vector_store(self, load_path: str) -> Union[FAISS, PineconeVectorStore]:
        """Load a vector store from disk or connect to Pinecone."""
        if self.vector_db_type == "pinecone":
            # Connect to existing Pinecone index
            if not self.pinecone_api_key or not self.pinecone_index_name:
                raise ValueError("Pinecone API key and index name are required")
            
            self.vector_store = PineconeVectorStore(
                index_name=self.pinecone_index_name,
                embedding=self.embeddings,
                pinecone_api_key=self.pinecone_api_key
            )
            logger.info(f"Connected to Pinecone index: {self.pinecone_index_name}")
        else:
            # Load FAISS index
            load_dir = Path(load_path)
            
            if not load_dir.exists():
                raise FileNotFoundError(f"Vector store not found at {load_path}")
            
            self.vector_store = FAISS.load_local(
                str(load_dir),
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True
            )
            logger.info(f"Vector store loaded from {load_path}")
        
        return self.vector_store
    
    def similarity_search(self, query: str, k: int = 5) -> List[Document]:
        """Perform similarity search on the vector store."""
        if self.vector_store is None:
            raise ValueError("Vector store not initialized")
        
        results = self.vector_store.similarity_search(query, k=k)
        logger.info(f"Found {len(results)} similar documents for query")
        
        return results
    
    def similarity_search_with_score(self, query: str, k: int = 5) -> List[tuple]:
        """Perform similarity search with relevance scores."""
        if self.vector_store is None:
            raise ValueError("Vector store not initialized")
        
        results = self.vector_store.similarity_search_with_score(query, k=k)
        logger.info(f"Found {len(results)} similar documents with scores")
        
        return results