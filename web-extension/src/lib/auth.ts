// TODO: move to .env
const CLIENT_ID = '815018817472-leqk8eelj2jeeia64edpqcn07rjnn7qh.apps.googleusercontent.com';
const BACKEND_URL = 'http://localhost:3000';

export interface LoginResponse {
  token: string;
  token_payload: {
    email: string;
  };
}

export async function login(): Promise<LoginResponse> {
  const redirectURL = browser.identity.getRedirectURL();

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectURL)}&scope=email`,
    interactive: true,
  });
  const params = new URLSearchParams(responseUrl.split('#')[1]);

  const backendRes = await fetch(`${BACKEND_URL}/google-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: params.get('access_token'),
    }),
  });

  if (!backendRes.ok) {
    const err_msg = await backendRes.text().catch(() => '');
    throw new Error('Failed to login: \n' + err_msg);
  }
  const body_json: LoginResponse = await backendRes.json();

  await browser.storage.local.set({
    'jwt-token': body_json?.token,
  });

  return body_json;
}

export async function logout() {
  await browser.storage.local.remove('jwt-token');
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await browser.storage.local.get('jwt-token');
  return token['jwt-token']?.length > 0;
}
