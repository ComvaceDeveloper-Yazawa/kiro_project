import { buildApp } from "./app.js";
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
// 必須環境変数の検証（SECURITY-12）
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "DATABASE_URL"];
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        console.error(`環境変数 ${key} が設定されていません`);
        process.exit(1);
    }
}
const app = await buildApp();
try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server listening on http://${HOST}:${PORT}`);
}
catch (err) {
    app.log.error(err);
    process.exit(1);
}
//# sourceMappingURL=index.js.map