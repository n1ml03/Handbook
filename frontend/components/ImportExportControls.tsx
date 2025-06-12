import { useState } from 'react';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleData } from '@/data';

type ExportDataType = 'swimsuits' | 'girls' | 'skills' | 'accessories' | 'all';

interface ImportExportControlsProps {
  dataType: ExportDataType;
  customData?: any;
  showExport?: boolean;
  className?: string;
}

export default function ImportExportControls({
  dataType,
  customData,
  showExport = true,
  className = '',
}: ImportExportControlsProps) {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getDataForExport = () => {
    if (customData) return customData;

    switch (dataType) {
      case 'swimsuits':
        return sampleData.swimsuits;
      case 'girls':
        return sampleData.girls;
      case 'skills':
        return sampleData.skills;
      case 'accessories':
        return sampleData.accessories;
      case 'all':
        return {
          swimsuits: sampleData.swimsuits,
          girls: sampleData.girls,
          skills: sampleData.skills,
          accessories: sampleData.accessories,
        };
      default:
        return null;
    }
  };

  const handleExport = () => {
    try {
      const data = getDataForExport();
      if (!data) {
        showNotification('error', 'No data available for export');
        return;
      }

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `doaxvv-${dataType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('success', 'Data exported successfully');
    } catch (error) {
      showNotification('error', 'Failed to export data: ' + (error as Error).message);
    }
  };

  const getDisplayTitle = () => {
    switch (dataType) {
      case 'swimsuits': return 'Export Swimsuits';
      case 'girls': return 'Export Girls';
      case 'skills': return 'Export Skills';
      case 'accessories': return 'Export Accessories';
      case 'all': return 'Export All Data';
      default: return 'Export Data';
    }
  };

  return (
    <Card className={`glass-effect ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>{getDisplayTitle()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notification && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
            notification.type === 'success' 
              ? 'bg-green-500/10 text-green-600 border border-green-500/20'
              : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {showExport && (
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export {dataType === 'all' ? 'All Data' : dataType.charAt(0).toUpperCase() + dataType.slice(1)}
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {dataType === 'all' 
            ? 'Export all data as a JSON file for backup purposes.'
            : `Export ${dataType} data as a JSON file.`
          }
        </div>
      </CardContent>
    </Card>
  );
} 