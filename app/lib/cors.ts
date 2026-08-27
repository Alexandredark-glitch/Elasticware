export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsResponse(data: object, status = 200, extraHeaders?: Headers) {
  const headers = new Headers(CORS_HEADERS);
  extraHeaders?.forEach((value, key) => headers.append(key, value));
  return Response.json(data, { status, headers });
}

export function corsPreflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}