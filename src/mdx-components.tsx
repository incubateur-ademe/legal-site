import { type MDXComponents } from "mdx/types";
import { Fragment, type PropsWithChildren } from "react";

import { MdxLink } from "@/components/mdx/Link";
import { getLabelFromChildren } from "@/utils/react";
import { slugify } from "@/utils/string";

import { AnchorLink } from "./dsfr/client";

export const anchorHeadingMDXComponents: MDXComponents = {
  h1: (props: PropsWithChildren) => (
    <AnchorLink as="h1" anchor={slugify(getLabelFromChildren(props.children))} {...props} />
  ),
  h2: (props: PropsWithChildren) => (
    <AnchorLink as="h2" anchor={slugify(getLabelFromChildren(props.children))} {...props} />
  ),
  h3: (props: PropsWithChildren) => (
    <AnchorLink as="h3" anchor={slugify(getLabelFromChildren(props.children))} {...props} />
  ),
};

/**
 * Avoid unauthorized HTML tags inside p tags. (e.g. no p inside p, no div inside p, etc.)
 */
export const paragraphContentMDXComponents: MDXComponents = {
  p: Fragment,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MdxLink,
  };
}
