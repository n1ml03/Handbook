import * as sql from 'mssql';
import pool, { getRequest, initializePool } from '../config/database';
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
  NewVenusBoard,
  SwimsuitWithSkills,
  GirlWithDetails,
  UserSetting
} from '../../frontend/lib/db/types';

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
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = pool;
  }

  // Initialize the database connection
  async initialize(): Promise<void> {
    await initializePool();
  }

  // Helper method for transactions
  async withTransaction<T>(callback: (transaction: sql.Transaction) => Promise<T>): Promise<T> {
    const transaction = new sql.Transaction(this.pool);
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      logger.error('Transaction failed:', error);
      throw error;
    }
  }

  // Helper method for pagination (SQL Server syntax)
  private buildPaginationQuery(baseQuery: string, options: PaginationOptions): string {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = options;
    const offset = (page - 1) * limit;

    let query = baseQuery;

    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      // SQL Server requires ORDER BY for OFFSET/FETCH
      query += ` ORDER BY (SELECT NULL)`;
    }

    query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

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
      const countRequest = getRequest();
      if (params.length > 0) {
        params.forEach((param, index) => {
          countRequest.input(`param${index + 1}`, param);
        });
        const paramPlaceholders = params.map((_, index) => `@param${index + 1}`).join(', ');
        const modifiedCountQuery = countQuery.replace(/\$\d+/g, (match) => {
          const paramIndex = parseInt(match.substring(1));
          return `@param${paramIndex}`;
        });
        const countResult = await countRequest.query(modifiedCountQuery);
        var total = countResult.recordset[0][''] || countResult.recordset[0].count || 0;
      } else {
        const countResult = await countRequest.query(countQuery);
        var total = countResult.recordset[0][''] || countResult.recordset[0].count || 0;
      }

      // Get paginated data
      const paginatedQuery = this.buildPaginationQuery(baseQuery, options);
      const dataRequest = getRequest();

      if (params.length > 0) {
        params.forEach((param, index) => {
          dataRequest.input(`param${index + 1}`, param);
        });
        const modifiedDataQuery = paginatedQuery.replace(/\$\d+/g, (match) => {
          const paramIndex = parseInt(match.substring(1));
          return `@param${paramIndex}`;
        });
        const dataResult = await dataRequest.query(modifiedDataQuery);
        var data = dataResult.recordset.map(mapFunction);
      } else {
        const dataResult = await dataRequest.query(paginatedQuery);
        var data = dataResult.recordset.map(mapFunction);
      }

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
      const request = getRequest();
      request.input('id', sql.NVarChar(255), character.id);
      request.input('name', sql.NVarChar(255), character.name);
      request.input('name_jp', sql.NVarChar(255), character.nameJp);
      request.input('name_en', sql.NVarChar(255), character.nameEn);
      request.input('name_zh', sql.NVarChar(255), character.nameZh);

      const result = await request.query(
        `INSERT INTO characters (id, name, name_jp, name_en, name_zh, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@id, @name, @name_jp, @name_en, @name_zh, GETDATE(), GETDATE())`
      );
      return this.mapCharacterRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) { // Unique constraint violation in SQL Server
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
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('SELECT * FROM characters WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Character not found', 404);
    }
    return this.mapCharacterRow(result.recordset[0]);
  }

  async updateCharacter(id: string, updates: Partial<NewCharacter>): Promise<Character> {
    const setClause = [];
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);

    if (updates.name !== undefined) {
      setClause.push(`name = @name`);
      request.input('name', sql.NVarChar(255), updates.name);
    }
    if (updates.nameJp !== undefined) {
      setClause.push(`name_jp = @name_jp`);
      request.input('name_jp', sql.NVarChar(255), updates.nameJp);
    }
    if (updates.nameEn !== undefined) {
      setClause.push(`name_en = @name_en`);
      request.input('name_en', sql.NVarChar(255), updates.nameEn);
    }
    if (updates.nameZh !== undefined) {
      setClause.push(`name_zh = @name_zh`);
      request.input('name_zh', sql.NVarChar(255), updates.nameZh);
    }

    if (setClause.length === 0) {
      return this.getCharacterById(id);
    }

    setClause.push(`updated_at = GETDATE()`);

    const result = await request.query(
      `UPDATE characters SET ${setClause.join(', ')} OUTPUT INSERTED.* WHERE id = @id`
    );

    if (result.recordset.length === 0) {
      throw new AppError('Character not found', 404);
    }

    return this.mapCharacterRow(result.recordset[0]);
  }

  async deleteCharacter(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM characters WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Character not found', 404);
    }
  }

  // Skills CRUD
  async createSkill(skill: NewSkill): Promise<Skill> {
    try {
      const request = getRequest();
      request.input('id', sql.NVarChar(255), skill.id);
      request.input('name', sql.NVarChar(255), skill.name);
      request.input('type', sql.NVarChar(100), skill.type);
      request.input('description', sql.NVarChar(sql.MAX), skill.description);
      request.input('icon', sql.NVarChar(255), skill.icon);

      const result = await request.query(
        `INSERT INTO skills (id, name, type, description, icon, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@id, @name, @type, @description, @icon, GETDATE(), GETDATE())`
      );
      return this.mapSkillRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
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
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('SELECT * FROM skills WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Skill not found', 404);
    }
    return this.mapSkillRow(result.recordset[0]);
  }

  async updateSkill(id: string, updates: Partial<NewSkill>): Promise<Skill> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.type !== undefined) {
      setClause.push(`type = $${paramIndex++}`);
      values.push(updates.type);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.icon !== undefined) {
      setClause.push(`icon = $${paramIndex++}`);
      values.push(updates.icon);
    }

    if (setClause.length === 0) {
      return this.getSkillById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE skills SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Skill not found', 404);
    }

    return this.mapSkillRow(result.rows[0]);
  }

  async deleteSkill(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM skills WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Skill not found', 404);
    }
  }

  // Swimsuits CRUD
  async createSwimsuit(swimsuit: NewSwimsuit): Promise<Swimsuit> {
    try {
      const result = await this.pool.query(
        `INSERT INTO swimsuits (id, name, character_id, rarity, pow, tec, stm, apl, release_date, reappear_date, image, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [swimsuit.id, swimsuit.name, swimsuit.characterId, swimsuit.rarity, swimsuit.pow, swimsuit.tec, swimsuit.stm, swimsuit.apl, swimsuit.releaseDate, swimsuit.reappearDate, swimsuit.image]
      );
      return this.mapSwimsuitRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('Swimsuit with this ID already exists', 409);
      }
      if (error.code === '23503') {
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
    const result = await this.pool.query('SELECT * FROM swimsuits WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Swimsuit not found', 404);
    }
    return this.mapSwimsuitRow(result.rows[0]);
  }

  async getSwimsuitsByCharacter(characterId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Swimsuit>> {
    return this.getPaginatedResults(
      'SELECT * FROM swimsuits WHERE character_id = $1',
      'SELECT COUNT(*) FROM swimsuits WHERE character_id = $1',
      { sortBy: 'release_date', sortOrder: 'desc', ...options },
      this.mapSwimsuitRow,
      [characterId]
    );
  }

  async updateSwimsuit(id: string, updates: Partial<NewSwimsuit>): Promise<Swimsuit> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'characterId' ? 'character_id' : 
                     key === 'releaseDate' ? 'release_date' :
                     key === 'reappearDate' ? 'reappear_date' : key;
        setClause.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getSwimsuitById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    try {
      const result = await this.pool.query(
        `UPDATE swimsuits SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Swimsuit not found', 404);
      }

      return this.mapSwimsuitRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new AppError('Character not found', 404);
      }
      throw new AppError('Failed to update swimsuit', 500);
    }
  }

  async deleteSwimsuit(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM swimsuits WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Swimsuit not found', 404);
    }
  }

  // Girls CRUD
  async createGirl(girl: NewGirl): Promise<Girl> {
    try {
      const result = await this.pool.query(
        `INSERT INTO girls (id, name, type, level, pow, tec, stm, apl, max_pow, max_tec, max_stm, max_apl, birthday, swimsuit_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [girl.id, girl.name, girl.type, girl.level, girl.pow, girl.tec, girl.stm, girl.apl, girl.maxPow, girl.maxTec, girl.maxStm, girl.maxApl, girl.birthday, girl.swimsuitId]
      );
      return this.mapGirlRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('Girl with this ID already exists', 409);
      }
      if (error.code === '23503') {
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
    const result = await this.pool.query('SELECT * FROM girls WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Girl not found', 404);
    }
    return this.mapGirlRow(result.rows[0]);
  }

  async updateGirl(id: string, updates: Partial<NewGirl>): Promise<Girl> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'maxPow' ? 'max_pow' :
                     key === 'maxTec' ? 'max_tec' :
                     key === 'maxStm' ? 'max_stm' :
                     key === 'maxApl' ? 'max_apl' :
                     key === 'swimsuitId' ? 'swimsuit_id' : key;
        setClause.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getGirlById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    try {
      const result = await this.pool.query(
        `UPDATE girls SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Girl not found', 404);
      }

      return this.mapGirlRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new AppError('Referenced swimsuit not found', 404);
      }
      throw new AppError('Failed to update girl', 500);
    }
  }

  async deleteGirl(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM girls WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Girl not found', 404);
    }
  }

  // Accessories CRUD
  async createAccessory(accessory: NewAccessory): Promise<Accessory> {
    try {
      const result = await this.pool.query(
        `INSERT INTO accessories (id, name, type, skill_id, pow, tec, stm, apl, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [accessory.id, accessory.name, accessory.type, accessory.skillId, accessory.pow, accessory.tec, accessory.stm, accessory.apl]
      );
      return this.mapAccessoryRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('Accessory with this ID already exists', 409);
      }
      if (error.code === '23503') {
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
    const result = await this.pool.query('SELECT * FROM accessories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Accessory not found', 404);
    }
    return this.mapAccessoryRow(result.rows[0]);
  }

  async getAccessoriesByType(type: string, options: PaginationOptions = {}): Promise<PaginatedResult<Accessory>> {
    return this.getPaginatedResults(
      'SELECT * FROM accessories WHERE type = $1',
      'SELECT COUNT(*) FROM accessories WHERE type = $1',
      { sortBy: 'name', sortOrder: 'asc', ...options },
      this.mapAccessoryRow,
      [type]
    );
  }

  async updateAccessory(id: string, updates: Partial<NewAccessory>): Promise<Accessory> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'skillId' ? 'skill_id' : key;
        setClause.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getAccessoryById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    try {
      const result = await this.pool.query(
        `UPDATE accessories SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Accessory not found', 404);
      }

      return this.mapAccessoryRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new AppError('Referenced skill not found', 404);
      }
      throw new AppError('Failed to update accessory', 500);
    }
  }

  async deleteAccessory(id: string): Promise<void> {
    const result = await this.pool.query('DELETE FROM accessories WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Accessory not found', 404);
    }
  }

  // Venus Board CRUD
  async createVenusBoard(venusBoard: NewVenusBoard): Promise<VenusBoard> {
    try {
      const result = await this.pool.query(
        `INSERT INTO venus_boards (girl_id, pow, tec, stm, apl, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [venusBoard.girlId, venusBoard.pow, venusBoard.tec, venusBoard.stm, venusBoard.apl]
      );
      return this.mapVenusBoardRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('Venus Board for this girl already exists', 409);
      }
      if (error.code === '23503') {
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
    const result = await this.pool.query('SELECT * FROM venus_boards WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Venus Board not found', 404);
    }
    return this.mapVenusBoardRow(result.rows[0]);
  }

  async getVenusBoardByGirlId(girlId: string): Promise<VenusBoard> {
    const result = await this.pool.query('SELECT * FROM venus_boards WHERE girl_id = $1', [girlId]);
    if (result.rows.length === 0) {
      throw new AppError('Venus Board not found for this girl', 404);
    }
    return this.mapVenusBoardRow(result.rows[0]);
  }

  async updateVenusBoard(id: number, updates: Partial<NewVenusBoard>): Promise<VenusBoard> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        const dbKey = key === 'girlId' ? 'girl_id' : key;
        setClause.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return this.getVenusBoardById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    try {
      const result = await this.pool.query(
        `UPDATE venus_boards SET ${setClause.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Venus Board not found', 404);
      }

      return this.mapVenusBoardRow(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new AppError('Referenced girl not found', 404);
      }
      throw new AppError('Failed to update Venus Board', 500);
    }
  }

  async deleteVenusBoard(id: number): Promise<void> {
    const result = await this.pool.query('DELETE FROM venus_boards WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Venus Board not found', 404);
    }
  }

  // Health check
  async healthCheck(): Promise<{ isHealthy: boolean; errors: string[] }> {
    try {
      const request = getRequest();
      await request.query('SELECT 1 as test');
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
}

export default new DatabaseService(); 