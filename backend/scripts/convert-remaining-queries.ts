// Script to help convert remaining PostgreSQL queries to SQL Server
// This is a reference for manual conversion of the remaining CRUD operations

export const conversionPatterns = {
  // Parameter placeholders
  postgresParams: /\$(\d+)/g,
  sqlServerParams: '@param$1',
  
  // Data types mapping
  dataTypes: {
    'VARCHAR': 'NVARCHAR',
    'TEXT': 'NVARCHAR(MAX)',
    'SERIAL': 'IDENTITY(1,1)',
    'TIMESTAMP': 'DATETIME2',
    'BOOLEAN': 'BIT',
    'JSONB': 'NVARCHAR(MAX)', // Store as JSON string
  },
  
  // Function mappings
  functions: {
    'NOW()': 'GETDATE()',
    'CURRENT_TIMESTAMP': 'GETDATE()',
    'RETURNING *': 'OUTPUT INSERTED.*',
  },
  
  // Error code mappings
  errorCodes: {
    '23505': 2627, // Unique constraint violation
    '23503': 547,  // Foreign key constraint violation
  },
  
  // Result object mappings
  resultMappings: {
    'result.rows': 'result.recordset',
    'result.rowCount': 'result.rowsAffected[0]',
    'result.rows[0]': 'result.recordset[0]',
    'result.rows.length': 'result.recordset.length',
  }
};

// Template for converting a simple SELECT query
export const convertSelectQuery = (originalQuery: string, _params: string[]) => {
  return `
  async getById(id: string): Promise<EntityType> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('${originalQuery.replace('$1', '@id')}');
    if (result.recordset.length === 0) {
      throw new AppError('Entity not found', 404);
    }
    return this.mapEntityRow(result.recordset[0]);
  }`;
};

// Template for converting an INSERT query
export const convertInsertQuery = (tableName: string, fields: string[], entityType: string) => {
  const inputStatements = fields.map(field => 
    `request.input('${field}', sql.NVarChar(255), entity.${field});`
  ).join('\n    ');
  
  const valuesList = fields.map(field => `@${field}`).join(', ');
  
  return `
  async create${entityType}(entity: New${entityType}): Promise<${entityType}> {
    try {
      const request = getRequest();
      ${inputStatements}
      
      const result = await request.query(
        \`INSERT INTO ${tableName} (${fields.join(', ')}, created_at, updated_at)
         OUTPUT INSERTED.*
         VALUES (${valuesList}, GETDATE(), GETDATE())\`
      );
      return this.map${entityType}Row(result.recordset[0]);
    } catch (error: any) {
      if (error.number === 2627) {
        throw new AppError('${entityType} with this ID already exists', 409);
      }
      throw new AppError('Failed to create ${entityType.toLowerCase()}', 500);
    }
  }`;
};

// Template for converting an UPDATE query
export const convertUpdateQuery = (tableName: string, entityType: string) => {
  return `
  async update${entityType}(id: string, updates: Partial<New${entityType}>): Promise<${entityType}> {
    const setClause = [];
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);

    // Add dynamic field updates here based on the entity structure
    
    if (setClause.length === 0) {
      return this.get${entityType}ById(id);
    }

    setClause.push(\`updated_at = GETDATE()\`);

    const result = await request.query(
      \`UPDATE ${tableName} SET \${setClause.join(', ')} OUTPUT INSERTED.* WHERE id = @id\`
    );

    if (result.recordset.length === 0) {
      throw new AppError('${entityType} not found', 404);
    }

    return this.map${entityType}Row(result.recordset[0]);
  }`;
};

// Template for converting a DELETE query
export const convertDeleteQuery = (tableName: string, entityType: string) => {
  return `
  async delete${entityType}(id: string): Promise<void> {
    const request = getRequest();
    request.input('id', sql.NVarChar(255), id);
    const result = await request.query('DELETE FROM ${tableName} WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      throw new AppError('${entityType} not found', 404);
    }
  }`;
};

// Pagination query conversion
export const convertPaginationQuery = (baseQuery: string) => {
  return baseQuery.replace(/LIMIT \$(\d+) OFFSET \$(\d+)/, 'OFFSET @param$2 ROWS FETCH NEXT @param$1 ROWS ONLY');
};

// Count query conversion
export const convertCountQuery = (query: string) => {
  return query.replace(/COUNT\(\*\)/, 'COUNT(*) as count');
};

export default {
  conversionPatterns,
  convertSelectQuery,
  convertInsertQuery,
  convertUpdateQuery,
  convertDeleteQuery,
  convertPaginationQuery,
  convertCountQuery
};
