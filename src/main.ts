// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const config = new DocumentBuilder()
//     .setTitle("Ecommerce API Documentation")
//     .setDescription("The Ecommerce API description")
//     .setVersion("1.0")
//     .addTag("Ecommerce")
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   // SwaggerModule setup (see https://docs.nestjs.com/recipes/swagger)
//   SwaggerModule.setup("api", app, document);

//   // Global Guards (see https://docs.nestjs.com/guards#global-guards)
//   const reflector = app.get(Reflector);
//   app.useGlobalGuards(new RolesGuard(reflector));

//   // app starts listening on port 3009
//   await app.listen(3009);
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || "http://143.198.211.41",
      "http://localhost:4200",
    ],
    credentials: true, // if needed
  });
  // for validation to work globally no need to put validate pipe each controller method
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle("API Explorer")
    .setDescription("Fawwaz-api description")
    .setVersion("3.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  await app.listen(3009);
}
bootstrap();
