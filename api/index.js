// Vercel Serverless Function entry point
// This file imports and re-exports the compiled backend API handler
import handler from '../packages/backend/dist/api/index.js';
export default handler;
