export interface UpdateLog {
  id: string;
  version: string;
  title: string;
  description: string;
  content: string;
  date: string;
  isPublished: boolean;
  tags: string[];
  technicalDetails: string[];
  bugFixes: string[];
  screenshots: string[];
  metrics: {
    performanceImprovement: string;
    userSatisfaction: string;
    bugReports: number;
  };
}

// Initial update logs data
export const initialUpdateLogs: UpdateLog[] = [
  {
    id: '1',
    version: '2.1.0',
    title: 'New Character System',
    description: 'Added enhanced character progression system with skill trees and advanced customization options.',
    content: 'Major character system overhaul with new progression mechanics and customization features.',
    date: '2024-01-15',
    isPublished: true,
    tags: ['characters', 'progression', 'customization'],
    technicalDetails: [
      'Implemented new skill tree algorithm with O(log n) complexity',
      'Added Redis caching for character data',
      'Optimized rendering pipeline for 60fps character animations',
      'Integrated new AI-driven character recommendation system'
    ],
    bugFixes: [
      'Fixed memory leak in character selector',
      'Resolved character data sync issues',
      'Fixed skill point calculation errors'
    ],
    screenshots: ['character-system.jpg', 'skill-tree.jpg'],
    metrics: {
      performanceImprovement: '35%',
      userSatisfaction: '94%',
      bugReports: -65
    }
  },
  {
    id: '2',
    version: '2.0.5',
    title: 'UI/UX Improvements',
    description: 'Major interface overhaul with improved navigation and responsive design.',
    content: 'Complete UI/UX redesign with modern interface and improved user experience.',
    date: '2024-01-10',
    isPublished: true,
    tags: ['ui', 'ux', 'design', 'responsive'],
    technicalDetails: [
      'Migrated to CSS Grid layout system',
      'Implemented WCAG 2.1 AA compliance',
      'Added dark mode support with system preference detection',
      'Optimized bundle size by 40% through code splitting'
    ],
    bugFixes: [
      'Fixed mobile navigation overlay issues',
      'Resolved accessibility keyboard navigation',
      'Fixed responsive breakpoint inconsistencies'
    ],
    screenshots: ['new-ui.jpg', 'mobile-design.jpg'],
    metrics: {
      performanceImprovement: '25%',
      userSatisfaction: '89%',
      bugReports: -45
    }
  },
  {
    id: '3',
    version: '2.0.4',
    title: 'Bug Fixes & Optimizations',
    description: 'Various bug fixes and performance optimizations for better user experience.',
    content: 'Comprehensive bug fixes and performance improvements across the platform.',
    date: '2024-01-05',
    isPublished: true,
    tags: ['bugfix', 'optimization', 'performance'],
    technicalDetails: [
      'Implemented lazy loading for large datasets',
      'Added database query optimization',
      'Introduced service worker for offline functionality',
      'Enhanced error tracking and reporting'
    ],
    bugFixes: [
      'Fixed race condition in data fetching',
      'Resolved memory leaks in event listeners',
      'Fixed search index corruption issues',
      'Resolved timezone display inconsistencies'
    ],
    screenshots: ['performance-graph.jpg'],
    metrics: {
      performanceImprovement: '45%',
      userSatisfaction: '91%',
      bugReports: -78
    }
  },
  {
    id: '4',
    version: '2.0.3',
    title: 'New Year Update',
    description: 'Special New Year features and content additions.',
    content: 'Holiday-themed update with special events and features.',
    date: '2024-01-01',
    isPublished: true,
    tags: ['holiday', 'content', 'events'],
    technicalDetails: [
      'Added event system architecture',
      'Implemented real-time statistics dashboard',
      'Created theme switching system',
      'Added social sharing functionality'
    ],
    bugFixes: [
      'Fixed calendar display issues',
      'Resolved theme switching bugs'
    ],
    screenshots: ['new-year-theme.jpg', 'event-system.jpg'],
    metrics: {
      performanceImprovement: '15%',
      userSatisfaction: '87%',
      bugReports: -23
    }
  }
];

// Local storage key
export const UPDATE_LOGS_STORAGE_KEY = 'doax-update-logs';

// Utility functions for managing update logs
export const updateLogsService = {
  // Get all update logs from localStorage or return initial data
  getUpdateLogs: (): UpdateLog[] => {
    if (typeof window === 'undefined') return initialUpdateLogs;
    
    try {
      const stored = localStorage.getItem(UPDATE_LOGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialUpdateLogs;
    } catch (error) {
      console.error('Error reading update logs from localStorage:', error);
      return initialUpdateLogs;
    }
  },

  // Save update logs to localStorage
  saveUpdateLogs: (logs: UpdateLog[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(UPDATE_LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving update logs to localStorage:', error);
    }
  },

  // Add a new update log
  addUpdateLog: (log: Omit<UpdateLog, 'id'>): UpdateLog => {
    const newLog: UpdateLog = {
      ...log,
      id: Date.now().toString()
    };
    
    const logs = updateLogsService.getUpdateLogs();
    const updatedLogs = [newLog, ...logs];
    updateLogsService.saveUpdateLogs(updatedLogs);
    
    return newLog;
  },

  // Update an existing update log
  updateUpdateLog: (id: string, updates: Partial<UpdateLog>): UpdateLog | null => {
    const logs = updateLogsService.getUpdateLogs();
    const index = logs.findIndex(log => log.id === id);
    
    if (index === -1) return null;
    
    const updatedLog = { ...logs[index], ...updates };
    logs[index] = updatedLog;
    updateLogsService.saveUpdateLogs(logs);
    
    return updatedLog;
  },

  // Delete an update log
  deleteUpdateLog: (id: string): boolean => {
    const logs = updateLogsService.getUpdateLogs();
    const filteredLogs = logs.filter(log => log.id !== id);
    
    if (filteredLogs.length === logs.length) return false;
    
    updateLogsService.saveUpdateLogs(filteredLogs);
    return true;
  },

  // Get published update logs only
  getPublishedUpdateLogs: (): UpdateLog[] => {
    return updateLogsService.getUpdateLogs().filter(log => log.isPublished);
  },

  // Convert admin format to home format
  convertToHomeFormat: (adminLog: any): UpdateLog => {
    return {
      id: adminLog.id,
      version: adminLog.version,
      title: adminLog.title,
      description: adminLog.content || adminLog.description || '',
      content: adminLog.content || '',
      date: adminLog.date,
      isPublished: adminLog.isPublished,
      tags: adminLog.changes || [],
      technicalDetails: Array.isArray(adminLog.technicalDetails) ? adminLog.technicalDetails : [],
      bugFixes: Array.isArray(adminLog.bugFixes) ? adminLog.bugFixes : [],
      screenshots: Array.isArray(adminLog.screenshots) ? adminLog.screenshots : [],
      metrics: adminLog.metrics || {
        performanceImprovement: '0%',
        userSatisfaction: '0%',
        bugReports: 0
      }
    };
  }
}; 