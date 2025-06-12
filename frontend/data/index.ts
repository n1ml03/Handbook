// Main sample data imports
import { charactersData, type Character } from './characters';
import { swimsuitsData, type Swimsuit } from './swimsuits';
import { skillsData, type Skill } from './skills';
import { skillsDetailedData, type DetailedSkill } from './skillsDetailed';
import { accessoriesData, type Accessory } from './accessories';
import { accessoriesDetailedData, type DetailedAccessory } from './accessoriesDetailed';
import { eventsData, type Event } from './events';
import { bromidesData, type Bromide } from './bromides';
import { documentsData, documentCategoriesData, type Document, type DocumentCategory } from './documents';

// Re-export the data
export { charactersData, type Character };
export { swimsuitsData, type Swimsuit };
export { skillsData, type Skill };
export { skillsDetailedData, type DetailedSkill };
export { accessoriesData, type Accessory };
export { accessoriesDetailedData, type DetailedAccessory };
export { eventsData, type Event };
export { bromidesData, type Bromide };
export { documentsData, documentCategoriesData, type Document, type DocumentCategory };

// Consolidated sample data object for easy importing
export const sampleData = {
  girls: charactersData,
  swimsuits: swimsuitsData,
  skills: skillsData,
  skillsDetailed: skillsDetailedData,
  accessories: accessoriesData,
  accessoriesDetailed: accessoriesDetailedData,
  events: eventsData,
  bromides: bromidesData,
  documents: documentsData,
  documentCategories: documentCategoriesData
}; 