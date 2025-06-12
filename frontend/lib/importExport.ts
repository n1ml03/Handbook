import { type Character, type Swimsuit, type Skill, type Accessory } from '@/data';

export type ExportDataType = 'swimsuits' | 'girls' | 'skills' | 'accessories' | 'calculator' | 'venusBoard' | 'all';

export interface ExportData {
  type: ExportDataType;
  version: string;
  timestamp: string;
  data: any;
}

export interface CalculatorExport {
  selectedGirl: Character | null;
  venusBoard: {
    pow: number;
    tec: number;
    stm: number;
    apl: number;
  };
  settings?: {
    sameSofteningSkill?: boolean;
    sameSkillNumber?: boolean;
    skillLevel?: number;
    topCoat?: {
      pow: number;
      tec: number;
      stm: number;
      apl: number;
    };
  };
}

export class ImportExportManager {
  private static readonly VERSION = '1.0.0';

  // Export functions
  static exportSwimsuits(swimsuits: Swimsuit[]): string {
    const exportData: ExportData = {
      type: 'swimsuits',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: swimsuits
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportGirls(girls: Character[]): string {
    const exportData: ExportData = {
      type: 'girls',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: girls
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportSkills(skills: Skill[]): string {
    const exportData: ExportData = {
      type: 'skills',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: skills
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportAccessories(accessories: Accessory[]): string {
    const exportData: ExportData = {
      type: 'accessories',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: accessories
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportCalculator(calculatorData: CalculatorExport): string {
    const exportData: ExportData = {
      type: 'calculator',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: calculatorData
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportVenusBoard(venusBoard: { pow: number; tec: number; stm: number; apl: number }): string {
    const exportData: ExportData = {
      type: 'venusBoard',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data: venusBoard
    };
    return JSON.stringify(exportData, null, 2);
  }

  static exportAll(data: {
    swimsuits: Swimsuit[];
    girls: Character[];
    skills: Skill[];
    accessories: Accessory[];
    calculator?: CalculatorExport;
  }): string {
    const exportData: ExportData = {
      type: 'all',
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      data
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import functions with validation
  static parseImportData(jsonString: string): ExportData {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.type || !data.version || !data.timestamp || !data.data) {
        throw new Error('Invalid export file format');
      }

      return data as ExportData;
    } catch (error) {
      throw new Error(`Failed to parse import file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateSwimsuits(data: any[]): Swimsuit[] {
    return data.map((item, index) => {
      if (!item.id || !item.name || !item.character || !item.rarity || !item.stats) {
        throw new Error(`Invalid swimsuit data at index ${index}`);
      }
      return item as Swimsuit;
    });
  }

  static validateGirls(data: any[]): Character[] {
    return data.map((item, index) => {
      if (!item.id || !item.name || !item.type || !item.stats || !item.maxStats) {
        throw new Error(`Invalid girl data at index ${index}`);
      }
              return item as Character;
    });
  }

  static validateSkills(data: any[]): Skill[] {
    return data.map((item, index) => {
      if (!item.id || !item.name || !item.type || !item.description) {
        throw new Error(`Invalid skill data at index ${index}`);
      }
      return item as Skill;
    });
  }

  static validateAccessories(data: any[]): Accessory[] {
    return data.map((item, index) => {
      if (!item.id || !item.name || !item.type || !item.skill || !item.stats) {
        throw new Error(`Invalid accessory data at index ${index}`);
      }
      return item as Accessory;
    });
  }

  static validateCalculator(data: any): CalculatorExport {
    if (!data.venusBoard || typeof data.venusBoard !== 'object') {
      throw new Error('Invalid calculator data: missing venusBoard');
    }
    return data as CalculatorExport;
  }

  // File download utility
  static downloadFile(content: string, filename: string, type: string = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // File upload utility
  static uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      };

      input.click();
    });
  }

  // Generate filename with timestamp
  static generateFilename(type: ExportDataType, prefix: string = 'doaxvv'): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `${prefix}_${type}_${timestamp}.json`;
  }
}