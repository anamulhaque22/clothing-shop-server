import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async checkHealth() {
    const dbStatus = await this.checkDatabase();
    return {
      status: dbStatus ? 'ok' : 'error',
      services: {
        database: dbStatus ? 'connected' : 'disconnected',
      },
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
}
