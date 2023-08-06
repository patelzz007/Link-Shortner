import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { join } from "path";
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.env.DB_HOST ? this.env.DB_HOST : "localhost",
      port: this.env.DB_PORT ? Number(this.env.DB_PORT) : 3306,
      username: this.env.DB_USERNAME ? this.env.DB_USERNAME : "root",
      password: this.env.DB_PASSWORD ? this.env.DB_PASSWORD : "",
      database: this.env.DB_NAME ? this.env.DB_NAME : "link_shortner",
      logging: false,
      entities: [join(__dirname, "../", "**", "*.entity.{ts,js}")],
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env);

console.log("What is in this Config Service", configService.getTypeOrmConfig());

export default configService;
