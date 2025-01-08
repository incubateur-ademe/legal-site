import { type Group } from "../model/Group";
import { type TemplateMeta } from "../model/Template";

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
    membershipRules: validateGroupRule(membershipRules || []),
  };
};

const validateGroupRule = (rules: Group["membershipRules"]): Group["membershipRules"] => {
  return rules.map(rule => {
    return {
      rule: rule.rule || "",
      ...(rule.ttlStart && { ttlStart: new Date(rule.ttlStart) }),
      ...(rule.ttlEnd && { ttlEnd: new Date(rule.ttlEnd) }),
    };
  });
};
