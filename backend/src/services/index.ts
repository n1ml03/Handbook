import { CharacterService, characterService } from './CharacterService';
import logger from '@config/logger';

export interface ServiceHealthStatus {
  serviceName: string;
  isHealthy: boolean;
  errors: string[];
}

export interface SystemHealthStatus {
  isHealthy: boolean;
  services: ServiceHealthStatus[];
  timestamp: string;
}

class ServiceRegistry {
  private services: Map<string, any> = new Map();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    this.services.set('character', characterService);
    
    // Add other services here as they are created
    // this.services.set('skill', skillService);
    // this.services.set('swimsuit', swimsuitService);
    // etc.
  }

  getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }
    return service as T;
  }

  async performHealthCheck(): Promise<SystemHealthStatus> {
    const serviceHealthStatuses: ServiceHealthStatus[] = [];
    let systemIsHealthy = true;

    for (const [serviceName, service] of this.services.entries()) {
      try {
        if (service.healthCheck && typeof service.healthCheck === 'function') {
          const healthStatus = await service.healthCheck();
          serviceHealthStatuses.push({
            serviceName,
            isHealthy: healthStatus.isHealthy,
            errors: healthStatus.errors || []
          });

          if (!healthStatus.isHealthy) {
            systemIsHealthy = false;
          }
        } else {
          serviceHealthStatuses.push({
            serviceName,
            isHealthy: true,
            errors: ['Health check not implemented']
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        serviceHealthStatuses.push({
          serviceName,
          isHealthy: false,
          errors: [errorMessage]
        });
        systemIsHealthy = false;
        logger.error(`Health check failed for service: ${serviceName}`, { error: errorMessage });
      }
    }

    return {
      isHealthy: systemIsHealthy,
      services: serviceHealthStatuses,
      timestamp: new Date().toISOString()
    };
  }

  async initialize(): Promise<void> {
    logger.info('Initializing services...');
    
    for (const [serviceName, service] of this.services.entries()) {
      try {
        if (service.initialize && typeof service.initialize === 'function') {
          await service.initialize();
          logger.info(`Service initialized: ${serviceName}`);
        }
      } catch (error) {
        logger.error(`Failed to initialize service: ${serviceName}`, { 
          error: error instanceof Error ? error.message : error 
        });
        throw error;
      }
    }
    
    logger.info('All services initialized successfully');
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down services...');
    
    for (const [serviceName, service] of this.services.entries()) {
      try {
        if (service.shutdown && typeof service.shutdown === 'function') {
          await service.shutdown();
          logger.info(`Service shut down: ${serviceName}`);
        }
      } catch (error) {
        logger.error(`Failed to shut down service: ${serviceName}`, { 
          error: error instanceof Error ? error.message : error 
        });
      }
    }
    
    logger.info('All services shut down');
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry();

// Export individual services for direct access
export { characterService };
export type { CharacterService };

// Export the service registry as default
export default serviceRegistry; 