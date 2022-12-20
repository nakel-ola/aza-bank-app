import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Connection } from "mongoose";
import { AppModule } from "../app.module";
import { DatabaseService } from "../modules/database/database.service";
import { testUser } from "../modules/user/test/subs/user.sub";
import { UserService } from "../modules/user/user.service";

export class TestManager {
  public httpServer: any;

  private app: INestApplication;
  private accessToken: string;
  private connection: Connection;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();

    this.httpServer = this.app.get<UserService>(UserService);

    const userService = this.app.get<UserService>(UserService);

    this.connection = moduleRef.get(DatabaseService).getDbHandle();

    const tokens = await userService.login({
      ...testUser,
    });

    this.accessToken = tokens.access_token
  }

  async afterAll() {
    await this.app.close();
  }

  getCollection(collectionName: string) {
    return this.connection.collection(collectionName);
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
