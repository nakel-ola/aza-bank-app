import { DatabaseService } from './../modules/database/database.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const databaseService = moduleRef.get<DatabaseService>(DatabaseService);
  await databaseService.getDbHandle().dropDatabase();

  await app.close();
};