import { cleanEnv, str, email, json } from 'envalid';
import * as dotenv from 'dotenv'

dotenv.config();

export const settings = cleanEnv(process.env, {
  DB_NAME: str(),
  CLUSTER_NODES_URLS: json()
});