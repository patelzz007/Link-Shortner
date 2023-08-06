import configService from "src/config/typeormConfig.service";
import { DataSource } from "typeorm";
import { getDatabaseDataSourceOptions } from "./database.config";

console.log("456456", configService.getTypeOrmConfig());

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource({
        ...getDatabaseDataSourceOptions(
          configService.getTypeOrmConfig() as any,
        ),
      });

      return dataSource.initialize();
    },
  },
];
