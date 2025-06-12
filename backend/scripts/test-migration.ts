#!/usr/bin/env bun
/**
 * SQL Server Migration Test Script
 * 
 * This script tests the database connection and basic operations
 * to verify the migration was successful.
 */

import { config } from 'dotenv';
config();

import logger from '../config/logger';
import { testConnection, initializePool } from '../config/database';
import databaseService from '../services/DatabaseService';

interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

class MigrationTester {
  private results: TestResult[] = [];

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        test: testName,
        passed: true,
        duration: Date.now() - startTime
      });
      console.log(`✅ ${testName} - PASSED (${Date.now() - startTime}ms)`);
    } catch (error) {
      this.results.push({
        test: testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      });
      console.log(`❌ ${testName} - FAILED: ${error}`);
    }
  }

  async testDatabaseConnection(): Promise<void> {
    await this.runTest('Database Connection', async () => {
      await initializePool();
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection test failed');
      }
    });
  }

  async testDatabaseServiceInitialization(): Promise<void> {
    await this.runTest('Database Service Initialization', async () => {
      await databaseService.initialize();
    });
  }

  async testHealthCheck(): Promise<void> {
    await this.runTest('Health Check', async () => {
      const health = await databaseService.healthCheck();
      if (!health.isHealthy) {
        throw new Error(`Health check failed: ${health.errors.join(', ')}`);
      }
    });
  }

  async testCharacterOperations(): Promise<void> {
    await this.runTest('Character CRUD Operations', async () => {
      // Test create
      const testCharacter = {
        id: 'test_character_' + Date.now(),
        name: 'Test Character',
        nameJp: 'テストキャラクター',
        nameEn: 'Test Character',
        nameZh: '测试角色'
      };

      const created = await databaseService.createCharacter(testCharacter);
      if (!created || created.id !== testCharacter.id) {
        throw new Error('Character creation failed');
      }

      // Test read
      const retrieved = await databaseService.getCharacterById(testCharacter.id);
      if (!retrieved || retrieved.name !== testCharacter.name) {
        throw new Error('Character retrieval failed');
      }

      // Test update
      const updated = await databaseService.updateCharacter(testCharacter.id, {
        name: 'Updated Test Character'
      });
      if (!updated || updated.name !== 'Updated Test Character') {
        throw new Error('Character update failed');
      }

      // Test delete
      await databaseService.deleteCharacter(testCharacter.id);
      
      // Verify deletion
      try {
        await databaseService.getCharacterById(testCharacter.id);
        throw new Error('Character should have been deleted');
      } catch (error: any) {
        if (!error.message.includes('not found')) {
          throw error;
        }
      }
    });
  }

  async testSkillOperations(): Promise<void> {
    await this.runTest('Skill CRUD Operations', async () => {
      const testSkill = {
        id: 'test_skill_' + Date.now(),
        name: 'Test Skill',
        type: 'offensive' as const,
        description: 'A test skill',
        icon: 'test-icon'
      };

      // Test create
      const created = await databaseService.createSkill(testSkill);
      if (!created || created.id !== testSkill.id) {
        throw new Error('Skill creation failed');
      }

      // Test read
      const retrieved = await databaseService.getSkillById(testSkill.id);
      if (!retrieved || retrieved.name !== testSkill.name) {
        throw new Error('Skill retrieval failed');
      }

      // Test delete
      await databaseService.deleteSkill(testSkill.id);
    });
  }

  async testPagination(): Promise<void> {
    await this.runTest('Pagination', async () => {
      const result = await databaseService.getCharacters({
        page: 1,
        limit: 5,
        sortBy: 'name',
        sortOrder: 'asc'
      });

      if (!result.pagination) {
        throw new Error('Pagination object missing');
      }

      if (typeof result.pagination.page !== 'number' ||
          typeof result.pagination.limit !== 'number' ||
          typeof result.pagination.total !== 'number') {
        throw new Error('Invalid pagination structure');
      }
    });
  }

  async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling', async () => {
      // Test duplicate key error
      const testCharacter = {
        id: 'duplicate_test',
        name: 'Duplicate Test',
        nameJp: 'テスト',
        nameEn: 'Test',
        nameZh: '测试'
      };

      await databaseService.createCharacter(testCharacter);
      
      try {
        await databaseService.createCharacter(testCharacter);
        throw new Error('Should have thrown duplicate key error');
      } catch (error: any) {
        if (!error.message.includes('already exists')) {
          throw new Error('Wrong error type for duplicate key');
        }
      }

      // Cleanup
      await databaseService.deleteCharacter(testCharacter.id);

      // Test not found error
      try {
        await databaseService.getCharacterById('non_existent_id');
        throw new Error('Should have thrown not found error');
      } catch (error: any) {
        if (!error.message.includes('not found')) {
          throw new Error('Wrong error type for not found');
        }
      }
    });
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting SQL Server Migration Tests...\n');

    await this.testDatabaseConnection();
    await this.testDatabaseServiceInitialization();
    await this.testHealthCheck();
    await this.testCharacterOperations();
    await this.testSkillOperations();
    await this.testPagination();
    await this.testErrorHandling();

    this.printSummary();
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalTime = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);

    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  - ${r.test}: ${r.error}`);
        });
    }

    if (failed === 0) {
      console.log('\n🎉 All tests passed! Migration appears successful.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.');
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.main) {
  const tester = new MigrationTester();
  tester.runAllTests()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export default MigrationTester;
