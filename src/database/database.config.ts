import { join } from "path";
import configService from "src/config/typeormConfig.service";
import { DataSource, DataSourceOptions } from "typeorm";

console.log("123123", configService.getTypeOrmConfig());

export const getDatabaseDataSourceOptions = ({
  port,
  host,
  username,
  database,
  password,
}): DataSourceOptions => {
  return {
    type: "mysql",
    port,
    host,
    username,
    database,
    password: password,
    entities: [join(__dirname, "../", "**", "*.entity.{ts,js}")],
  };
};

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: "mysql",
//   host: "127.0.0.1",
//   port: 3306,
//   username: "root",
//   password: "password",
//   database: "link_shortner",
//   entities: [join(__dirname, "../", "**", "*.entity.{ts,js}")],
//   synchronize: true,
// };

// console.log("Type ORM Config :", typeOrmConfig);

// This is used by TypeORM migration scripts
export const DatabaseSource = new DataSource({
  ...getDatabaseDataSourceOptions(configService.getTypeOrmConfig() as any),
});
