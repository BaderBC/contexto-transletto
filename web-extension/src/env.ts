// We cannot use destructurisation here, because we use
// rollup-plugin-define to replace all "process[dot]env" with the actual environments. 
// @ts-ignore
const env: Env = process.env;
export default env;

export const {
  BACKEND_URL,
  GOOGLE_OAUTH_CLIENT_ID,
} = env;

export interface Env {
  BACKEND_URL: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
}
