import mysql from 'mysql2/promise';
import pool, { executeQuery, initializePool } from '../config/database';
import logger from '../config/logger';
import { AppError } from '../middleware/errorHandler';

// Import types from the existing types file
import {
  Character,
  Skill,
  Swimsuit,
  Girl,
  Accessory,
  VenusBoard,
  NewCharacter,
  NewSkill,
  NewSwimsuit,
  NewGirl,
  NewAccessory,
  NewVenusBoard
} from '../types/database';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class DatabaseService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = pool;
  }

  // Initialize the database connection
  async initialize(): Promise<void> {
    await initializePool();
  }

  // Helper method for transactions
  async withTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('Transaction failed:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Helper method for pagination (MySQL syntax)
  private buildPaginationQuery(baseQuery: string, options: PaginationOptions): string {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = options;
    const offset = (page - 1) * limit;

    let query = baseQuery;

    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    return query;
  }

  private async getPaginatedResults<T>(
    baseQuery: string,
    countQuery: string,
    options: PaginationOptions,
    mapFunction: (row: any) => T,
    params: any[] = []
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10 } = options;

    try {
      // Get total count
      const [countRows] = await executeQuery(countQuery, params) as [any[], any];
      const total = countRows[0]['COUNT(*)'] || countRows[0].count || 0;

      // Get paginated data
      const paginatedQuery = this.buildPaginationQuery(baseQuery, options);
      const [dataRows] = await executeQuery(paginatedQuery, params) as [any[], any];
      const data = dataRows.map(mapFunction);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Pagination query failed:', error);
      throw new AppError('Failed to fetch paginated results', 500);
    }
  }

  // Characters CRUD
  async createCharacter(character: NewCharacter): Promise<Character> {
    try {
      await executeQuery(
        `INSERT INTO characters (id, name, name_jp, name_en, name_zh, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [character.id, character.name, character.nameJp, character.nameEn, character.nameZh]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM characters WHERE id = ?',
        [character.id]
      ) as [any[], any];

      return this.mapCharacterRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') { // Unique constraint violation in MySQL
        throw new AppError('Character with this ID already exists', 409);
      }
      throw new AppError('Failed to create character', 500);
    }
  }

  async getCharacters(options: PaginationOptions = {}): Promise<PaginatedResult<Character>> {
    return this.getPaginatedResults(
      'SELECT * FROM characters',
      'SELECT COUNT(*) FROM characters',
      options,
      this.mapCharacterRow
    );
  }

  async getCharacterById(id: string): Promise<Character> {
    const [rows] = await executeQuery('SELECT * FROM characters WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Character not found', 404);
    }
    return this.mapCharacterRow(rows[0]);
  }

  async updateCharacter(id: string, updates: Partial<NewCharacter>): Promise<Character> {
    const setClause: string[] = [];
    const params: any[] = [];

    if (updates.name !== undefined) {
      setClause.push(`name = ?`);
      params.push(updates.name);
    }
    if (updates.nameJp !== undefined) {
      setClause.push(`name_jp = ?`);
      params.push(updates.nameJp);
    }
    if (updates.nameEn !== undefined) {
      setClause.push(`name_en = ?`);
      params.push(updates.nameEn);
    }
    if (updates.nameZh !== undefined) {
      setClause.push(`name_zh = ?`);
      params.push(updates.nameZh);
    }

    if (setClause.length === 0) {
      return this.getCharacterById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE characters SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getCharacterById(id);
  }

  async deleteCharacter(id: string): Promise<void> {
    await executeQuery('DELETE FROM characters WHERE id = ?', [id]);
  }

  // Skills CRUD
  async createSkill(skill: NewSkill): Promise<Skill> {
    try {
      await executeQuery(
        `INSERT INTO skills (id, name, type, description, icon, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [skill.id, skill.name, skill.type, skill.description, skill.icon]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM skills WHERE id = ?',
        [skill.id]
      ) as [any[], any];

      return this.mapSkillRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Skill with this ID already exists', 409);
      }
      throw new AppError('Failed to create skill', 500);
    }
  }

  async getSkills(options: PaginationOptions = {}): Promise<PaginatedResult<Skill>> {
    return this.getPaginatedResults(
      'SELECT * FROM skills',
      'SELECT COUNT(*) FROM skills',
      options,
      this.mapSkillRow
    );
  }

  async getSkillById(id: string): Promise<Skill> {
    const [rows] = await executeQuery('SELECT * FROM skills WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Skill not found', 404);
    }
    return this.mapSkillRow(rows[0]);
  }

  async updateSkill(id: string, updates: Partial<NewSkill>): Promise<Skill> {
    const setClause: string[] = [];
    const params: any[] = [];

    if (updates.name !== undefined) {
      setClause.push(`name = ?`);
      params.push(updates.name);
    }
    if (updates.type !== undefined) {
      setClause.push(`type = ?`);
      params.push(updates.type);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = ?`);
      params.push(updates.description);
    }
    if (updates.icon !== undefined) {
      setClause.push(`icon = ?`);
      params.push(updates.icon);
    }

    if (setClause.length === 0) {
      return this.getSkillById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE skills SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getSkillById(id);
  }

  async deleteSkill(id: string): Promise<void> {
    await executeQuery('DELETE FROM skills WHERE id = ?', [id]);
  }

  // Swimsuits CRUD
  async createSwimsuit(swimsuit: NewSwimsuit): Promise<Swimsuit> {
    try {
      await executeQuery(
        `INSERT INTO swimsuits (id, name, character_id, rarity, pow, tec, stm, apl, release_date, reappear_date, image, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [swimsuit.id, swimsuit.name, swimsuit.characterId, swimsuit.rarity, swimsuit.pow, swimsuit.tec, swimsuit.stm, swimsuit.apl, swimsuit.releaseDate, swimsuit.reappearDate, swimsuit.image]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM swimsuits WHERE id = ?',
        [swimsuit.id]
      ) as [any[], any];

      return this.mapSwimsuitRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Swimsuit with this ID already exists', 409);
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new AppError('Character not found', 404);
      }
      throw new AppError('Failed to create swimsuit', 500);
    }
  }

  async getSwimsuits(options: PaginationOptions = {}): Promise<PaginatedResult<Swimsuit>> {
    return this.getPaginatedResults(
      'SELECT * FROM swimsuits',
      'SELECT COUNT(*) FROM swimsuits',
      { sortBy: 'release_date', sortOrder: 'desc', ...options },
      this.mapSwimsuitRow
    );
  }

  async getSwimsuitById(id: string): Promise<Swimsuit> {
    const [rows] = await executeQuery('SELECT * FROM swimsuits WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Swimsuit not found', 404);
    }
    return this.mapSwimsuitRow(rows[0]);
  }

  async getSwimsuitsByCharacter(characterId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Swimsuit>> {
    return this.getPaginatedResults(
      'SELECT * FROM swimsuits WHERE character_id = ?',
      'SELECT COUNT(*) FROM swimsuits WHERE character_id = ?',
      { sortBy: 'release_date', sortOrder: 'desc', ...options },
      this.mapSwimsuitRow,
      [characterId]
    );
  }

  async updateSwimsuit(id: string, updates: Partial<NewSwimsuit>): Promise<Swimsuit> {
    const setClause: string[] = [];
    const params: any[] = [];

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'characterId' ? 'character_id' :
                     key === 'releaseDate' ? 'release_date' :
                     key === 'reappearDate' ? 'reappear_date' : key;
        setClause.push(`${dbKey} = ?`);
        params.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getSwimsuitById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE swimsuits SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getSwimsuitById(id);
  }

  async deleteSwimsuit(id: string): Promise<void> {
    await executeQuery('DELETE FROM swimsuits WHERE id = ?', [id]);
  }

  // Girls CRUD
  async createGirl(girl: NewGirl): Promise<Girl> {
    try {
      await executeQuery(
        `INSERT INTO girls (id, name, type, level, pow, tec, stm, apl, max_pow, max_tec, max_stm, max_apl, birthday, swimsuit_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [girl.id, girl.name, girl.type, girl.level, girl.pow, girl.tec, girl.stm, girl.apl, girl.maxPow, girl.maxTec, girl.maxStm, girl.maxApl, girl.birthday, girl.swimsuitId]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM girls WHERE id = ?',
        [girl.id]
      ) as [any[], any];

      return this.mapGirlRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Girl with this ID already exists', 409);
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new AppError('Referenced swimsuit not found', 404);
      }
      throw new AppError('Failed to create girl', 500);
    }
  }

  async getGirls(options: PaginationOptions = {}): Promise<PaginatedResult<Girl>> {
    return this.getPaginatedResults(
      'SELECT * FROM girls',
      'SELECT COUNT(*) FROM girls',
      { sortBy: 'level', sortOrder: 'desc', ...options },
      this.mapGirlRow
    );
  }

  async getGirlById(id: string): Promise<Girl> {
    const [rows] = await executeQuery('SELECT * FROM girls WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Girl not found', 404);
    }
    return this.mapGirlRow(rows[0]);
  }

  async updateGirl(id: string, updates: Partial<NewGirl>): Promise<Girl> {
    const setClause: string[] = [];
    const params: any[] = [];

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'maxPow' ? 'max_pow' :
                     key === 'maxTec' ? 'max_tec' :
                     key === 'maxStm' ? 'max_stm' :
                     key === 'maxApl' ? 'max_apl' :
                     key === 'swimsuitId' ? 'swimsuit_id' : key;
        setClause.push(`${dbKey} = ?`);
        params.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getGirlById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE girls SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getGirlById(id);
  }

  async deleteGirl(id: string): Promise<void> {
    await executeQuery('DELETE FROM girls WHERE id = ?', [id]);
  }

  // Accessories CRUD
  async createAccessory(accessory: NewAccessory): Promise<Accessory> {
    try {
      await executeQuery(
        `INSERT INTO accessories (id, name, type, skill_id, pow, tec, stm, apl, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [accessory.id, accessory.name, accessory.type, accessory.skillId, accessory.pow, accessory.tec, accessory.stm, accessory.apl]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM accessories WHERE id = ?',
        [accessory.id]
      ) as [any[], any];

      return this.mapAccessoryRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Accessory with this ID already exists', 409);
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new AppError('Referenced skill not found', 404);
      }
      throw new AppError('Failed to create accessory', 500);
    }
  }

  async getAccessories(options: PaginationOptions = {}): Promise<PaginatedResult<Accessory>> {
    return this.getPaginatedResults(
      'SELECT * FROM accessories',
      'SELECT COUNT(*) FROM accessories',
      { sortBy: 'name', sortOrder: 'asc', ...options },
      this.mapAccessoryRow
    );
  }

  async getAccessoryById(id: string): Promise<Accessory> {
    const [rows] = await executeQuery('SELECT * FROM accessories WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Accessory not found', 404);
    }
    return this.mapAccessoryRow(rows[0]);
  }

  async getAccessoriesByType(type: string, options: PaginationOptions = {}): Promise<PaginatedResult<Accessory>> {
    return this.getPaginatedResults(
      'SELECT * FROM accessories WHERE type = ?',
      'SELECT COUNT(*) FROM accessories WHERE type = ?',
      { sortBy: 'name', sortOrder: 'asc', ...options },
      this.mapAccessoryRow,
      [type]
    );
  }

  async updateAccessory(id: string, updates: Partial<NewAccessory>): Promise<Accessory> {
    const setClause: string[] = [];
    const params: any[] = [];

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'skillId' ? 'skill_id' : key;
        setClause.push(`${dbKey} = ?`);
        params.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getAccessoryById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE accessories SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getAccessoryById(id);
  }

  async deleteAccessory(id: string): Promise<void> {
    await executeQuery('DELETE FROM accessories WHERE id = ?', [id]);
  }

  // Venus Board CRUD
  async createVenusBoard(venusBoard: NewVenusBoard): Promise<VenusBoard> {
    try {
      await executeQuery(
        `INSERT INTO venus_boards (girl_id, pow, tec, stm, apl, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [venusBoard.girlId, venusBoard.pow, venusBoard.tec, venusBoard.stm, venusBoard.apl]
      );

      // Get the inserted record
      const [rows] = await executeQuery(
        'SELECT * FROM venus_boards WHERE id = ?',
        [result.insertId]
      ) as [any[], any];

      return this.mapVenusBoardRow(rows[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Venus Board for this girl already exists', 409);
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new AppError('Referenced girl not found', 404);
      }
      throw new AppError('Failed to create Venus Board', 500);
    }
  }

  async getVenusBoards(options: PaginationOptions = {}): Promise<PaginatedResult<VenusBoard>> {
    return this.getPaginatedResults(
      'SELECT * FROM venus_boards',
      'SELECT COUNT(*) FROM venus_boards',
      { sortBy: 'created_at', sortOrder: 'desc', ...options },
      this.mapVenusBoardRow
    );
  }

  async getVenusBoardById(id: number): Promise<VenusBoard> {
    const [rows] = await executeQuery('SELECT * FROM venus_boards WHERE id = ?', [id]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Venus Board not found', 404);
    }
    return this.mapVenusBoardRow(rows[0]);
  }

  async getVenusBoardByGirlId(girlId: string): Promise<VenusBoard> {
    const [rows] = await executeQuery('SELECT * FROM venus_boards WHERE girl_id = ?', [girlId]) as [any[], any];
    if (rows.length === 0) {
      throw new AppError('Venus Board not found for this girl', 404);
    }
    return this.mapVenusBoardRow(rows[0]);
  }

  async updateVenusBoard(id: number, updates: Partial<NewVenusBoard>): Promise<VenusBoard> {
    const setClause: string[] = [];
    const params: any[] = [];

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'girlId' ? 'girl_id' : key;
        setClause.push(`${dbKey} = ?`);
        params.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getVenusBoardById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE venus_boards SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.getVenusBoardById(id);
  }

  async deleteVenusBoard(id: number): Promise<void> {
    await executeQuery('DELETE FROM venus_boards WHERE id = ?', [id]);
  }

  // Health check
  async healthCheck(): Promise<{ isHealthy: boolean; errors: string[] }> {
    try {
      await executeQuery('SELECT 1 as test');
      return { isHealthy: true, errors: [] };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return { isHealthy: false, errors: ['Database connection failed'] };
    }
  }

  // Row mapping functions
  private mapCharacterRow(row: any): Character {
    return {
      id: row.id,
      name: row.name,
      nameJp: row.name_jp,
      nameEn: row.name_en,
      nameZh: row.name_zh,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapSkillRow(row: any): Skill {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      description: row.description,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapSwimsuitRow(row: any): Swimsuit {
    return {
      id: row.id,
      name: row.name,
      characterId: row.character_id,
      rarity: row.rarity,
      pow: row.pow,
      tec: row.tec,
      stm: row.stm,
      apl: row.apl,
      releaseDate: row.release_date,
      reappearDate: row.reappear_date,
      image: row.image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapGirlRow(row: any): Girl {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      level: row.level,
      pow: row.pow,
      tec: row.tec,
      stm: row.stm,
      apl: row.apl,
      maxPow: row.max_pow,
      maxTec: row.max_tec,
      maxStm: row.max_stm,
      maxApl: row.max_apl,
      birthday: row.birthday,
      swimsuitId: row.swimsuit_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAccessoryRow(row: any): Accessory {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      skillId: row.skill_id,
      pow: row.pow,
      tec: row.tec,
      stm: row.stm,
      apl: row.apl,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapVenusBoardRow(row: any): VenusBoard {
    return {
      id: row.id,
      girlId: row.girl_id,
      pow: row.pow,
      tec: row.tec,
      stm: row.stm,
      apl: row.apl,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Additional helper methods for specific use cases
  async getGirlSkills(girlId: string): Promise<any[]> {
    const [rows] = await this.pool.query(
      'SELECT s.* FROM skills s JOIN girl_skills gs ON s.id = gs.skill_id WHERE gs.girl_id = ?',
      [girlId]
    );
    return rows as any[];
  }

  async getGirlSwimsuits(girlId: string): Promise<any[]> {
    const [rows] = await this.pool.query(
      'SELECT s.* FROM swimsuits s JOIN girl_swimsuits gs ON s.id = gs.swimsuit_id WHERE gs.girl_id = ?',
      [girlId]
    );
    return rows as any[];
  }

  async getAccessoryCompatibleGirls(accessoryId: string): Promise<any[]> {
    const [rows] = await this.pool.query(
      'SELECT g.* FROM girls g JOIN accessory_girls ag ON g.id = ag.girl_id WHERE ag.accessory_id = ?',
      [accessoryId]
    );
    return rows as any[];
  }

  async getVenusBoardCompatibleGirls(venusBoardId: number): Promise<any[]> {
    const [rows] = await this.pool.query(
      'SELECT g.* FROM girls g JOIN venus_board_girls vbg ON g.id = vbg.girl_id WHERE vbg.venus_board_id = ?',
      [venusBoardId]
    );
    return rows as any[];
  }

  async getVenusBoardSkills(venusBoardId: number): Promise<any[]> {
    const [rows] = await this.pool.query(
      'SELECT s.* FROM skills s JOIN venus_board_skills vbs ON s.id = vbs.skill_id WHERE vbs.venus_board_id = ?',
      [venusBoardId]
    );
    return rows as any[];
  }
}

export default new DatabaseService(); 