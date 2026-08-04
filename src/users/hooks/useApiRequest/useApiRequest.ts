import { useEffect, useState } from "react"
import { withTokenRequest, type FetchFunction } from "../../lib/callFetch"
import type { ApiResponse } from "../../lib/Result"
import type { WithTokenResponse } from "../../lib/callFetch"

export type UseApiRequestProps<TRequestData, TResponse extends ApiResponse<TData, TError>, TData, TError extends string> = {
    fetchFunction: FetchFunction<TRequestData, TResponse, TData, TError>
}

export type UseApiRequestReturn<TRequestData, TResponse extends ApiResponse<TData, TError>, TData, TError extends string> = {
    response: WithTokenResponse<TResponse, TData, TError> | null
    isPending: boolean
    callApi: (props: [TRequestData] extends [never] ? { body?: TRequestData } : { body: TRequestData }) => Promise<void>
}

export function useApiRequest<TRequestData, TResponse extends ApiResponse<TData, TError>, TData, TError extends string>({
    fetchFunction
}: UseApiRequestProps<TRequestData, TResponse, TData, TError>): UseApiRequestReturn<TRequestData, TResponse, TData, TError> {
    const [newAbortController, setAbortController] = useState<AbortController | undefined>();
    const [response, setResponse] = useState<TResponse | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const callApi = async (props: [TRequestData] extends [never] ? { body?: TRequestData } : { body: TRequestData }) => {
        const { body } = props;
        setIsPending(true);
        const newAbortController = new AbortController();
        setAbortController(newAbortController);
        try {
            const result = await withTokenRequest({
                fetchFunction,
                body: body as TRequestData,
                abortController: newAbortController
            })
            setResponse(result as TResponse);
        } catch (error) {
            setResponse(null);
            newAbortController.abort();
        } finally {
            setIsPending(false);
            setAbortController(undefined);
        }
    }

    useEffect(() => {
        return () => {
            if (newAbortController) {
                newAbortController.abort();
            }
        }
    }, [newAbortController]);

    return { response, isPending, callApi };
}

export type GetApiRequestResponseType<TFetch> = TFetch extends FetchFunction<any, infer TResponse, infer TData, infer TError> ? WithTokenResponse<TResponse, TData, TError> : never;
