import { z } from "zod"
import { FetchErrorResponse, type FetchFunctionProps } from "../lib/callFetch"

export type GetUsersProps = FetchFunctionProps

export const ResponseSchema = z
  .object({
    status: z.literal(200),
    body: z.object({
       users: z.array(z.object({
            id: z.number(),
            name: z.string()
        }))
    })
  })
  .or(
    z.object({
      status: z.literal(400),
      body: z.object({
        message: z.enum(["BAD_REQUEST"]),
      }),
    }),
  ).or(
    z.object({
      status: z.literal(401),
      body: z.object({
        message: z.enum(["UNAUTHORIZED"]),
      }),
    }),
  ).or(
    z.object({
      status: z.literal(500),
      body: z.object({
        message: z.enum(["SERVER_ERROR"]),
      }),
    }),
  );

export type GetUsersResponse = z.infer<typeof ResponseSchema> | typeof FetchErrorResponse;

export async function apiGetUsers(props: GetUsersProps): Promise<GetUsersResponse> {
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.authenticationToken}`
            },
            signal: props.abortSignal
        })
        const body = await response.json();
        return ResponseSchema.parse({
            status: response.status,
            body: body
        })
    } catch (error) {
        return FetchErrorResponse
    }
}