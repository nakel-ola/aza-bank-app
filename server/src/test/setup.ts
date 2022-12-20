import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { registerUser } from "./../modules/user/test/subs/user.sub";
import { UserService } from "./../modules/user/user.service";

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const userService = moduleRef.get<UserService>(UserService);
  await userService.register(registerUser);

  await app.close();
};
