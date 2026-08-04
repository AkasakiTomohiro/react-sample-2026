
export type SuccessResponse<TData> = TData extends undefined ? {
    success: true
    data?: undefined
} : SuccessResponseWithData<TData>;
export type SuccessResponseWithData<TData> = {
    success: true
    data: TData
}

export type ErrorResponse<TError extends string> = TError extends string ? {
    success: false
    error: TError
} : never

export type ApiResponse<TData, TError extends string> = SuccessResponse<TData> | ErrorResponse<TError>;
