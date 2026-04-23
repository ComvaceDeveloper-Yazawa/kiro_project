export default function handler(req, res) {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
    });
}
//# sourceMappingURL=health.js.map