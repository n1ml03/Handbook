import React, { createContext, useContext, useState, useCallback } from 'react';
import { Document } from '@/data';

interface DocumentsContextType {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = useCallback((document: Document) => {
    setDocuments(prev => [document, ...prev]);
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : doc
    ));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  return (
    <DocumentsContext.Provider value={{ documents, addDocument, updateDocument, deleteDocument }}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
}; 