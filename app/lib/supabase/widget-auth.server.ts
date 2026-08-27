const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "SUPABASE_JWT_SECRET is required. Find it in Supabase Dashboard → Project Settings → API → JWT Settings → JWT Secret."
  );
}


export async function signWidgetToken(payload: {
  sub: string;       
  org_id: string;
}): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    role: "authenticated",
    iat: now,
    exp: now + 3600,       
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const bodyB64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  const signingInput = `${headerB64}.${bodyB64}`;

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signingInput)
  );

  const signatureB64 = Buffer.from(signature).toString("base64url");

  return `${headerB64}.${bodyB64}.${signatureB64}`;
}