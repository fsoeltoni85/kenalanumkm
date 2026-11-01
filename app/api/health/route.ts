export function GET() {
  return Response.json({ status: "ok", app: "kenalanumkm" }, { headers: { "cache-control": "no-store" } });
}
