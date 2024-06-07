// TODO: move to .env
export const CLIENT_ID = '815018817472-leqk8eelj2jeeia64edpqcn07rjnn7qh.apps.googleusercontent.com';
export const BACKEND_URL = 'http://localhost:3000';

async function _sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Sleep {
  export function ms(milliseconds: number) {
    return _sleep(milliseconds);
  }
  
  export function sec(seconds: number) {
    return _sleep(seconds * 1000);
  }
}
