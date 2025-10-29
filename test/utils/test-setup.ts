import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { testConfig } from "../config/test.confing";
import { ConfigService } from "@nestjs/config";
import { DataSource } from 'typeorm';

export class TestSetup {

    app: INestApplication;

    dataSource: DataSource;

    static async create(module: any) {
        const instance = new TestSetup();
        await instance.init(module);
        return instance;
    }

    public async init(module: any) {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [module]
        })
            .overrideProvider(ConfigService)
            .useValue({
                get: (key: string) => {
                    if (key.includes('database')) return testConfig.database;
                    if (key.includes('app')) return testConfig.app;
                    if (key.includes('auth')) return testConfig.auth;
                    return null;
                }
            })
            .compile();

        
        this.app = moduleFixture.createNestApplication();

        this.app.useGlobalPipes(
            new ValidationPipe({
              transform: true,
              whitelist: true,
            }),
          );

        this.dataSource = moduleFixture.get(DataSource);

        await this.app.init();

    }

    async cleanup() {
        const entities = this.dataSource.entityMetadatas;

        const tableNames = entities
            .map((entity) => `"${entity.tableName}"`)
            .join(', ');

        await this.dataSource.query(
            `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
        );
    }

    async teardown() {
        await this.dataSource.destroy();
        await this.app.close();
    }

}