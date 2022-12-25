import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// import * as graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { AppModule } from "./app.module";
import { graphqlUploadExpress } from "graphql-upload-minimal";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1024 * 1024, maxFiles: 1 }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ allowedHeaders: "*", origin: "*" });
  await app.listen(process.env.PORT || 3333, "0.0.0.0", async () => {
    console.log(`Server listerning on port: ${await app.getUrl()}/graphql`);
  });
}

bootstrap()