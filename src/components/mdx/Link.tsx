import NextLink from "next/link";
import { type JSX } from "react";

export const MdxLink = (props: JSX.IntrinsicElements["a"]) => {
  if (typeof props.href === "undefined") {
    return null;
  }
  const href = props.href;
  const isInternalLink = href.startsWith("/");

  if (isInternalLink) {
    return <NextLink href={href as never}>{props.children}</NextLink>;
  }

  return (
    <a {...props} target="_blank" rel="nofollow noopener noreferrer">
      {props.children}
    </a>
  );
};
