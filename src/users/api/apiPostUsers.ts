import { z } from "zod";

import {
  jsonRequest,
  type JsonRequestResponse,
} from "../lib/jsonRequest";
import {
  type FetchFunctionProps,
} from "../lib/withTokenRequest";

export type PostUsersProps = FetchFunctionProps<{
  username: string;
}>;

export const ResponseSchema = z
  .object({
    status: z.literal(200),
    body: z.object({
      message: z.literal("OK")
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

export type PostUsersResponse = JsonRequestResponse<typeof ResponseSchema>;

export async function apiPostUsers(
  props: PostUsersProps,
): Promise<PostUsersResponse> {
  return jsonRequest({
    path: `/api/users`,
    fetchOptions: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.authenticationToken}`,
      },
      signal: props.abortSignal,
      body: JSON.stringify(props.body),
    },
    validator: ResponseSchema,
  });
}
