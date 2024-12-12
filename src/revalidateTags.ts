import { revalidateTag } from "next/cache";

export type RevalidatableTag =
  | "CRA"
  | `CRA:Intra:${string}`
  | `CRA:Membre:${string}:YearMonth:${string}`
  | `CRA:Membre:${string}`
  | `CRA:YearMonth:${string}`
  | `Intra:${string}`
  | `Membre:${string}`
  | `Membre`
  | `Startup:${string}`
  | `StartupIntra:${string}`;

declare module "next/cache" {
  export function revalidateTag(tag: RevalidatableTag): void;
}

// declare global {
//   interface NextFetchRequestConfig {
//     tags?: RevalidatableTag[] | string[];
//   }
// }

export function revalidateTags(...tags: RevalidatableTag[]): void {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}
