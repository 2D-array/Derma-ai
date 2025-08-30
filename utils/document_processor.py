"""Document processing utilities for PDF extraction and chunking."""

import os
from typing import List, Dict
from pathlib import Path
import logging

from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """Handles PDF processing and text chunking for RAG pipeline."""
    
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text content from a PDF file."""
        try:
            reader = PdfReader(pdf_path)
            text = ""
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            return self._clean_text(text)
        
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
            return ""
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text."""
        # Remove excessive whitespace
        text = " ".join(text.split())
        
        # Remove common PDF artifacts
        text = text.replace("", "")  # Remove null characters
        text = text.replace("\x00", "")
        
        return text
    
    def process_documents(self, data_path: str) -> List[Document]:
        """Process all PDF documents in the data directory."""
        documents = []
        data_dir = Path(data_path)
        
        if not data_dir.exists():
            logger.error(f"Data directory {data_path} does not exist")
            return documents
        
        pdf_files = list(data_dir.glob("*.pdf"))
        logger.info(f"Found {len(pdf_files)} PDF files to process")
        
        for pdf_file in pdf_files:
            logger.info(f"Processing {pdf_file.name}")
            text = self.extract_text_from_pdf(str(pdf_file))
            
            if text:
                # Create chunks from the document
                chunks = self.text_splitter.split_text(text)
                
                for i, chunk in enumerate(chunks):
                    doc = Document(
                        page_content=chunk,
                        metadata={
                            "source": pdf_file.name,
                            "chunk_id": i,
                            "total_chunks": len(chunks)
                        }
                    )
                    documents.append(doc)
                
                logger.info(f"Created {len(chunks)} chunks from {pdf_file.name}")
        
        logger.info(f"Total documents processed: {len(documents)}")
        return documents