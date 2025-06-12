#!/usr/bin/env bun
/**
 * Complete Database Service Conversion Script
 * 
 * This script provides the remaining CRUD operation conversions
 * that need to be manually applied to DatabaseService.ts
 */

// Swimsuit operations that need conversion
export const swimsuitOperations = {
  createSwimsuit: `
  async createSwimsuit(swimsuit: NewSwimsuit): Promise<Swimsuit> {
    try {
      const request = getRequest();
      request.input('id', sql.NVarChar(255), swimsuit.id);
      request.input('name', sql.NVarChar(255), swimsuit.name);
      request.input('character_id', sql.NVarChar(255), swimsuit.characterId);
      request.input('rarity', sql.NVarChar(10), swimsuit.rarity);
      request.input('pow', sql.Int, swimsuit.pow);
      request.input('tec', sql.Int, swimsuit.tec);
      request.input('stm', sql.Int, swimsuit.stm);
      request.input('apl', sql.Int, swimsuit.apl);
      request.input('release_date', sql.Date, swimsuit.releaseDate);
      request.input('reappear_date', sql.Date, swimsuit.reappearDate);
      request.input('image', sql.NVarChar(500), swimsuit.image);
      
      const result = await request.query(
        \`INSERT INTO swimsuits (id, name, character_id, rarity, pow, tec, stm, apl, release_date, reappear_date, image, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@id, @name, @character_id, @rarity, @pow, @tec, @stm, @apl, @release_date, @reappear_date, @image, GETDATE(), GETDATE())\`
      );
      return this.mapSwimsuitRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
        throw new AppError('Swimsuit with this ID already exists', 409);
      }
      if (error.number === 547) {
        throw new AppError('Character not found', 404);
      }
      throw new AppError('Failed to create swimsuit', 500);
    }
  }`,

  getSwimsuitById: `
  async getSwimsuitById(id: string): Promise<Swimsuit> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('SELECT * FROM swimsuits WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Swimsuit not found', 404);
    }
    return this.mapSwimsuitRow(result.recordset[0]);
  }`,

  deleteSwimsuit: `
  async deleteSwimsuit(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM swimsuits WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Swimsuit not found', 404);
    }
  }`
};

// Girl operations that need conversion
export const girlOperations = {
  createGirl: `
  async createGirl(girl: NewGirl): Promise<Girl> {
    try {
      const request = getRequest();
      request.input('id', sql.NVarChar(255), girl.id);
      request.input('name', sql.NVarChar(255), girl.name);
      request.input('character_id', sql.NVarChar(255), girl.characterId);
      request.input('type', sql.NVarChar(10), girl.type);
      request.input('level', sql.Int, girl.level);
      request.input('pow', sql.Int, girl.pow);
      request.input('tec', sql.Int, girl.tec);
      request.input('stm', sql.Int, girl.stm);
      request.input('apl', sql.Int, girl.apl);
      request.input('max_pow', sql.Int, girl.maxPow);
      request.input('max_tec', sql.Int, girl.maxTec);
      request.input('max_stm', sql.Int, girl.maxStm);
      request.input('max_apl', sql.Int, girl.maxApl);
      request.input('birthday', sql.Date, girl.birthday);
      request.input('swimsuit_id', sql.NVarChar(255), girl.swimsuitId);
      
      const result = await request.query(
        \`INSERT INTO girls (id, name, character_id, type, level, pow, tec, stm, apl, max_pow, max_tec, max_stm, max_apl, birthday, swimsuit_id, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@id, @name, @character_id, @type, @level, @pow, @tec, @stm, @apl, @max_pow, @max_tec, @max_stm, @max_apl, @birthday, @swimsuit_id, GETDATE(), GETDATE())\`
      );
      return this.mapGirlRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
        throw new AppError('Girl with this ID already exists', 409);
      }
      if (error.number === 547) {
        throw new AppError('Referenced swimsuit not found', 404);
      }
      throw new AppError('Failed to create girl', 500);
    }
  }`,

  getGirlById: `
  async getGirlById(id: string): Promise<Girl> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('SELECT * FROM girls WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Girl not found', 404);
    }
    return this.mapGirlRow(result.recordset[0]);
  }`,

  deleteGirl: `
  async deleteGirl(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM girls WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Girl not found', 404);
    }
  }`
};

// Accessory operations that need conversion
export const accessoryOperations = {
  createAccessory: `
  async createAccessory(accessory: NewAccessory): Promise<Accessory> {
    try {
      const request = getRequest();
      request.input('id', sql.NVarChar(255), accessory.id);
      request.input('name', sql.NVarChar(255), accessory.name);
      request.input('type', sql.NVarChar(20), accessory.type);
      request.input('skill_id', sql.NVarChar(255), accessory.skillId);
      request.input('pow', sql.Int, accessory.pow);
      request.input('tec', sql.Int, accessory.tec);
      request.input('stm', sql.Int, accessory.stm);
      request.input('apl', sql.Int, accessory.apl);
      
      const result = await request.query(
        \`INSERT INTO accessories (id, name, type, skill_id, pow, tec, stm, apl, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@id, @name, @type, @skill_id, @pow, @tec, @stm, @apl, GETDATE(), GETDATE())\`
      );
      return this.mapAccessoryRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
        throw new AppError('Accessory with this ID already exists', 409);
      }
      if (error.number === 547) {
        throw new AppError('Referenced skill not found', 404);
      }
      throw new AppError('Failed to create accessory', 500);
    }
  }`,

  getAccessoryById: `
  async getAccessoryById(id: string): Promise<Accessory> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('SELECT * FROM accessories WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Accessory not found', 404);
    }
    return this.mapAccessoryRow(result.recordset[0]);
  }`,

  deleteAccessory: `
  async deleteAccessory(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM accessories WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Accessory not found', 404);
    }
  }`
};

// Venus Board operations that need conversion
export const venusBoardOperations = {
  createVenusBoard: `
  async createVenusBoard(venusBoard: NewVenusBoard): Promise<VenusBoard> {
    try {
      const request = getRequest();
      request.input('girl_id', sql.NVarChar(255), venusBoard.girlId);
      request.input('pow', sql.Int, venusBoard.pow);
      request.input('tec', sql.Int, venusBoard.tec);
      request.input('stm', sql.Int, venusBoard.stm);
      request.input('apl', sql.Int, venusBoard.apl);
      
      const result = await request.query(
        \`INSERT INTO venus_boards (girl_id, pow, tec, stm, apl, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (@girl_id, @pow, @tec, @stm, @apl, GETDATE(), GETDATE())\`
      );
      return this.mapVenusBoardRow(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
        throw new AppError('Venus Board for this girl already exists', 409);
      }
      if (error.number === 547) {
        throw new AppError('Referenced girl not found', 404);
      }
      throw new AppError('Failed to create Venus Board', 500);
    }
  }`,

  getVenusBoardById: `
  async getVenusBoardById(id: number): Promise<VenusBoard> {
    const request = getRequest();
    request.input('id', sql.Int, id);
    const result = await request.query('SELECT * FROM venus_boards WHERE id = @id');
    if (result.recordset.length === 0) {
      throw new AppError('Venus Board not found', 404);
    }
    return this.mapVenusBoardRow(result.recordset[0]);
  }`,

  deleteVenusBoard: `
  async deleteVenusBoard(id: number): Promise<void> {
    const request = getRequest();
    request.input('id', sql.Int, id);
    const result = await request.query('DELETE FROM venus_boards WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('Venus Board not found', 404);
    }
  }`
};

console.log('Database Service Conversion Templates Generated');
console.log('Apply these conversions to backend/services/DatabaseService.ts');

export default {
  swimsuitOperations,
  girlOperations,
  accessoryOperations,
  venusBoardOperations
};
