"use client";

import { type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { ClientOnly } from "./ClientOnly";

/**
 * Render a component in the body of the document via a portal and only on the client side.
 */
export const ClientBodyPortal = ({ children }: PropsWithChildren) => {
  return <ClientOnly>{createPortal(children as never, document.body)}</ClientOnly>;
};
