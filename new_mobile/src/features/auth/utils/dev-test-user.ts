// Dev-only. Generates a fresh, unique Tanzanian phone number so the bypass
// button always registers a brand-new REAL account through the REAL
// /auth/register/ endpoint — real token, real SecureStore write, real /me
// validation afterwards. There is no parallel fake-session code path
// anywhere else in the app; a dev user is indistinguishable from a real one
// once created.
export function generateDevTestIdentity() {
  const uniqueSuffix = Date.now().toString().slice(-9).padStart(9, '0');
  return {
    phoneNumber: `+255${uniqueSuffix}`,
    fullName: 'Falcon Rider Test User',
  };
}
