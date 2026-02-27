import { Pool } from 'pg';
import { env } from './env';
import logger from '../utils/logger';

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

pool.on('connect', () => logger.info('Database connected'));
pool.on('error', (err) => logger.error('Database error', err));