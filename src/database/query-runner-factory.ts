import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { IQueryRunnerFactory } from './query-runner-factory.interface';

@Injectable()
export class QueryRunnerFactory implements IQueryRunnerFactory {
  constructor(private readonly dataSource: DataSource) {}

  createQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }
}
