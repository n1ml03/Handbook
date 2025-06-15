import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UpdateLog, updateLogsService } from '@/data/updateLogs';

interface UpdateLogsContextType {
  updateLogs: UpdateLog[];
  publishedUpdateLogs: UpdateLog[];
  isLoading: boolean;
  addUpdateLog: (log: Omit<UpdateLog, 'id'>) => Promise<UpdateLog>;
  updateUpdateLog: (id: string, updates: Partial<UpdateLog>) => Promise<UpdateLog | null>;
  deleteUpdateLog: (id: string) => Promise<boolean>;
  refreshUpdateLogs: () => Promise<void>;
}

const UpdateLogsContext = createContext<UpdateLogsContextType | undefined>(undefined);

interface UpdateLogsProviderProps {
  children: ReactNode;
}

export const UpdateLogsProvider: React.FC<UpdateLogsProviderProps> = ({ children }) => {
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed value for published logs only
  const publishedUpdateLogs = updateLogs.filter(log => log.isPublished);

  // Load update logs on mount
  useEffect(() => {
    loadUpdateLogs();
  }, []);

  const loadUpdateLogs = async () => {
    try {
      setIsLoading(true);
      const logs = updateLogsService.getUpdateLogs();
      setUpdateLogs(logs);
    } catch (error) {
      console.error('Error loading update logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addUpdateLog = async (log: Omit<UpdateLog, 'id'>): Promise<UpdateLog> => {
    try {
      const newLog = updateLogsService.addUpdateLog({
        ...log,
        content: log.content || log.description || ''
      });
      setUpdateLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (error) {
      console.error('Error adding update log:', error);
      throw error;
    }
  };

  const updateUpdateLog = async (id: string, updates: Partial<UpdateLog>): Promise<UpdateLog | null> => {
    try {
      const updatedLog = updateLogsService.updateUpdateLog(id, {
        ...updates,
        content: updates.content || updates.description || ''
      });
      if (updatedLog) {
        setUpdateLogs(prev => prev.map(log => log.id === id ? updatedLog : log));
      }
      return updatedLog;
    } catch (error) {
      console.error('Error updating update log:', error);
      throw error;
    }
  };

  const deleteUpdateLog = async (id: string): Promise<boolean> => {
    try {
      const success = updateLogsService.deleteUpdateLog(id);
      if (success) {
        setUpdateLogs(prev => prev.filter(log => log.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting update log:', error);
      throw error;
    }
  };

  const refreshUpdateLogs = async (): Promise<void> => {
    await loadUpdateLogs();
  };

  const value: UpdateLogsContextType = {
    updateLogs,
    publishedUpdateLogs,
    isLoading,
    addUpdateLog,
    updateUpdateLog,
    deleteUpdateLog,
    refreshUpdateLogs
  };

  return (
    <UpdateLogsContext.Provider value={value}>
      {children}
    </UpdateLogsContext.Provider>
  );
};

export const useUpdateLogs = (): UpdateLogsContextType => {
  const context = useContext(UpdateLogsContext);
  if (context === undefined) {
    throw new Error('useUpdateLogs must be used within an UpdateLogsProvider');
  }
  return context;
};

export default UpdateLogsContext; 