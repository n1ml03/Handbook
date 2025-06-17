import { BaseModel, PaginationOptions, PaginatedResult } from './BaseModel';
import { Character, NewCharacter } from '../types/database';
import { executeQuery } from '@config/database';
import { AppError } from '@middleware/errorHandler';

export class CharacterModel extends BaseModel {
  constructor() {
    super('characters');
  }

  // Mapper function to convert database row to Character object
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

  async create(character: NewCharacter): Promise<Character> {
    try {
      await executeQuery(
        `INSERT INTO characters (id, name, name_jp, name_en, name_zh, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [character.id, character.name, character.nameJp, character.nameEn, character.nameZh]
      );

      return this.findById(character.id, this.mapCharacterRow);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Character with this ID already exists', 409);
      }
      throw new AppError('Failed to create character', 500);
    }
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Character>> {
    return this.getPaginatedResults(
      'SELECT * FROM characters',
      'SELECT COUNT(*) FROM characters',
      options,
      this.mapCharacterRow
    );
  }

  async findById(id: string): Promise<Character> {
    return super.findById(id, this.mapCharacterRow);
  }

  async update(id: string, updates: Partial<NewCharacter>): Promise<Character> {
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
      return this.findById(id);
    }

    setClause.push(`updated_at = NOW()`);
    params.push(id);

    await executeQuery(
      `UPDATE characters SET ${setClause.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.deleteById(id);
  }

  async search(query: string, options: PaginationOptions = {}): Promise<PaginatedResult<Character>> {
    const searchPattern = `%${query}%`;
    return this.getPaginatedResults(
      `SELECT * FROM characters WHERE name LIKE ? OR name_jp LIKE ? OR name_en LIKE ? OR name_zh LIKE ?`,
      `SELECT COUNT(*) FROM characters WHERE name LIKE ? OR name_jp LIKE ? OR name_en LIKE ? OR name_zh LIKE ?`,
      options,
      this.mapCharacterRow,
      [searchPattern, searchPattern, searchPattern, searchPattern]
    );
  }
} 