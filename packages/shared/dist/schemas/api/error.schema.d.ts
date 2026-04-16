import { z } from "zod";
export declare const ErrorCodeSchema: z.ZodEnum<["VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED", "FORBIDDEN", "CONFLICT", "INTERNAL_SERVER_ERROR"]>;
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
//# sourceMappingURL=error.schema.d.ts.map