import { type Group, type TemplateMeta } from "../repo/IGitRepo";

export const validateTemplateMeta = (meta: Partial<TemplateMeta>): TemplateMeta => {
  const { author, lastEditor, description, variables } = meta;

  // TODO: validate variables when repo is clean

  return {
    author: author || "",
    lastEditor: lastEditor || "",
    description: description || "",
    variables: variables || {},
  };
};

// TODO: move to "model" folder

export const validateGroup = (group: Partial<Group>): Group => {
  const { id, name, description, templates, owners, membershipRules } = group;

  return {
    id: id || "",
    name: name || "",
    description: description || "",
    templates: templates || [],
    owners: owners || [],
    membershipRules: membershipRules || [],
  };
};
