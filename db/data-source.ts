import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: 'root',
  password: '1234',
  database: 'SimpleEnglishCenter',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
