import { type TemplateMeta } from "../repo/IGitRepo";

export const validateTemplateMeta = (meta: Partial<TemplateMeta>): TemplateMeta => {
  const { author, description, variables } = meta;

  return {
    author: author || "",
    description: description || "",
    variables: variables || {},
  };
};
