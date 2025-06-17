import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Settings,
  FileText,
  Calendar,
  Edit3,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Tags,
  Download,
  Upload,
  FileDown,
  FileUp,
  X,
  Eye,
  CheckCircle2,
  AlertCircle,
  Settings2,
  ArrowUpDown,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Zap,
  Code,
  Wrench,
  Bug,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LoadingOverlay,
  DownloadButton
} from '@/components/ui/loading';
import { cn } from '@/services/utils';
import { documentCategoriesData, type Document, type DocumentCategory } from '@/types';
import { useUpdateLogs } from '@/contexts/UpdateLogsContext';
import { UpdateLog } from '@/types';
import TiptapEditor from '@/components/features/TiptapEditor';
import { Container, Section, Inline, FormGroup, StatusBadge } from '@/components/ui/spacing';
import { Card } from '@/components/ui/card';
import { useDocuments } from '@/contexts/DocumentsContext';
import React from 'react';

interface AdminSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'draft';
}

// Enhanced CSV interfaces
interface CSVPreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: CSVValidationError[];
}

interface CSVValidationError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  isRequired: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  selectedColumns: string[];
  filters: {
    dateRange?: { start: string; end: string };
    categories?: string[];
    status?: string[];
    searchText?: string;
  };
  includeHeaders: boolean;
  customFilename?: string;
}

interface ImportProgress {
  stage: 'uploading' | 'parsing' | 'validating' | 'importing' | 'complete';
  progress: number;
  processedRows: number;
  totalRows: number;
  errors: number;
  message: string;
}

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

// UpdateLog interface is now imported from @/types

const AdminPage = () => {
  const { documents, addDocument, updateDocument, deleteDocument } = useDocuments();
  const [documentCategories] = useState<DocumentCategory[]>(documentCategoriesData);
  const { updateLogs, addUpdateLog, updateUpdateLog, deleteUpdateLog } = useUpdateLogs();
  
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [activeDocumentSection, setActiveDocumentSection] = useState<'checklist-creation' | 'checking-guide' | 'all'>('all');
  const [editingLog, setEditingLog] = useState<UpdateLog | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Enhanced CSV state
  const [csvData, setCsvData] = useState<string>('');
  const [csvImportType, setCsvImportType] = useState<'documents' | 'update-logs'>('documents');
  const [importPage, setImportPage] = useState<string>('all');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);

  // Enhanced tags functionality
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [selectedTagIndex, setSelectedTagIndex] = useState(-1);
  
  // Separate inputs for technical details, bug fixes, and screenshots
  const [technicalDetailInput, setTechnicalDetailInput] = useState('');
  const [bugFixInput, setBugFixInput] = useState('');
  const [screenshotInput, setScreenshotInput] = useState('');

  // Common tag suggestions
  const commonTags = [
    'tutorial', 'guide', 'beginner', 'advanced', 'tips', 'tricks',
    'documentation', 'reference', 'api', 'examples', 'best-practices',
    'troubleshooting', 'faq', 'getting-started', 'configuration',
    'installation', 'deployment', 'security', 'performance', 'optimization'
  ];

  // New enhanced CSV states
  const [csvPreview, setCsvPreview] = useState<CSVPreviewData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    selectedColumns: [],
    filters: {},
    includeHeaders: true
  });
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Available pages for import
  const availablePages = useMemo(() => ([
    { id: 'accessory', name: 'Accessory' },
    { id: 'decoratebromide', name: 'Decorate Bromide' },
    { id: 'event', name: 'Event' },
    { id: 'festival', name: 'Festival' },
    { id: 'gacha', name: 'Gacha' },
    { id: 'girllist', name: 'Girl List' },
    { id: 'memories', name: 'Memories' },
    { id: 'ownerroom', name: 'Owner Room' },
    { id: 'shop', name: 'Shop' },
    { id: 'skill', name: 'Skill' }
  ]), []);

  // Notification system
  const addNotification = useCallback((notification: Omit<NotificationState, 'id' | 'timestamp'>) => {
    const newNotification: NotificationState = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      duration: notification.duration || 5000
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Field mappings for different data types
  const documentFields: ColumnMapping[] = [
    { csvColumn: '', dbField: 'title', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'content', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'category', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'tags', isRequired: false, dataType: 'array' },
    { csvColumn: '', dbField: 'author', isRequired: false, dataType: 'string' },
    { csvColumn: '', dbField: 'isPublished', isRequired: false, dataType: 'boolean' },
    { csvColumn: '', dbField: 'createdAt', isRequired: false, dataType: 'date' },
    { csvColumn: '', dbField: 'updatedAt', isRequired: false, dataType: 'date' }
  ];

  const updateLogFields: ColumnMapping[] = [
    { csvColumn: '', dbField: 'version', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'title', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'description', isRequired: false, dataType: 'string' },
    { csvColumn: '', dbField: 'content', isRequired: true, dataType: 'string' },
    { csvColumn: '', dbField: 'date', isRequired: true, dataType: 'date' },
    { csvColumn: '', dbField: 'tags', isRequired: false, dataType: 'array' },
    { csvColumn: '', dbField: 'isPublished', isRequired: false, dataType: 'boolean' }
  ];

  // Enhanced tags functionality helpers
  const getFilteredTagSuggestions = useCallback((input: string) => {
    if (!input.trim()) return [];
    const inputLower = input.toLowerCase();
    return commonTags
      .filter(tag =>
        tag.toLowerCase().includes(inputLower) &&
        !editingDocument?.tags.includes(tag)
      )
      .slice(0, 8);
  }, [commonTags, editingDocument?.tags]);

  const addTag = useCallback((tag: string) => {
    if (!editingDocument) return;
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !editingDocument.tags.includes(trimmedTag)) {
      setEditingDocument({
        ...editingDocument,
        tags: [...editingDocument.tags, trimmedTag]
      });
    }
    setTagInput('');
    setShowTagSuggestions(false);
    setSelectedTagIndex(-1);
  }, [editingDocument]);

  const removeTag = useCallback((tagToRemove: string) => {
    if (!editingDocument) return;
    setEditingDocument({
      ...editingDocument,
      tags: editingDocument.tags.filter(tag => tag !== tagToRemove)
    });
  }, [editingDocument]);

  // Floating toolbar functionality
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!editorRef.current || !isEditMode) return;

      const editorRect = editorRef.current.getBoundingClientRect();
      const isEditorVisible = editorRect.top < window.innerHeight && editorRect.bottom > 0;

      setShowFloatingToolbar(isEditorVisible && editorRect.top < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEditMode]);

  // Initialize site content (removed unused state)

  const adminSections: AdminSection[] = [
    {
      id: 'documents',
      title: 'Documents',
      icon: BookOpen,
      description: 'Manage documentation and guides',
      lastUpdated: '2024-01-20',
      status: 'active'
    },
    {
      id: 'update-logs',
      title: 'Update Logs',
      icon: FileText,
      description: 'Manage version updates and changelogs',
      lastUpdated: '2024-01-20',
      status: 'active'
    },
    {
      id: 'csv-management',
      title: 'CSV Import/Export',
      icon: FileDown,
      description: 'Import and export data in CSV format',
      lastUpdated: '2024-01-20',
      status: 'active'
    }
  ];

  const handleSaveUpdateLog = async (log: UpdateLog) => {
    try {
      if (editingLog?.id) {
        // Update existing
        await updateUpdateLog(editingLog.id, log);
      } else {
        // Create new
        await addUpdateLog(log);
      }
      setEditingLog(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving update log:', error);
      alert('Failed to save update log. Please try again.');
    }
  };


  const handleSaveDocument = (document: Document) => {
    if (editingDocument?.id) {
      updateDocument(editingDocument.id, document);
    } else {
      const newDocument = { ...document, id: Date.now().toString() };
      addDocument(newDocument);
    }
    setEditingDocument(null);
    setIsEditMode(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId);
    }
  };

  // Enhanced export functionality
  const exportToCSV = useCallback((data: any[], filename: string, selectedColumns?: string[]) => {
    if (data.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Data to Export',
        message: 'There is no data available to export'
      });
      return;
    }

    const allHeaders = Object.keys(data[0]);
    const headers = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allHeaders;

    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle arrays and objects
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value)}"`;
          }
          // Escape quotes and wrap in quotes if contains comma or quote
          const stringValue = String(value || '');
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Export Successful',
      message: `Exported ${data.length} records to ${filename}`
    });
  }, [addNotification]);

  const exportToExcel = useCallback(async (data: any[], filename: string, selectedColumns?: string[]) => {
    // For now, we'll export as CSV with .xlsx extension
    // In a real implementation, you'd use a library like xlsx or exceljs
    const excelFilename = filename.replace('.csv', '.xlsx');
    exportToCSV(data, excelFilename, selectedColumns);
  }, [exportToCSV]);

  const exportToJSON = useCallback((data: any[], filename: string, selectedColumns?: string[]) => {
    if (data.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Data to Export',
        message: 'There is no data available to export'
      });
      return;
    }

    let exportData = data;
    if (selectedColumns && selectedColumns.length > 0) {
      exportData = data.map(item => {
        const filtered: any = {};
        selectedColumns.forEach(col => {
          if (col in item) filtered[col] = item[col];
        });
        return filtered;
      });
    }

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.csv', '.json'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Export Successful',
      message: `Exported ${exportData.length} records to JSON format`
    });
  }, [addNotification]);

  const handleExportWithOptions = useCallback(async (dataType: 'documents' | 'update-logs') => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const data = dataType === 'documents' ? documents : updateLogs;
      let filteredData = [...data];

      // Apply filters
      if (exportOptions.filters.searchText) {
        const searchText = exportOptions.filters.searchText.toLowerCase();
        filteredData = filteredData.filter(item =>
          JSON.stringify(item).toLowerCase().includes(searchText)
        );
      }

      if (exportOptions.filters.categories && exportOptions.filters.categories.length > 0) {
        filteredData = filteredData.filter(item =>
          exportOptions.filters.categories!.includes((item as any).category)
        );
      }

      if (exportOptions.filters.status && exportOptions.filters.status.length > 0) {
        filteredData = filteredData.filter(item => {
          const isPublished = (item as any).isPublished;
          return exportOptions.filters.status!.includes(isPublished ? 'published' : 'draft');
        });
      }

      if (exportOptions.filters.dateRange) {
        const { start, end } = exportOptions.filters.dateRange;
        filteredData = filteredData.filter(item => {
          const itemDate = (item as any).createdAt || (item as any).date;
          return itemDate >= start && itemDate <= end;
        });
      }

      setExportProgress(50);

      const filename = exportOptions.customFilename ||
        `${dataType}-${new Date().toISOString().split('T')[0]}.${exportOptions.format === 'excel' ? 'xlsx' : exportOptions.format}`;

      // Simulate progress for user feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(75);

      switch (exportOptions.format) {
        case 'csv':
          exportToCSV(filteredData, filename, exportOptions.selectedColumns);
          break;
        case 'excel':
          await exportToExcel(filteredData, filename, exportOptions.selectedColumns);
          break;
        case 'json':
          exportToJSON(filteredData, filename, exportOptions.selectedColumns);
          break;
      }

      setExportProgress(100);

      // Reset progress after delay
      setTimeout(() => {
        setExportProgress(0);
        setIsExporting(false);
      }, 1000);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [documents, updateLogs, exportOptions, exportToCSV, exportToExcel, exportToJSON, addNotification]);

  const handleExportDocuments = useCallback(() => {
    exportToCSV(documents, 'documents.csv');
  }, [documents, exportToCSV]);

  const handleExportUpdateLogs = useCallback(() => {
    exportToCSV(updateLogs, 'update-logs.csv');
  }, [updateLogs, exportToCSV]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFileForPreview(file);
  };

  // Notification display component
  const NotificationToast = React.memo(function NotificationToast({ notification }: { notification: NotificationState }) {
    return (
      <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300",
        "bg-background/95 backdrop-blur-sm",
        notification.type === 'success' && "border-green-500/20 bg-green-500/5",
        notification.type === 'error' && "border-red-500/20 bg-red-500/5",
        notification.type === 'warning' && "border-yellow-500/20 bg-yellow-500/5",
        notification.type === 'info' && "border-blue-500/20 bg-blue-500/5"
      )}>
        <div className="shrink-0 mt-0.5">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="shrink-0 p-1 rounded-md bg-muted/20 transition-colors duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  });

  // CSV Preview Modal Component
  const CSVPreviewModal = () => {
    if (!showPreviewModal || !csvPreview) return null;

    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-xl font-semibold">CSV Data Preview</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {csvPreview.totalRows} rows, {csvPreview.headers.length} columns
                {csvPreview.invalidRows > 0 && (
                  <span className="text-yellow-600 ml-2">
                    ({csvPreview.invalidRows} rows with issues)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="p-2 rounded-lg bg-muted/20 transition-colors duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden"
              aria-label="Close preview modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Column Mapping Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-accent-cyan" />
                Column Mapping
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columnMappings.map((mapping, index) => (
                  <div key={mapping.dbField} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      {mapping.dbField}
                      {mapping.isRequired && <span className="text-red-500">*</span>}
                      <Badge variant="outline" className="text-xs">
                        {mapping.dataType}
                      </Badge>
                    </label>
                    <Select
                      value={mapping.csvColumn}
                      onValueChange={(value) => {
                        const newMappings = [...columnMappings];
                        newMappings[index].csvColumn = value;
                        setColumnMappings(newMappings);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select CSV column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-- None --</SelectItem>
                        {csvPreview.headers.map(header => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Preview Table */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent-purple" />
                Data Preview (First 10 rows)
              </h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">#</th>
                        {csvPreview.headers.map(header => (
                          <th key={header} className="px-3 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.rows.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-border">
                          <td className="px-3 py-2 text-muted-foreground font-medium">{rowIndex + 1}</td>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 max-w-xs truncate">
                              {cell || <span className="text-muted-foreground italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {csvPreview.totalRows > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 10 rows of {csvPreview.totalRows} total rows
                </p>
              )}
            </div>

            {/* Validation Errors */}
            {csvPreview.errors.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                  Validation Issues ({csvPreview.errors.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {csvPreview.errors.slice(0, 20).map((error, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border text-sm",
                        error.severity === 'error'
                          ? "border-red-500/20 bg-red-500/5 text-red-700"
                          : "border-yellow-500/20 bg-yellow-500/5 text-yellow-700"
                      )}
                    >
                      <span className="font-medium">Row {error.row}:</span> {error.message}
                    </div>
                  ))}
                  {csvPreview.errors.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ... and {csvPreview.errors.length - 20} more issues
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              {csvPreview.validRows} valid rows, {csvPreview.invalidRows} rows with issues
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportCSV}
                disabled={csvPreview.errors.filter(e => e.severity === 'error').length > 0}
                className="bg-gradient-to-r from-accent-cyan to-accent-purple"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFileForPreview(files[0]);
    }
  };

  // Enhanced CSV parsing with better error handling and validation
  const parseCSVData = useCallback((csvText: string): CSVPreviewData => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: any[][] = [];
    const errors: CSVValidationError[] = [];
    let validRows = 0;

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      if (!line.trim()) continue; // Skip empty lines

      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      try {
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        // Validate row has correct number of columns
        if (values.length !== headers.length) {
          errors.push({
            row: lineIndex,
            column: 'general',
            message: `Expected ${headers.length} columns, found ${values.length}`,
            severity: 'warning'
          });
        }

        rows.push(values);
        validRows++;
      } catch (error) {
        errors.push({
          row: lineIndex,
          column: 'general',
          message: `Failed to parse row: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        });
      }
    }

    return {
      headers,
      rows,
      totalRows: rows.length,
      validRows,
      invalidRows: rows.length - validRows,
      errors
    };
  }, []);

  // Enhanced data validation
  const validateCSVData = useCallback((preview: CSVPreviewData, mappings: ColumnMapping[]): CSVValidationError[] => {
    const errors: CSVValidationError[] = [...preview.errors];

    preview.rows.forEach((row, rowIndex) => {
      mappings.forEach((mapping) => {
        const columnIndex = preview.headers.indexOf(mapping.csvColumn);
        if (columnIndex === -1 && mapping.isRequired) {
          errors.push({
            row: rowIndex + 1,
            column: mapping.csvColumn,
            message: `Required column '${mapping.csvColumn}' not found`,
            severity: 'error'
          });
          return;
        }

        if (columnIndex >= 0) {
          const value = row[columnIndex];

          // Validate required fields
          if (mapping.isRequired && (!value || value.trim() === '')) {
            errors.push({
              row: rowIndex + 1,
              column: mapping.csvColumn,
              message: `Required field '${mapping.dbField}' is empty`,
              severity: 'error'
            });
          }

          // Validate data types
          if (value && value.trim()) {
            switch (mapping.dataType) {
              case 'number':
                if (isNaN(Number(value))) {
                  errors.push({
                    row: rowIndex + 1,
                    column: mapping.csvColumn,
                    message: `Invalid number format: '${value}'`,
                    severity: 'error'
                  });
                }
                break;
              case 'boolean':
                if (!['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())) {
                  errors.push({
                    row: rowIndex + 1,
                    column: mapping.csvColumn,
                    message: `Invalid boolean format: '${value}'. Use true/false, 1/0, or yes/no`,
                    severity: 'warning'
                  });
                }
                break;
              case 'date':
                if (isNaN(Date.parse(value))) {
                  errors.push({
                    row: rowIndex + 1,
                    column: mapping.csvColumn,
                    message: `Invalid date format: '${value}'`,
                    severity: 'error'
                  });
                }
                break;
            }
          }
        }
      });
    });

    return errors;
  }, []);

  // Enhanced file processing with preview
  const processFileForPreview = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      addNotification({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select a CSV file'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'File size must be less than 10MB'
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessingFile(true);

    try {
      const text = await file.text();
      setCsvData(text);

      // Parse and preview data
      const preview = parseCSVData(text);
      setCsvPreview(preview);

      // Auto-setup column mappings
      const fields = csvImportType === 'documents' ? documentFields : updateLogFields;
      const mappings = fields.map(field => ({
        ...field,
        csvColumn: preview.headers.find(h =>
          h.toLowerCase().includes(field.dbField.toLowerCase()) ||
          field.dbField.toLowerCase().includes(h.toLowerCase())
        ) || ''
      }));
      setColumnMappings(mappings);

      setIsProcessingFile(false);
      setShowPreviewModal(true);

      addNotification({
        type: 'success',
        title: 'File Processed',
        message: `Found ${preview.totalRows} rows with ${preview.headers.length} columns`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'File Processing Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      setIsProcessingFile(false);
      console.error('File reading error:', error);
    }
  }, [csvImportType, documentFields, updateLogFields, parseCSVData, addNotification]);

  const handleImportCSV = useCallback(async () => {
    if (!csvPreview || !columnMappings.length) {
      addNotification({
        type: 'error',
        title: 'No Data to Import',
        message: 'Please upload and preview a CSV file first'
      });
      return;
    }

    // Validate data before import
    const validationErrors = validateCSVData(csvPreview, columnMappings);
    const criticalErrors = validationErrors.filter(e => e.severity === 'error');

    if (criticalErrors.length > 0) {
      addNotification({
        type: 'error',
        title: 'Validation Failed',
        message: `Found ${criticalErrors.length} critical errors. Please fix them before importing.`
      });
      return;
    }

    setImportProgress({
      stage: 'importing',
      progress: 0,
      processedRows: 0,
      totalRows: csvPreview.totalRows,
      errors: 0,
      message: 'Starting import...'
    });

    try {
      // Convert preview data to objects using column mappings
      const mappedData = csvPreview.rows.map((row) => {
        const obj: any = {};
        columnMappings.forEach(mapping => {
          if (mapping.csvColumn) {
            const columnIndex = csvPreview.headers.indexOf(mapping.csvColumn);
            if (columnIndex >= 0) {
              const value = row[columnIndex];

              // Convert data types
              switch (mapping.dataType) {
                case 'boolean':
                  obj[mapping.dbField] = ['true', '1', 'yes'].includes(value?.toLowerCase() || '');
                  break;
                case 'number':
                  obj[mapping.dbField] = value ? Number(value) : 0;
                  break;
                case 'array':
                  obj[mapping.dbField] = value ? value.split(';').map((v: string) => v.trim()).filter(Boolean) : [];
                  break;
                case 'date':
                  obj[mapping.dbField] = value ? new Date(value).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                  break;
                default:
                  obj[mapping.dbField] = value || '';
              }
            }
          }
        });
        return obj;
      });

      let successCount = 0;
      let errorCount = 0;

      if (csvImportType === 'documents') {
        for (let i = 0; i < mappedData.length; i++) {
          const doc = mappedData[i];

          setImportProgress(prev => prev ? {
            ...prev,
            progress: Math.round((i / mappedData.length) * 100),
            processedRows: i,
            message: `Processing document ${i + 1} of ${mappedData.length}...`
          } : null);

          try {
            // Set defaults
            if (!doc.id) doc.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
            if (!doc.createdAt) doc.createdAt = new Date().toISOString().split('T')[0];
            if (!doc.updatedAt) doc.updatedAt = new Date().toISOString().split('T')[0];
            if (!doc.author) doc.author = 'Admin';
            if (doc.isPublished === undefined) doc.isPublished = false;

            // Set category based on import page if specified
            if (importPage !== 'all' && !doc.category) {
              doc.category = importPage;
            }

            addDocument(doc as Document);
            successCount++;
          } catch (error) {
            console.error('Error adding document:', doc, error);
            errorCount++;
          }
        }
      } else {
        for (let i = 0; i < mappedData.length; i++) {
          const log = mappedData[i];

          setImportProgress(prev => prev ? {
            ...prev,
            progress: Math.round((i / mappedData.length) * 100),
            processedRows: i,
            message: `Processing update log ${i + 1} of ${mappedData.length}...`
          } : null);

          try {
            // Set defaults
            if (!log.id) log.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
            if (!log.version) log.version = 'v1.0.0';
            if (!log.title) log.title = 'Untitled Update';
            if (!log.content) log.content = '';
            if (!log.date) log.date = new Date().toISOString().split('T')[0];
            if (log.isPublished === undefined) log.isPublished = false;
            if (!log.tags) log.tags = [];
            if (!log.technicalDetails) log.technicalDetails = [];
            if (!log.bugFixes) log.bugFixes = [];
            if (!log.screenshots) log.screenshots = [];
            if (!log.metrics) log.metrics = {
              performanceImprovement: '0%',
              userSatisfaction: '0%',
              bugReports: 0
            };

            await addUpdateLog(log);
            successCount++;
          } catch (error) {
            console.error('Error adding update log:', log, error);
            errorCount++;
          }
        }
      }

      setImportProgress({
        stage: 'complete',
        progress: 100,
        processedRows: mappedData.length,
        totalRows: mappedData.length,
        errors: errorCount,
        message: 'Import completed!'
      });

      const pageText = importPage !== 'all' ? ` to ${availablePages.find(page => page.id === importPage)?.name || importPage} page` : '';
      addNotification({
        type: 'success',
        title: 'Import Successful',
        message: `Imported ${successCount} ${csvImportType}${pageText}${errorCount > 0 ? ` (${errorCount} errors)` : ''}`
      });

      // Clear data after successful import
      setCsvData('');
      setUploadedFile(null);
      setCsvPreview(null);
      setShowPreviewModal(false);
      setColumnMappings([]);

      // Reset file input
      const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Clear progress after delay
      setTimeout(() => {
        setImportProgress(null);
      }, 3000);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      console.error('CSV Import Error:', error);
      setImportProgress(null);
    }
  }, [csvPreview, columnMappings, validateCSVData, csvImportType, importPage, availablePages, addDocument, addUpdateLog, addNotification]);

  const renderCsvManagement = () => (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-40 space-y-2 max-w-md">
          {notifications.map(notification => (
            <NotificationToast key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {/* Import Progress Overlay */}
      {importProgress && (
        <LoadingOverlay
          isVisible={true}
          message={importProgress.message}
          progress={importProgress.progress}
        />
      )}

      {/* CSV Preview Modal */}
      <CSVPreviewModal />

      <div className="space-y-6">
        {/* Enhanced Export Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Download className="w-6 h-6 text-accent-pink" />
                Export Data
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Export your data with advanced filtering and format options
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              {showExportOptions ? 'Hide' : 'Show'} Options
            </Button>
          </div>

          {/* Export Options Panel */}
          {showExportOptions && (
            <div className="mb-6 p-4 border border-border rounded-lg bg-muted/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Export Format</label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value: 'csv' | 'excel' | 'json') =>
                      setExportOptions(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV Format</SelectItem>
                      <SelectItem value="excel">Excel Format</SelectItem>
                      <SelectItem value="json">JSON Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Filename</label>
                  <Input
                    value={exportOptions.customFilename || ''}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customFilename: e.target.value
                    }))}
                    placeholder="Leave empty for auto-generated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date Range Filter</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={exportOptions.filters.dateRange?.start || ''}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          dateRange: {
                            start: e.target.value,
                            end: prev.filters.dateRange?.end || ''
                          }
                        }
                      }))}
                      className="text-xs"
                    />
                    <Input
                      type="date"
                      value={exportOptions.filters.dateRange?.end || ''}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          dateRange: {
                            start: prev.filters.dateRange?.start || '',
                            end: e.target.value
                          }
                        }
                      }))}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Search Filter</label>
                <Input
                  value={exportOptions.filters.searchText || ''}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    filters: { ...prev.filters, searchText: e.target.value }
                  }))}
                  placeholder="Search in content..."
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Quick Export Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Quick Export</h4>
                <DownloadButton
                  isDownloading={isExporting}
                  onClick={handleExportDocuments}
                  className="w-full justify-start"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Documents ({documents.length} items)
                </DownloadButton>

                <DownloadButton
                  isDownloading={isExporting}
                  onClick={handleExportUpdateLogs}
                  className="w-full justify-start"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Update Logs ({updateLogs.length} items)
                </DownloadButton>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Advanced Export</h4>
                <DownloadButton
                  isDownloading={isExporting}
                  onClick={() => handleExportWithOptions('documents')}
                  className="w-full justify-start"
                  disabled={!showExportOptions}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Documents (Filtered)
                </DownloadButton>

                <DownloadButton
                  isDownloading={isExporting}
                  onClick={() => handleExportWithOptions('update-logs')}
                  className="w-full justify-start"
                  disabled={!showExportOptions}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Update Logs (Filtered)
                </DownloadButton>
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && exportProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Use advanced export options to filter data by date range,
                search terms, or specific columns. Exported files can be opened in Excel,
                Google Sheets, or any spreadsheet application.
              </p>
            </div>
          </div>
        </Card>

        {/* Enhanced Import Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-6 h-6 text-accent-cyan" />
                Import Data
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Import data from CSV with advanced validation and preview
              </p>
            </div>
            {csvPreview && (
              <Badge variant="outline" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Data Ready for Import
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            {/* Import Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="Import Type" required>
                <Select
                  value={csvImportType}
                  onValueChange={(value: 'documents' | 'update-logs') => {
                    setCsvImportType(value);
                    // Reset preview when changing type
                    setCsvPreview(null);
                    setColumnMappings([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documents">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Documents
                      </div>
                    </SelectItem>
                    <SelectItem value="update-logs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Update Logs
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              {csvImportType === 'documents' && (
                <FormGroup label="Target Page">
                  <Select
                    value={importPage}
                    onValueChange={setImportPage}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages (Keep Original Categories)</SelectItem>
                      {availablePages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormGroup>
              )}
            </div>

            {/* Enhanced File Upload Section */}
            <div className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
                  isDragging
                    ? 'border-accent-cyan bg-accent-cyan/10 scale-[1.01] shadow-lg'
                    : 'border-border bg-muted/10'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className={cn(
                      "p-4 rounded-full transition-all duration-300",
                      isDragging
                        ? 'bg-accent-cyan/20 scale-110'
                        : 'bg-muted/50'
                    )}>
                      <Upload className={cn(
                        "w-8 h-8 transition-colors",
                        isDragging ? 'text-accent-cyan' : 'text-muted-foreground'
                      )} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="csvFileInput" className="cursor-pointer focus-within:outline-hidden">
                      <span className="text-accent-cyan font-semibold text-lg transition-colors duration-200">
                        Choose CSV file
                      </span>
                      <span className="text-muted-foreground"> or drag and drop here</span>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Supports CSV files up to 10MB with automatic validation and preview
                    </p>
                    <input
                      id="csvFileInput"
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedFile && (
                    <div className="inline-flex items-center gap-3 text-sm text-accent-cyan bg-accent-cyan/10 rounded-lg p-3 border border-accent-cyan/20">
                      <FileUp className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{uploadedFile.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setCsvData('');
                          setCsvPreview(null);
                          const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="text-red-500 p-2 rounded-lg bg-red-50 transition-colors duration-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden"
                        title="Remove file"
                        aria-label="Remove uploaded file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isProcessingFile && (
                    <div className="inline-flex items-center gap-3 text-sm text-accent-cyan bg-accent-cyan/10 rounded-lg p-3">
                      <div className="animate-spin w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full"></div>
                      <span className="font-medium">Processing file...</span>
                    </div>
                  )}

                  {isDragging && (
                    <div className="text-accent-cyan font-semibold text-lg animate-pulse">
                      Drop CSV file here
                    </div>
                  )}
                </div>
              </div>

              {/* Manual CSV Input - Only show if no file uploaded */}
              {!uploadedFile && !csvPreview && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-sm text-muted-foreground px-3">OR</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  <FormGroup
                    label="Paste CSV Data Manually"
                    description="Copy and paste CSV data directly into the text area below"
                  >
                    <textarea
                      value={csvData}
                      onChange={(e) => {
                        setCsvData(e.target.value);
                        // Auto-parse when pasting data
                        if (e.target.value.trim() && !csvPreview) {
                          try {
                            const preview = parseCSVData(e.target.value);
                            setCsvPreview(preview);

                            // Auto-setup column mappings
                            const fields = csvImportType === 'documents' ? documentFields : updateLogFields;
                            const mappings = fields.map(field => ({
                              ...field,
                              csvColumn: preview.headers.find(h =>
                                h.toLowerCase().includes(field.dbField.toLowerCase()) ||
                                field.dbField.toLowerCase().includes(h.toLowerCase())
                              ) || ''
                            }));
                            setColumnMappings(mappings);
                          } catch (error) {
                            console.error('Auto-parse error:', error);
                          }
                        }
                      }}
                      rows={8}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background resize-none text-sm font-mono focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan transition-all"
                      placeholder="Paste your CSV data here...&#10;&#10;Example:&#10;title,content,category&#10;&quot;My Document&quot;,&quot;Document content&quot;,tutorial"
                    />
                  </FormGroup>
                </div>
              )}

              {/* Preview and Import Actions */}
              {csvPreview && (
                <div className="space-y-4 p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Data Loaded Successfully</h4>
                        <p className="text-sm text-muted-foreground">
                          {csvPreview.totalRows} rows, {csvPreview.headers.length} columns
                          {csvPreview.errors.length > 0 && (
                            <span className="text-yellow-600 ml-2">
                              ({csvPreview.errors.length} validation issues)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreviewModal(true)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview & Map
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleImportCSV}
                        disabled={csvPreview.errors.filter(e => e.severity === 'error').length > 0}
                        className="bg-gradient-to-r from-accent-cyan to-accent-purple"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Import
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUpdateLogs = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Update Logs Management</h2>
        <Button 
          onClick={() => {
            setEditingLog({
              id: '',
              version: '',
              title: '',
              description: '',
              content: '',
              date: new Date().toISOString().split('T')[0],
              isPublished: false,
              tags: [],
              technicalDetails: [],
              bugFixes: [],
              screenshots: [],
              metrics: {
                performanceImprovement: '0%',
                userSatisfaction: '0%',
                bugReports: 0
              },
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0]
            });
            setIsEditMode(true);
          }}
          className="bg-gradient-to-r from-accent-pink to-accent-purple"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Update Log
        </Button>
      </div>

      {isEditMode && editingLog ? (
        <div className="doax-card transition-all duration-300 relative">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {editingLog.id ? 'Edit Update Log' : 'Create New Update Log'}
              </h3>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={cn(
                    "transition-colors",
                    isPreviewMode && "bg-accent-cyan/20 text-accent-cyan"
                  )}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>

            {/* Vertical Stack Layout */}
            <div className="space-y-6">
              {/* Update Log Metadata Section - Top */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-border/30 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Settings className="w-4 h-4 text-accent-pink" />
                      Update Log Settings
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure your update log's version information and publication settings
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Version and Date in responsive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup
                      label="Version"
                      description="Semantic version number (e.g., v2.1.0)"
                      required
                    >
                      <Input
                        value={editingLog.version}
                        onChange={(e) => setEditingLog({ ...editingLog, version: e.target.value })}
                        placeholder="v2.1.0"
                        className="font-medium h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                      />
                    </FormGroup>

                    <FormGroup
                      label="Release Date"
                      description="When this update was released"
                      required
                    >
                      <Input
                        type="date"
                        value={editingLog.date}
                        onChange={(e) => setEditingLog({ ...editingLog, date: e.target.value })}
                        className="font-medium h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                      />
                    </FormGroup>
                  </div>

                  {/* Title - Full width for better visibility */}
                  <FormGroup
                    label="Update Title"
                    description="A clear, descriptive title for this update"
                    required
                  >
                    <Input
                      value={editingLog.title}
                      onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })}
                      placeholder="Enter a clear, descriptive title for this update..."
                      className="font-medium h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                    />
                  </FormGroup>

                  {/* Description */}
                  <FormGroup
                    label="Brief Description"
                    description="A short summary of what this update includes"
                  >
                    <Input
                      value={editingLog.description}
                      onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
                      placeholder="Brief description of the update..."
                      className="h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                    />
                  </FormGroup>

                  {/* Status */}
                  <FormGroup label="Publication Status">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 border-2 border-border rounded-xl transition-all duration-200 focus-within:border-accent-pink/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="publish-log"
                          checked={editingLog.isPublished}
                          onChange={(e) => setEditingLog({ ...editingLog, isPublished: e.target.checked })}
                          className="w-4 h-4 rounded-md border-2 border-border transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:outline-hidden checked:bg-accent-pink checked:border-accent-pink"
                        />
                        <label htmlFor="publish-log" className="text-sm font-medium text-foreground cursor-pointer">
                          Publish Update Log
                        </label>
                      </div>
                      <div className="flex-1 flex justify-end">
                        {editingLog.isPublished ? (
                          <StatusBadge status="success" className="text-xs font-medium">
                            Published
                          </StatusBadge>
                        ) : (
                          <StatusBadge status="warning" className="text-xs font-medium">
                            Draft
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  </FormGroup>

                  {/* Enhanced Tags Input */}
                  <FormGroup
                    label="Tags"
                    description="Add tags to categorize this update (e.g., ui, bugfix, performance)"
                  >
                    <div className="space-y-3">
                      {/* Current Tags Display */}
                      {editingLog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editingLog.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-1 bg-accent-pink/10 border border-accent-pink/20 text-accent-pink px-3 py-1 rounded-full text-sm font-medium"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newTags = editingLog.tags.filter(t => t !== tag);
                                  setEditingLog({ ...editingLog, tags: newTags });
                                }}
                                className="ml-1 p-0.5 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:outline-hidden"
                                aria-label={`Remove ${tag} tag`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                                             {/* Tag Input */}
                       <Input
                         value={tagInput}
                         onChange={(e) => setTagInput(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' || e.key === ',') {
                             e.preventDefault();
                             const trimmedTag = tagInput.trim().toLowerCase();
                             if (trimmedTag && !editingLog.tags.includes(trimmedTag)) {
                               setEditingLog({
                                 ...editingLog,
                                 tags: [...editingLog.tags, trimmedTag]
                               });
                             }
                             setTagInput('');
                           }
                         }}
                         placeholder="Type tags and press Enter or comma to add... (e.g., ui, bugfix, performance)"
                         className="h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                       />

                      {/* Quick Tag Suggestions for Update Logs */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground font-medium py-1">Quick add:</span>
                        {['bugfix', 'feature', 'ui', 'ux', 'performance', 'security']
                          .filter(tag => !editingLog.tags.includes(tag))
                          .map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                if (!editingLog.tags.includes(tag)) {
                                  setEditingLog({
                                    ...editingLog,
                                    tags: [...editingLog.tags, tag]
                                  });
                                }
                              }}
                              className="text-xs bg-muted/50 border border-border px-2 py-1 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:outline-hidden"
                            >
                              + {tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  </FormGroup>
                </div>
              </div>

              {/* Technical Details & Bug Fixes Section */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-border/30 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Code className="w-4 h-4 text-accent-gold" />
                      Technical Details & Bug Fixes
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add technical improvements and bug fixes for this update
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Technical Details */}
                    <FormGroup
                      label="Technical Details"
                      description="Technical improvements and optimizations"
                    >
                      <div className="space-y-3">
                        {/* Current Technical Details Display */}
                        {editingLog && editingLog.technicalDetails.length > 0 && (
                          <div className="space-y-2">
                            {editingLog.technicalDetails.map((detail, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-3 bg-background/50 border border-border rounded-lg"
                              >
                                <Wrench className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                                <span className="text-sm flex-1 font-mono">{detail}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingLog) {
                                      const newDetails = editingLog.technicalDetails.filter((_, i) => i !== index);
                                      setEditingLog({ ...editingLog, technicalDetails: newDetails });
                                    }
                                  }}
                                  className="p-1 rounded-md bg-red-50 text-red-500 transition-colors duration-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden"
                                  aria-label="Remove technical detail"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Technical Detail Input */}
                        <div className="flex gap-2">
                          <Input
                            value={technicalDetailInput}
                            onChange={(e) => setTechnicalDetailInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmedDetail = technicalDetailInput.trim();
                                if (trimmedDetail && editingLog && !editingLog.technicalDetails.includes(trimmedDetail)) {
                                  setEditingLog({
                                    ...editingLog,
                                    technicalDetails: [...editingLog.technicalDetails, trimmedDetail]
                                  });
                                  setTechnicalDetailInput('');
                                }
                              }
                            }}
                            placeholder="Enter technical detail and press Enter..."
                            className="flex-1 h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold focus:outline-hidden"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const trimmedDetail = technicalDetailInput.trim();
                              if (trimmedDetail && editingLog && !editingLog.technicalDetails.includes(trimmedDetail)) {
                                setEditingLog({
                                  ...editingLog,
                                  technicalDetails: [...editingLog.technicalDetails, trimmedDetail]
                                });
                                setTechnicalDetailInput('');
                              }
                            }}
                            className="bg-accent-gold/20 text-accent-gold border-accent-gold/30"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </FormGroup>

                    {/* Bug Fixes */}
                    <FormGroup
                      label="Bug Fixes"
                      description="List of bugs fixed in this update"
                    >
                      <div className="space-y-3">
                        {/* Current Bug Fixes Display */}
                        {editingLog && editingLog.bugFixes.length > 0 && (
                          <div className="space-y-2">
                            {editingLog.bugFixes.map((fix, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-3 bg-background/50 border border-border rounded-lg"
                              >
                                <Bug className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
                                <span className="text-sm flex-1">{fix}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingLog) {
                                      const newFixes = editingLog.bugFixes.filter((_, i) => i !== index);
                                      setEditingLog({ ...editingLog, bugFixes: newFixes });
                                    }
                                  }}
                                  className="p-1 rounded-md bg-red-50 text-red-500 transition-colors duration-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden"
                                  aria-label="Remove bug fix"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Bug Fix Input */}
                        <div className="flex gap-2">
                          <Input
                            value={bugFixInput}
                            onChange={(e) => setBugFixInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmedFix = bugFixInput.trim();
                                if (trimmedFix && editingLog && !editingLog.bugFixes.includes(trimmedFix)) {
                                  setEditingLog({
                                    ...editingLog,
                                    bugFixes: [...editingLog.bugFixes, trimmedFix]
                                  });
                                  setBugFixInput('');
                                }
                              }
                            }}
                            placeholder="Enter bug fix and press Enter..."
                            className="flex-1 h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple focus:outline-hidden"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const trimmedFix = bugFixInput.trim();
                              if (trimmedFix && editingLog && !editingLog.bugFixes.includes(trimmedFix)) {
                                setEditingLog({
                                  ...editingLog,
                                  bugFixes: [...editingLog.bugFixes, trimmedFix]
                                });
                                setBugFixInput('');
                              }
                            }}
                            className="bg-accent-purple/20 text-accent-purple border-accent-purple/30"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </FormGroup>
                  </div>

                  {/* Screenshots & Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Screenshots */}
                    <FormGroup
                      label="Screenshots"
                      description="Image filenames or URLs for this update"
                    >
                      <div className="space-y-3">
                        {/* Current Screenshots Display */}
                        {editingLog && editingLog.screenshots.length > 0 && (
                          <div className="space-y-2">
                            {editingLog.screenshots.map((screenshot, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-background/50 border border-border rounded-lg"
                              >
                                <ImageIcon className="w-4 h-4 text-accent-pink shrink-0" />
                                <span className="text-sm flex-1">{screenshot}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingLog) {
                                      const newScreenshots = editingLog.screenshots.filter((_, i) => i !== index);
                                      setEditingLog({ ...editingLog, screenshots: newScreenshots });
                                    }
                                  }}
                                  className="p-1 rounded-md bg-red-50 text-red-500 transition-colors duration-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden"
                                  aria-label="Remove screenshot"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Screenshot Input */}
                        <div className="flex gap-2">
                          <Input
                            value={screenshotInput}
                            onChange={(e) => setScreenshotInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmedScreenshot = screenshotInput.trim();
                                if (trimmedScreenshot && editingLog && !editingLog.screenshots.includes(trimmedScreenshot)) {
                                  setEditingLog({
                                    ...editingLog,
                                    screenshots: [...editingLog.screenshots, trimmedScreenshot]
                                  });
                                  setScreenshotInput('');
                                }
                              }
                            }}
                            placeholder="Enter image filename and press Enter..."
                            className="flex-1 h-10 px-3 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink focus:outline-hidden"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const trimmedScreenshot = screenshotInput.trim();
                              if (trimmedScreenshot && editingLog && !editingLog.screenshots.includes(trimmedScreenshot)) {
                                setEditingLog({
                                  ...editingLog,
                                  screenshots: [...editingLog.screenshots, trimmedScreenshot]
                                });
                                setScreenshotInput('');
                              }
                            }}
                            className="bg-accent-pink/20 text-accent-pink border-accent-pink/30"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                </div>
              </div>

              {/* Content Editor Section - Bottom (Full Width) */}
              <div className="space-y-6" ref={editorRef}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-accent-purple" />
                      Update Content
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Describe the update in detail. Include new features, bug fixes, improvements, and any other relevant information.
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "border-2 border-border rounded-2xl overflow-hidden",
                  "bg-background shadow-xs",
                  "focus-within:border-accent-pink/50 focus-within:shadow-md",
                  "transition-all duration-300 ease-out"
                )}>
                  <TiptapEditor
                    content={editingLog.content}
                    onChange={(content) => setEditingLog({ ...editingLog, content })}
                    editable={!isPreviewMode}
                    placeholder="Describe the update in detail... What's new? What's fixed? What's improved?"
                    showToolbar={!isPreviewMode}
                    showCharacterCount={true}
                    showWordCount={true}
                    mode="full"
                    className={cn(
                      "border-0 bg-transparent",
                      "min-h-[450px]",
                      "sm:min-h-[550px]",
                      "lg:min-h-[650px]",
                      "xl:min-h-[750px]",
                      "2xl:min-h-[850px]"
                    )}
                  />
                </div>

                {/* Floating Toolbar */}
                {showFloatingToolbar && !isPreviewMode && (
                  <div
                    ref={toolbarRef}
                    className="fixed top-4 right-4 z-50 bg-background/95 backdrop-blur-sm border-2 border-border rounded-xl shadow-xl p-3 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-accent-pink rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
                      </div>
                      <div className="w-px h-4 bg-border"></div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsPreviewMode(true)}
                          className="h-8 px-2 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveUpdateLog(editingLog)}
                          className="h-8 px-2 text-xs bg-gradient-to-r from-accent-pink to-accent-purple text-white"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editor Stats and Tips */}
                <div className="bg-muted/20 border border-border/50 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-accent-pink rounded-full"></div>
                        <span className="font-medium">
                          {editingLog.content.length} characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                        <span className="font-medium">
                          ~{Math.max(1, Math.ceil(editingLog.content.split(' ').length / 200))} min read
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Last edited: just now</span>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <span className="text-muted-foreground font-medium">Manual save required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-gradient-to-r from-muted/20 to-muted/10 border-t-2 border-border/30 -mx-6 px-8 py-6 mt-8 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent-pink rounded-full"></div>
                    <span className="text-muted-foreground">
                      {editingLog.id ? (
                        <>Last saved: <span className="font-medium text-foreground">{editingLog.date}</span></>
                      ) : (
                        <span className="text-yellow-600 font-medium">New update log - not saved yet</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block"></div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {editingLog.isPublished ? (
                      <StatusBadge status="success" className="text-xs font-medium">
                        Published & Live
                      </StatusBadge>
                    ) : (
                      <StatusBadge status="warning" className="text-xs font-medium">
                        Draft
                      </StatusBadge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingLog(null);
                      setIsEditMode(false);
                      setIsPreviewMode(false);
                    }}
                    className="order-2 sm:order-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>

                  {editingLog.id && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Save as draft functionality
                        const draftLog = { ...editingLog, isPublished: false };
                        setEditingLog(draftLog);
                        handleSaveUpdateLog(draftLog);
                      }}
                      className="order-3 sm:order-2"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                  )}

                  <Button
                    onClick={() => handleSaveUpdateLog(editingLog)}
                    className="bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-accent-pink/20 focus:outline-hidden order-1 sm:order-3"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingLog.id ? 'Save Changes' : 'Create Update Log'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {updateLogs.map(log => (
              <div key={log.id} className="doax-card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {log.version}
                      </Badge>
                      <h3 className="text-lg font-semibold">{log.title}</h3>
                      {!log.isPublished && (
                        <Badge variant="secondary" className="text-xs">Draft</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {log.description || log.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.slice(0, 150)}
                      {(log.description || log.content).length > 150 && '...'}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {log.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tags className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {log.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{log.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Released: {log.date}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLog(log);
                        setIsEditMode(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this update log?')) {
                          try {
                            await deleteUpdateLog(log.id);
                          } catch (error) {
                            console.error('Error deleting update log:', error);
                            alert('Failed to delete update log. Please try again.');
                          }
                        }
                      }}
                      className="text-red-600 border-red-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {updateLogs.length === 0 && (
            <div className="doax-card p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No update logs yet</h3>
              <p className="text-muted-foreground mb-4">Create your first update log to get started</p>
              <Button onClick={() => {
                setEditingLog({
                  id: '',
                  version: '',
                  title: '',
                  description: '',
                  content: '',
                  date: new Date().toISOString().split('T')[0],
                  isPublished: false,
                  tags: [],
                  technicalDetails: [],
                  bugFixes: [],
                  screenshots: [],
                  metrics: {
                    performanceImprovement: '0%',
                    userSatisfaction: '0%',
                    bugReports: 0
                  },
                  createdAt: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString().split('T')[0]
                });
                setIsEditMode(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Update Log
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDocuments = () => {
    // Filter documents based on active section
    const getSectionDocuments = () => {
      if (activeDocumentSection === 'all') {
        return documents;
      }
      return documents.filter(doc => {
        if (activeDocumentSection === 'checklist-creation') {
          return doc.tags.some(tag => 
            tag.toLowerCase().includes('checklist') || 
            tag.toLowerCase().includes('creation') ||
            tag.toLowerCase().includes('guide') ||
            doc.category === 'checklist-creation'
          );
        } else if (activeDocumentSection === 'checking-guide') {
          return doc.tags.some(tag => 
            tag.toLowerCase().includes('checking') || 
            tag.toLowerCase().includes('verification') ||
            tag.toLowerCase().includes('validation') ||
            doc.category === 'checking-guide'
          );
        }
        return false;
      });
    };

    const sectionDocuments = getSectionDocuments();

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Document Management</h2>
          <div className="flex gap-2">
            <Button onClick={() => {
              setEditingDocument({
                id: '',
                title: '',
                content: '',
                category: 'tutorial',
                tags: [],
                author: 'Admin',
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
                isPublished: false
              });
              setIsEditMode(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {/* Document Sections */}
        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* All Documents Card */}
            <div 
              className={cn(
                "doax-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                activeDocumentSection === 'all'
                  ? 'border-accent-cyan bg-accent-cyan/5'
                  : 'border-border hover:border-accent-cyan/50'
              )}
              onClick={() => setActiveDocumentSection('all')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  activeDocumentSection === 'all'
                    ? 'bg-accent-cyan text-white'
                    : 'bg-accent-cyan/10 text-accent-cyan'
                )}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">All Documents</h3>
                  <p className="text-xs text-muted-foreground">Complete collection</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total documents</span>
                <StatusBadge status="info" className="text-xs">
                  {documents.length}
                </StatusBadge>
                             </div>
             </div>

             {/* Checklist Creation Card */}
             <div 
              className={cn(
                "doax-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                activeDocumentSection === 'checklist-creation'
                  ? 'border-accent-pink bg-accent-pink/5'
                  : 'border-border hover:border-accent-pink/50'
              )}
              onClick={() => setActiveDocumentSection('checklist-creation')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  activeDocumentSection === 'checklist-creation'
                    ? 'bg-accent-pink text-white'
                    : 'bg-accent-pink/10 text-accent-pink'
                )}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Checklist Creation</h3>
                  <p className="text-xs text-muted-foreground">Creation guides</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Creation docs</span>
                <StatusBadge status="success" className="text-xs">
                  {documents.filter(doc => {
                    return doc.tags.some(tag => 
                      tag.toLowerCase().includes('checklist') || 
                      tag.toLowerCase().includes('creation') ||
                      tag.toLowerCase().includes('guide') ||
                      doc.category === 'checklist-creation'
                    );
                  }).length}
                                 </StatusBadge>
               </div>
             </div>

             {/* Checking Guide Card */}
             <div 
              className={cn(
                "doax-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                activeDocumentSection === 'checking-guide'
                  ? 'border-accent-purple bg-accent-purple/5'
                  : 'border-border hover:border-accent-purple/50'
              )}
              onClick={() => setActiveDocumentSection('checking-guide')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  activeDocumentSection === 'checking-guide'
                    ? 'bg-accent-purple text-white'
                    : 'bg-accent-purple/10 text-accent-purple'
                )}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Checking Guide</h3>
                  <p className="text-xs text-muted-foreground">Verification docs</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Checking docs</span>
                <StatusBadge status="warning" className="text-xs">
                  {documents.filter(doc => {
                    return doc.tags.some(tag => 
                      tag.toLowerCase().includes('checking') || 
                      tag.toLowerCase().includes('verification') ||
                      tag.toLowerCase().includes('validation') ||
                      doc.category === 'checking-guide'
                    );
                  }).length}
                                 </StatusBadge>
               </div>
             </div>
           </div>
         )}

      {isEditMode && editingDocument ? (
        <div className="doax-card transition-all duration-300 relative">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {editingDocument.id ? 'Edit Document' : 'Create New Document'}
              </h3>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={cn(
                    "transition-colors",
                    isPreviewMode && "bg-accent-cyan/20 text-accent-cyan"
                  )}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>

            {/* Vertical Stack Layout */}
            <div className="space-y-6">
              {/* Document Metadata Section - Top */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-border/30 rounded-2xl p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Settings className="w-5 h-5 text-accent-cyan" />
                      Document Settings
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure your document's basic information and publication settings
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Title - Full width for better visibility */}
                  <FormGroup
                    label="Document Title"
                    description="Choose a clear, descriptive title for your document"
                    required
                  >
                    <Input
                      value={editingDocument.title}
                      onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })}
                      placeholder="Enter a clear, descriptive title for your document..."
                      className="text-lg font-medium h-12 px-4 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan focus:outline-hidden"
                    />
                  </FormGroup>

                  {/* Category and Status in a responsive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <FormGroup label="Category" required>
                    <select
                      value={editingDocument.category}
                      onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background transition-all duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan focus:outline-hidden text-sm font-medium"
                    >
                      {documentCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  {/* Status */}
                  <FormGroup label="Publication Status" className="lg:col-span-1">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 border-2 border-border rounded-xl transition-all duration-200 focus-within:border-accent-cyan/50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="admin-published"
                          checked={editingDocument.isPublished}
                          onChange={(e) => setEditingDocument({ ...editingDocument, isPublished: e.target.checked })}
                          className="w-5 h-5 rounded-md border-2 border-border transition-all duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden checked:bg-accent-cyan checked:border-accent-cyan"
                        />
                        <label htmlFor="admin-published" className="text-sm font-semibold text-foreground cursor-pointer">
                          Publish Document
                        </label>
                      </div>
                      <div className="flex-1 flex justify-end">
                        {editingDocument.isPublished ? (
                          <StatusBadge status="success" className="text-xs font-medium">
                            Published
                          </StatusBadge>
                        ) : (
                          <StatusBadge status="warning" className="text-xs font-medium">
                            Draft
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  </FormGroup>
                  </div>

                  {/* Enhanced Tags Input */}
                  <FormGroup
                    label="Tags"
                    description="Add tags to help categorize and organize your document"
                  >
                    <div className="space-y-3">
                      {/* Current Tags Display */}
                      {editingDocument.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editingDocument.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan px-3 py-1 rounded-full text-sm font-medium"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 p-0.5 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden"
                                aria-label={`Remove ${tag} tag`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tag Input with Suggestions */}
                      <div className="relative">
                        <Input
                          value={tagInput}
                          onChange={(e) => {
                            setTagInput(e.target.value);
                            setShowTagSuggestions(e.target.value.length > 0);
                            setSelectedTagIndex(-1);
                          }}
                          onKeyDown={(e) => {
                            const suggestions = getFilteredTagSuggestions(tagInput);

                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (selectedTagIndex >= 0 && suggestions[selectedTagIndex]) {
                                addTag(suggestions[selectedTagIndex]);
                              } else if (tagInput.trim()) {
                                addTag(tagInput);
                              }
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setSelectedTagIndex(prev =>
                                prev < suggestions.length - 1 ? prev + 1 : 0
                              );
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setSelectedTagIndex(prev =>
                                prev > 0 ? prev - 1 : suggestions.length - 1
                              );
                            } else if (e.key === 'Escape') {
                              setShowTagSuggestions(false);
                              setSelectedTagIndex(-1);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding suggestions to allow clicking
                            setTimeout(() => {
                              setShowTagSuggestions(false);
                              setSelectedTagIndex(-1);
                            }, 200);
                          }}
                          placeholder="Type to add tags... (e.g., tutorial, guide, beginner)"
                          className="h-11 px-4 border-2 border-border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan focus:outline-hidden"
                        />

                        {/* Tag Suggestions Dropdown */}
                        {showTagSuggestions && tagInput.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border-2 border-border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                            {getFilteredTagSuggestions(tagInput).map((suggestion, index) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl",
                                  index === selectedTagIndex
                                    ? "bg-accent-cyan/20 text-accent-cyan"
                                    : "text-foreground"
                                )}
                              >
                                {suggestion}
                              </button>
                            ))}
                            {getFilteredTagSuggestions(tagInput).length === 0 && (
                              <div className="px-4 py-2 text-sm text-muted-foreground">
                                No suggestions found. Press Enter to add "{tagInput}" as a new tag.
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quick Tag Suggestions */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground font-medium py-1">Quick add:</span>
                        {commonTags
                          .filter(tag => !editingDocument.tags.includes(tag))
                          .slice(0, 6)
                          .map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              className="text-xs bg-muted/50 border border-border px-2 py-1 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden"
                            >
                              + {tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  </FormGroup>
                </div>
              </div>



              {/* Content Editor Section*/}
              <div className="space-y-6" ref={editorRef}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-accent-purple" />
                      Document Content
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Create rich, formatted content using our advanced text editor.
                      The floating toolbar will appear when you scroll for quick access to editing tools.
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "border-2 border-border rounded-2xl overflow-hidden",
                  "bg-background shadow-xs",
                  "focus-within:border-accent-cyan/50 focus-within:shadow-md",
                  "transition-all duration-300 ease-out"
                )}>
                  <TiptapEditor
                    content={editingDocument.content}
                    onChange={(content) => setEditingDocument({ ...editingDocument, content })}
                    editable={!isPreviewMode}
                    placeholder="Start writing your document content... Use the rich text editor to format your content with headings, lists, links, and more."
                    showToolbar={!isPreviewMode}
                    showCharacterCount={true}
                    showWordCount={true}
                    mode="full"
                    className={cn(
                      "border-0 bg-transparent",
                      // Responsive heights optimized for different screen sizes
                      "min-h-[450px]",
                      // Tablet: comfortable height for tablet use
                      "sm:min-h-[550px]",
                      // Desktop: spacious height for desktop editing
                      "lg:min-h-[650px]",
                      // Large desktop: maximum comfort for extended editing
                      "xl:min-h-[750px]",
                      // Ultra-wide: optimal height for large screens
                      "2xl:min-h-[850px]"
                    )}
                  />
                </div>

                {/* Floating Toolbar */}
                {showFloatingToolbar && !isPreviewMode && (
                  <div
                    ref={toolbarRef}
                    className="fixed top-4 right-4 z-50 bg-background/95 backdrop-blur-sm border-2 border-border rounded-xl shadow-xl p-3 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
                      </div>
                      <div className="w-px h-4 bg-border"></div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsPreviewMode(true)}
                          className="h-8 px-2 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveDocument(editingDocument)}
                          className="h-8 px-2 text-xs bg-gradient-to-r from-accent-cyan to-accent-purple text-white"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editor Stats and Tips */}
                <div className="bg-muted/20 border border-border/50 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                        <span className="font-medium">
                          {editingDocument.content.length} characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                        <span className="font-medium">
                          ~{Math.max(1, Math.ceil(editingDocument.content.split(' ').length / 200))} min read
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Last edited: just now</span>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <span className="text-muted-foreground font-medium">Manual save required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-gradient-to-r from-muted/20 to-muted/10 border-t-2 border-border/30 -mx-6 px-8 py-6 mt-8 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                    <span className="text-muted-foreground">
                      {editingDocument.id ? (
                        <>Last saved: <span className="font-medium text-foreground">{editingDocument.updatedAt}</span></>
                      ) : (
                        <span className="text-yellow-600 font-medium">New document - not saved yet</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block"></div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {editingDocument.isPublished ? (
                      <StatusBadge status="success" className="text-xs font-medium">
                        Published & Live
                      </StatusBadge>
                    ) : (
                      <StatusBadge status="warning" className="text-xs font-medium">
                        Draft
                      </StatusBadge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingDocument(null);
                    setIsEditMode(false);
                    setIsPreviewMode(false);
                  }}
                  className="order-2 sm:order-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>

                {editingDocument.id && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Save as draft functionality
                      const draftDocument = { ...editingDocument, isPublished: false };
                      setEditingDocument(draftDocument);
                      handleSaveDocument(draftDocument);
                    }}
                    className="order-3 sm:order-2"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                )}

                <Button
                  onClick={() => handleSaveDocument(editingDocument)}
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden order-1 sm:order-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingDocument.id ? 'Save Changes' : 'Create Document'}
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {sectionDocuments.map(document => (
              <div key={document.id} className="doax-card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{document.title}</h3>
                      {!document.isPublished && (
                        <Badge variant="secondary" className="text-xs">Draft</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {documentCategories.find(cat => cat.id === document.category)?.name || document.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {document.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.slice(0, 150)}
                      {document.content.length > 150 && '...'}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {document.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tags className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {document.updatedAt} by {document.author}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingDocument(document);
                        setIsEditMode(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 border-red-200 focus:ring-2 focus:ring-red-100 focus:outline-hidden transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sectionDocuments.length === 0 && (
            <div className="doax-card p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">Create your first document to get started</p>
              <Button onClick={() => {
                setEditingDocument({
                  id: '',
                  title: '',
                  content: '',
                  category: 'tutorial',
                  tags: [],
                  author: 'Admin',
                  createdAt: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString().split('T')[0],
                  isPublished: false
                });
                setIsEditMode(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
    );
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'documents':
        return renderDocuments();
      case 'update-logs':
        return renderUpdateLogs();
      case 'csv-management':
        return renderCsvManagement();
      default:
        return (
          <div className="doax-card p-8 text-center">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <Container>
      {/* Header */}
      <Section
        title="Admin Panel"
        description="Manage website content, updates, and system settings with enhanced CSV import/export capabilities"
      />

      {/* Tab Navigation */}
      <Card className="p-2">
        <Inline spacing="sm" wrap>
          {adminSections.map(section => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium min-w-0',
                  'focus:ring-2 focus:ring-accent-cyan/20 focus:outline-hidden',
                  activeTab === section.id
                    ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-lg'
                    : 'bg-muted/50 text-muted-foreground'
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{section.title}</span>
                <span className="sm:hidden">{section.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </Inline>
      </Card>

      {/* Main Content */}
      <div className="w-full">
        {renderTabContent()}
      </div>
    </Container>
  );
};

export default AdminPage; 