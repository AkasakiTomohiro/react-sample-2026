import { FetchErrorResponse } from "../fetchWrapper";
import type { ApiResponse, ErrorResponse } from "../Result";

export type WithTokenRequestProps<TRequestData, TResponse, TErrorCode extends FetchErrorCode> = {
    fetchFunction: FetchFunction<TRequestData, TResponse, TErrorCode>
    body: TRequestData
    abortController: AbortController
    requestTimeout?: number
}

export type WithTokenResponse<TResponse, TErrorCode extends string> =
    Awaited<ReturnType<FetchFunction<any, TResponse, TErrorCode>>> | ApiResponse<TResponse, FetchErrorCode>;

export async function withTokenRequest<TRequestData, TResponse, TErrorCode extends FetchErrorCode>({
    fetchFunction,
    body,
    abortController,
    requestTimeout = RequestTimeout
}: WithTokenRequestProps<TRequestData, TResponse, TErrorCode>): Promise<WithTokenResponse<TResponse, TErrorCode>> {
    
    try {
        let response: WithTokenResponse<TResponse, TErrorCode> = FetchErrorResponse;
        let authenticationToken = "your-authentication";
        for(let i = 0; i < 2; i++) {
            const request = fetchFunction({ authenticationToken, abortSignal: abortController.signal, body });
            response = await Promise.race([
                request,
                new Promise<WithTokenResponse<TResponse, TErrorCode>>((resolve) => setTimeout(() => resolve(RequestTimeoutResponse), requestTimeout))
            ]);

            if(response.success || response.error !== "UNAUTHORIZED") {
                break;
            }
            // TODO: Implement token refresh logic here if needed
            authenticationToken = "your-new-authentication";
        }
        return response;
    } catch(error) {
        return FetchErrorResponse;
    }
}

export const RequestTimeout = 5000;

export type RequestTimeoutResponse = ErrorResponse<"REQUEST_TIMEOUT">;
export const RequestTimeoutResponse: RequestTimeoutResponse = {
    success: false,
    error: "REQUEST_TIMEOUT"
};

export type UnAuthorizedResponse = ErrorResponse<"UNAUTHORIZED">;
export const UnAuthorizedResponse: UnAuthorizedResponse = {
    success: false,
    error: "UNAUTHORIZED"
};

export type FetchFunctionProps<TRequestData = never> = {
    authenticationToken: string
    abortSignal: AbortSignal
    body: TRequestData
}
export type FetchErrorCode = "UNAUTHORIZED" | "REQUEST_TIMEOUT" | "FETCH_ERROR" | (string & {});
export type FetchFunction<TRequestData, TResponse, TErrorCode extends FetchErrorCode> = 
    (props: FetchFunctionProps<TRequestData>) => Promise<ApiResponse<TResponse, TErrorCode>>;