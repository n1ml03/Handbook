import { Document, UpdateLog, Character, Swimsuit, Skill, Accessory, Event, Bromide, Girl, Memory } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
}

// Documents API
export const documentsApi = {
  // Get all documents with optional filtering
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    category?: string;
    published?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Document[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/documents${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific document by ID
  async getDocument(id: string): Promise<Document> {
    return apiRequest(`/documents/${id}`);
  },

  // Create a new document
  async createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    return apiRequest('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    });
  },

  // Update an existing document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    return apiRequest(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    return apiRequest(`/documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Get documents by category
  async getDocumentsByCategory(category: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Document[]; pagination: any }> {
    return this.getDocuments({ ...params, category });
  },
};

// Update Logs API
export const updateLogsApi = {
  // Get all update logs
  async getUpdateLogs(params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: UpdateLog[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/update-logs${queryString ? `?${queryString}` : ''}`);
  },

  // Get only published update logs
  async getPublishedUpdateLogs(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: UpdateLog[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/update-logs/published${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific update log by ID
  async getUpdateLog(id: string): Promise<UpdateLog> {
    return apiRequest(`/update-logs/${id}`);
  },

  // Create a new update log
  async createUpdateLog(updateLog: Omit<UpdateLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<UpdateLog> {
    return apiRequest('/update-logs', {
      method: 'POST',
      body: JSON.stringify(updateLog),
    });
  },

  // Update an existing update log
  async updateUpdateLog(id: string, updates: Partial<UpdateLog>): Promise<UpdateLog> {
    return apiRequest(`/update-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete an update log
  async deleteUpdateLog(id: string): Promise<void> {
    return apiRequest(`/update-logs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Characters API (Girls)
export const charactersApi = {
  // Get all characters
  async getCharacters(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Character[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/characters${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific character by ID
  async getCharacter(id: string): Promise<Character> {
    return apiRequest(`/characters/${id}`);
  },

  // Get character skills
  async getCharacterSkills(id: string): Promise<Skill[]> {
    return apiRequest(`/characters/${id}/skills`);
  },

  // Get character swimsuits
  async getCharacterSwimsuits(id: string): Promise<Swimsuit[]> {
    return apiRequest(`/characters/${id}/swimsuits`);
  },

  // Create a new character
  async createCharacter(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
    return apiRequest('/characters', {
      method: 'POST',
      body: JSON.stringify(character),
    });
  },

  // Update an existing character
  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character> {
    return apiRequest(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a character
  async deleteCharacter(id: string): Promise<void> {
    return apiRequest(`/characters/${id}`, {
      method: 'DELETE',
    });
  },
};

// Swimsuits API
export const swimsuitsApi = {
  // Get all swimsuits
  async getSwimsuits(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Swimsuit[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/swimsuits${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific swimsuit by ID
  async getSwimsuit(id: string): Promise<Swimsuit> {
    return apiRequest(`/swimsuits/${id}`);
  },

  // Create a new swimsuit
  async createSwimsuit(swimsuit: Omit<Swimsuit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Swimsuit> {
    return apiRequest('/swimsuits', {
      method: 'POST',
      body: JSON.stringify(swimsuit),
    });
  },

  // Update an existing swimsuit
  async updateSwimsuit(id: string, updates: Partial<Swimsuit>): Promise<Swimsuit> {
    return apiRequest(`/swimsuits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a swimsuit
  async deleteSwimsuit(id: string): Promise<void> {
    return apiRequest(`/swimsuits/${id}`, {
      method: 'DELETE',
    });
  },
};

// Skills API
export const skillsApi = {
  // Get all skills
  async getSkills(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Skill[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/skills${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific skill by ID
  async getSkill(id: string): Promise<Skill> {
    return apiRequest(`/skills/${id}`);
  },

  // Create a new skill
  async createSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    return apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  },

  // Update an existing skill
  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    return apiRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a skill
  async deleteSkill(id: string): Promise<void> {
    return apiRequest(`/skills/${id}`, {
      method: 'DELETE',
    });
  },
};

// Events API
export const eventsApi = {
  // Get all events
  async getEvents(params?: {
    page?: number;
    limit?: number;
    type?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Event[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific event by ID
  async getEvent(id: string): Promise<Event> {
    return apiRequest(`/events/${id}`);
  },

  // Create a new event
  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  // Update an existing event
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Accessories API
export const accessoriesApi = {
  // Get all accessories
  async getAccessories(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Accessory[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/accessories${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific accessory by ID
  async getAccessory(id: string): Promise<Accessory> {
    return apiRequest(`/accessories/${id}`);
  },

  // Get accessory girls
  async getAccessoryGirls(id: string): Promise<Character[]> {
    return apiRequest(`/accessories/${id}/girls`);
  },

  // Create a new accessory
  async createAccessory(accessory: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Accessory> {
    return apiRequest('/accessories', {
      method: 'POST',
      body: JSON.stringify(accessory),
    });
  },

  // Update an existing accessory
  async updateAccessory(id: string, updates: Partial<Accessory>): Promise<Accessory> {
    return apiRequest(`/accessories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete an accessory
  async deleteAccessory(id: string): Promise<void> {
    return apiRequest(`/accessories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bromides API
export const bromidesApi = {
  // Get all bromides
  async getBromides(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Bromide[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/bromides${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific bromide by ID
  async getBromide(id: string): Promise<Bromide> {
    return apiRequest(`/bromides/${id}`);
  },

  // Create a new bromide
  async createBromide(bromide: Omit<Bromide, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bromide> {
    return apiRequest('/bromides', {
      method: 'POST',
      body: JSON.stringify(bromide),
    });
  },

  // Update an existing bromide
  async updateBromide(id: string, updates: Partial<Bromide>): Promise<Bromide> {
    return apiRequest(`/bromides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a bromide
  async deleteBromide(id: string): Promise<void> {
    return apiRequest(`/bromides/${id}`, {
      method: 'DELETE',
    });
  },
};

// Girls API (for gameplay data with stats, swimsuits, accessories)
export const girlsApi = {
  // Get all girls with gameplay data
  async getGirls(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    rarity?: string;
    type?: string;
  }): Promise<{ data: Girl[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/girls${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific girl by ID
  async getGirl(id: string): Promise<Girl> {
    return apiRequest(`/girls/${id}`);
  },

  // Get girl skills
  async getGirlSkills(id: string): Promise<Skill[]> {
    return apiRequest(`/girls/${id}/skills`);
  },

  // Get girl swimsuits
  async getGirlSwimsuits(id: string): Promise<Swimsuit[]> {
    return apiRequest(`/girls/${id}/swimsuits`);
  },
};

// Memories API
export const memoriesApi = {
  // Get all memories with optional filtering
  async getMemories(params?: {
    page?: number;
    limit?: number;
    type?: string;
    favorite?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Memory[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/memories${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific memory by ID
  async getMemory(id: string): Promise<Memory> {
    return apiRequest(`/memories/${id}`);
  },

  // Create a new memory
  async createMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    return apiRequest('/memories', {
      method: 'POST',
      body: JSON.stringify(memory),
    });
  },

  // Update an existing memory
  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    return apiRequest(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Toggle memory favorite status
  async toggleMemoryFavorite(id: string, favorite: boolean): Promise<Memory> {
    return apiRequest(`/memories/${id}/favorite`, {
      method: 'PATCH',
      body: JSON.stringify({ favorite }),
    });
  },

  // Delete a memory
  async deleteMemory(id: string): Promise<void> {
    return apiRequest(`/memories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Shop Items API
export const shopItemsApi = {
  // Get all shop items
  async getShopItems(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    section?: 'owner' | 'event' | 'venus' | 'vip';
    type?: 'swimsuit' | 'accessory' | 'decoration' | 'currency' | 'booster';
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    currency?: 'coins' | 'gems' | 'tickets';
    inStock?: boolean;
    isNew?: boolean;
    hasDiscount?: boolean;
    featured?: boolean;
    priceMin?: number;
    priceMax?: number;
  }): Promise<{ data: any[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return apiRequest(`/shop-items${queryString ? `?${queryString}` : ''}`);
  },

  // Get a specific shop item by ID
  async getShopItem(id: string): Promise<any> {
    return apiRequest(`/shop-items/${id}`);
  },

  // Create a new shop item
  async createShopItem(shopItem: any): Promise<any> {
    return apiRequest('/shop-items', {
      method: 'POST',
      body: JSON.stringify(shopItem),
    });
  },

  // Update an existing shop item
  async updateShopItem(id: string, updates: any): Promise<any> {
    return apiRequest(`/shop-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a shop item
  async deleteShopItem(id: string): Promise<void> {
    return apiRequest(`/shop-items/${id}`, {
      method: 'DELETE',
    });
  },
};

export default { 
  documentsApi, 
  updateLogsApi, 
  charactersApi, 
  swimsuitsApi, 
  skillsApi, 
  accessoriesApi,
  eventsApi,
  bromidesApi,
  girlsApi,
  memoriesApi
}; 