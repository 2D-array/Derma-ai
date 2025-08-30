"""RAG pipeline for skincare recommendations."""

import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

from langchain.schema import Document
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

from config.settings import get_settings

settings = get_settings()
from utils.document_processor import DocumentProcessor
from utils.vector_store import VectorStoreManager
from backend.models import UserQuestionnaire, SkincareRecommendation

logger = logging.getLogger(__name__)


class SkincareRAGPipeline:
    """RAG pipeline for generating skincare recommendations."""
    
    def __init__(self):
        self.document_processor = DocumentProcessor(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        self.vector_store_manager = VectorStoreManager(
            embedding_model=settings.EMBEDDING_MODEL,
            vector_db_type=settings.VECTOR_DB_TYPE,
            pinecone_api_key=settings.PINECONE_API_KEY,
            pinecone_environment=settings.PINECONE_ENVIRONMENT,
            pinecone_index_name=settings.PINECONE_INDEX_NAME
        )
        # Configure LLM for OpenRouter
        llm_kwargs = {
            "model": settings.LLM_MODEL,
            "temperature": settings.TEMPERATURE,
            "max_tokens": settings.MAX_TOKENS,
            "openai_api_key": settings.OPENAI_API_KEY
        }
        
        # Add base URL if using OpenRouter
        if settings.OPENAI_BASE_URL:
            llm_kwargs["openai_api_base"] = settings.OPENAI_BASE_URL
        
        self.llm = ChatOpenAI(**llm_kwargs)
        self.vector_store = None
        self._setup_prompt_template()
    
    def _setup_prompt_template(self):
        """Setup the prompt template for recommendations."""
        self.prompt_template = ChatPromptTemplate.from_template("""
You are a professional skincare consultant with expertise in dermatology and cosmetic science. 
Your role is to provide evidence-based skincare recommendations based ONLY on the provided context from authoritative skincare and dermatology sources.

CRITICAL INSTRUCTIONS:
1. Base ALL recommendations ONLY on the provided context
2. If the context doesn't contain relevant information, respond with: "No reliable information found in documents for this specific concern."
3. Never provide medical advice for severe conditions - always recommend consulting a dermatologist
4. Focus on evidence-based recommendations, not marketing claims
5. Structure your response in the exact format requested

CONTEXT FROM SKINCARE LITERATURE:
{context}

USER PROFILE:
- Skin Type: {skin_type}
- Primary Concerns: {concerns}
- Allergies/Sensitivities: {allergies}
- Preferences: Natural products: {prefers_natural}, Budget: {budget_range}
- Lifestyle: Sun exposure: {sun_exposure}, Stress: {stress_level}, Sleep: {sleep_quality}
- Current Routine: {current_routine}
- Additional Notes: {additional_notes}

Based ONLY on the provided context, provide skincare recommendations in this exact JSON format. 
IMPORTANT: Your response must be ONLY valid JSON, no additional text before or after:

{{
    "morning_routine": ["step 1", "step 2", "step 3"],
    "evening_routine": ["step 1", "step 2", "step 3"],
    "lifestyle_tips": ["tip 1", "tip 2", "tip 3"],
    "remedies": ["remedy 1", "remedy 2", "remedy 3"],
    "warnings": ["warning 1 if applicable"]
}}

If you cannot find reliable information in the context for any category, include "No reliable information found in documents" for that category.
Return ONLY the JSON object, nothing else.
""")
    
    def initialize_vector_store(self, force_rebuild: bool = False) -> None:
        """Initialize or load the vector store."""
        if settings.VECTOR_DB_TYPE == "pinecone":
            # For Pinecone, try to connect to existing index first
            if not force_rebuild:
                try:
                    logger.info("Connecting to existing Pinecone index...")
                    self.vector_store = self.vector_store_manager.load_vector_store("")
                    return
                except Exception as e:
                    logger.warning(f"Failed to connect to Pinecone index: {e}. Creating new index...")
            
            # Build new vector store in Pinecone
            logger.info("Building new Pinecone vector store from documents...")
            documents = self.document_processor.process_documents(settings.DATA_PATH)
            
            if not documents:
                raise ValueError("No documents found to build vector store")
            
            self.vector_store = self.vector_store_manager.create_vector_store(documents)
            logger.info("Pinecone vector store initialized successfully")
        
        else:
            # FAISS logic (existing)
            vector_store_path = Path(settings.VECTOR_STORE_PATH)
            
            # Check if vector store exists and load it
            if vector_store_path.exists() and not force_rebuild:
                try:
                    logger.info("Loading existing FAISS vector store...")
                    self.vector_store = self.vector_store_manager.load_vector_store(
                        str(vector_store_path)
                    )
                    return
                except Exception as e:
                    logger.warning(f"Failed to load vector store: {e}. Rebuilding...")
            
            # Build new vector store
            logger.info("Building new FAISS vector store from documents...")
            documents = self.document_processor.process_documents(settings.DATA_PATH)
            
            if not documents:
                raise ValueError("No documents found to build vector store")
            
            self.vector_store = self.vector_store_manager.create_vector_store(documents)
            self.vector_store_manager.save_vector_store(str(vector_store_path))
            
            logger.info("FAISS vector store initialized successfully")
    
    def _format_user_query(self, questionnaire: UserQuestionnaire) -> str:
        """Format user questionnaire into a search query."""
        query_parts = [
            f"skin type {questionnaire.skin_type.value}",
            f"concerns {' '.join([c.value for c in questionnaire.concerns])}"
        ]
        
        if questionnaire.allergies:
            query_parts.append(f"allergies {questionnaire.allergies}")
        
        if questionnaire.prefers_natural:
            query_parts.append("natural skincare")
        
        return " ".join(query_parts)
    
    def _retrieve_relevant_context(self, questionnaire: UserQuestionnaire, k: int = 5) -> List[Document]:
        """Retrieve relevant documents from vector store."""
        if self.vector_store is None:
            raise ValueError("Vector store not initialized")
        
        query = self._format_user_query(questionnaire)
        logger.info(f"Searching for: {query}")
        
        # Get relevant documents
        relevant_docs = self.vector_store_manager.similarity_search(query, k=k)
        
        return relevant_docs
    
    def generate_recommendations(self, questionnaire: UserQuestionnaire) -> Dict[str, Any]:
        """Generate skincare recommendations using RAG pipeline."""
        try:
            # Retrieve relevant context
            relevant_docs = self._retrieve_relevant_context(questionnaire)
            
            if not relevant_docs:
                return {
                    "morning_routine": ["No reliable information found in documents"],
                    "evening_routine": ["No reliable information found in documents"],
                    "lifestyle_tips": ["No reliable information found in documents"],
                    "remedies": ["No reliable information found in documents"],
                    "sources": [],
                    "warnings": ["Insufficient information available - consult a dermatologist"]
                }
            
            # Prepare context
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            sources = list(set([doc.metadata.get("source", "Unknown") for doc in relevant_docs]))
            
            # Format prompt
            formatted_prompt = self.prompt_template.format(
                context=context,
                skin_type=questionnaire.skin_type.value,
                concerns=", ".join([c.value for c in questionnaire.concerns]),
                allergies=questionnaire.allergies or "None specified",
                prefers_natural=questionnaire.prefers_natural,
                budget_range=questionnaire.budget_range or "Not specified",
                sun_exposure=questionnaire.sun_exposure or "Not specified",
                stress_level=questionnaire.stress_level or "Not specified",
                sleep_quality=questionnaire.sleep_quality or "Not specified",
                current_routine=questionnaire.current_routine or "None specified",
                additional_notes=questionnaire.additional_notes or "None"
            )
            
            # Generate response
            response = self.llm.invoke(formatted_prompt)
            
            # Parse JSON response
            import json
            import re
            try:
                response_text = response.content.strip()
                logger.info(f"Raw LLM response length: {len(response_text)} chars")
                
                # Try to extract JSON from the response
                # Look for JSON object pattern
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    json_text = json_match.group(0)
                    logger.info(f"Extracted JSON: {json_text[:200]}...")
                else:
                    # Fallback: try to clean the response
                    json_text = response_text
                    if "```json" in json_text:
                        json_text = json_text.split("```json")[1].split("```")[0].strip()
                    elif "```" in json_text:
                        json_text = json_text.split("```")[1].split("```")[0].strip()
                
                recommendations = json.loads(json_text)
                recommendations["sources"] = sources
                return recommendations
                
            except (json.JSONDecodeError, AttributeError) as e:
                logger.error(f"Failed to parse LLM response as JSON: {e}")
                logger.error(f"Raw response (first 1000 chars): {response.content[:1000]}")
                return {
                    "morning_routine": ["Error processing recommendations"],
                    "evening_routine": ["Error processing recommendations"],
                    "lifestyle_tips": ["Error processing recommendations"],
                    "remedies": ["Error processing recommendations"],
                    "sources": sources,
                    "warnings": ["Error in recommendation generation - consult a dermatologist"]
                }
        
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return {
                "morning_routine": ["Error generating recommendations"],
                "evening_routine": ["Error generating recommendations"],
                "lifestyle_tips": ["Error generating recommendations"],
                "remedies": ["Error generating recommendations"],
                "sources": [],
                "warnings": ["System error - consult a dermatologist"]
            }