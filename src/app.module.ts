import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import configService from "./config/typeormConfig.service";
import { UrlModule } from './url/url.module';
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";

// Take these sites as a reference for development.
// https://github.com/sufyan468/nest-js-authentication-and-authorization/blob/main/server/src/main.ts
// https://github.com/DenzelCode/nest-auth
// https://github.com/anilahir/nestjs-authentication-and-authorization
// https://medium.com/front-end-weekly/fast-project-start-with-nestjs-boilerplate-5b74af0a26f5

// https://github.com/manojsethi/nest_auth_demo_refresh_token
// https://github.com/chaksaray/NestJS-REST-API-Boilerplate-with-JWT-and-Mysql
// https://github.com/leoprananta/nestjs-typeorm-mysql

// https://github.com/dinushchathurya/nestjs-typeorm-bcrypt-jwt-authentication

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'fawwaz-api',
    //   entities: [UsersEntity],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
