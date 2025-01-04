import { type TemplateMeta } from "../repo/IGitRepo";

export const validateTemplateMeta = (meta: Partial<TemplateMeta>): TemplateMeta => {
  const { author, lastEditor, description, variables } = meta;

  // TODO: validate variables

  return {
    author: author || "",
    lastEditor: lastEditor || "",
    description: description || "",
    variables: variables || {},
  };
};
