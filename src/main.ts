import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { loggerMiddleware } from "./common/middleware/logger.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(loggerMiddleware); // 👈 AQUI

  app.enableCors();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Empleabilidad API")
    .setDescription("API para gestión de vacantes, usuarios y postulaciones")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(Number(port));

  console.log(`🚀 API running on http://localhost:${port}/api`);
}
bootstrap();
