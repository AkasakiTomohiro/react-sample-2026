import type { ErrorResponse } from "../Result";

export type InternalError = ErrorResponse<"INTERNAL_ERROR">;
export const InternalErrorResponse: InternalError = {
    success: false,
    error: "INTERNAL_ERROR"
} as const;
