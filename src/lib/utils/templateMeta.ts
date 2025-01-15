import { type Group } from "../model/Group";
import { type TemplateMeta } from "../model/Template";
import { type Variable } from "../model/Variable";

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

export const validateVariable = (variable: Partial<Variable>): Variable => {
  const { author, lastEditor, description, variables, sha, group, gitProviderUrl, path, url } = variable;

  return {
    author: author || "",
    lastEditor: lastEditor || "",
    description: description || "",
    variables: variables || {},
    sha: sha || "",
    group: group || "",
    gitProviderUrl: gitProviderUrl || "",
    path: path || "",
    url: url || "",
  };
};
