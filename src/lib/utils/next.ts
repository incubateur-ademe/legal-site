import { type EmptyObject, type Nothing } from "./types";

/**
 * Wrap Next.js server action response to avoid bubbling up errors
 */
export type ServerActionResponse<TData = void, TError = string> =
  | { error: TError; ok: false }
  | ((TData extends Nothing ? EmptyObject : { data: TData }) & {
      ok: true;
    });
