import { isBrowser } from "@/utils/browser";
import { illogical } from "@/utils/error";

import { getInstanceFn } from "./getInstance";
import { MdxService } from "./MdxService";
import { EspaceMembreService } from "./server/EspaceMembreService";

const isomorphicServices = {
  mdx: MdxService,
} as const;
export const getService = getInstanceFn(isomorphicServices);

export const getServerService = getInstanceFn(
  {
    ...isomorphicServices,
    espaceMembre: EspaceMembreService,
  } as const,
  () => isBrowser && illogical("Should not be called on the client side"),
);
