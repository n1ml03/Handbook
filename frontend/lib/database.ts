// Database manager using sample data instead of real database
export const databaseManager = {
  initialized: true,
  
  // Mock database operations - all return sample data
  async getData(table: string) {
    console.log(`Mock: Getting data from ${table}`);
    return [];
  },
  
  async saveData(table: string, data: any) {
    console.log(`Mock: Saving data to ${table}`, data);
    return { success: true };
  },
  
  async clearData(table: string) {
    console.log(`Mock: Clearing data from ${table}`);
    return { success: true };
  }
}; 