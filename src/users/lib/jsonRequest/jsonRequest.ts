import { fetchWrapper, type FetchWrapperProps } from "../fetchWrapper";
import { InternalErrorResponse } from "../internalError";
import type { ErrorResponse, ApiResponse } from "../Result";
import { z } from "zod";

export type JsonRequestProps<TValidator extends z.ZodTypeAny> = Required<FetchWrapperProps> & {
    validator: TValidator
}

export type JsonRequestResponseData<TValidator extends z.ZodTypeAny> = {
    status: number
    body: z.infer<TValidator>
}
export type JsonRequestResponse<TValidator extends z.ZodTypeAny> = ApiResponse<JsonRequestResponseData<TValidator>, "FETCH_ERROR" | "RESPONSE_ERROR" | "INTERNAL_ERROR">;

export async function jsonRequest<TValidator extends z.ZodTypeAny>(props: JsonRequestProps<TValidator>): Promise<JsonRequestResponse<TValidator>> {
    try {
        const response = await fetchWrapper({
            path: props.path,
            fetchOptions: {
                ...props.fetchOptions,
                headers: {
                    ...props.fetchOptions?.headers,
                    'Content-Type': 'application/json'
                },
            }
        });
        if (response.success === false) {
            return response;
        }

        try {
            const json = await response.data.json();
            const parsed = props.validator.parse({
                status: response.data.status,
                body: json,
            });
            return {
                success: true,
                data: parsed
            };
        } catch (error) {
            return ResponseErrorResponse;
        }
    } catch (error) {
        return InternalErrorResponse;
    }
}

export type ResponseErrorResponse = ErrorResponse<"RESPONSE_ERROR">;
export const ResponseErrorResponse: ResponseErrorResponse = {
    success: false,
    error: "RESPONSE_ERROR"
};

