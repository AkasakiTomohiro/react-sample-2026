import type { ApiResponse, ErrorResponse } from "../Result";

export type FetchWrapperProps = {
    path: string | URL
    fetchOptions?: RequestInit
}
export type FetchWrapperResponse = ApiResponse<Response, "FETCH_ERROR">;

export async function fetchWrapper(props: FetchWrapperProps): Promise<FetchWrapperResponse> {
    try {
        const response = await fetch(props.path, props.fetchOptions);
        return { success: true, data: response };
    } catch (error) {
        return FetchErrorResponse
    }
}

export type FetchErrorResponse = ErrorResponse<"FETCH_ERROR">;
export const FetchErrorResponse: FetchErrorResponse = {
    success: false,
    error: "FETCH_ERROR"
};
