import "server-only";

import { forbidden } from "next/navigation";
import { type Session } from "next-auth";

import { type Group } from "../model/Group";
import { auth } from "../next-auth/auth";
import { getServerService } from "../services";
import { UnexpectedSessionError } from "./error";

type AssertParam<T> = T | { check: T; message?: string };
type AssertSessionParams = {
  admin?: AssertParam<boolean>;
  groupMember?: AssertParam<Group>;
  groupOwner?: AssertParam<Group>;
  message?: string;
};

const defaultMessage = "Session non trouvée.";

/**
 * Assert that the current session is present and that the user is either owner of the document or staff.
 */
export const assertServerSession = async ({
  admin,
  message = defaultMessage,
  groupOwner,
  groupMember,
}: AssertSessionParams = {}): Promise<Session> => {
  const session = await auth();
  if (!session?.user) {
    throw new UnexpectedSessionError(message);
  }

  const espaceMembreService = await getServerService("espaceMembre");

  const shouldCheckStaff = typeof admin === "boolean" ? admin : admin?.check;
  const shouldCheckGroupOwner = groupOwner && "check" in groupOwner ? groupOwner?.check : groupOwner;
  const shouldCheckGroupMember = groupMember && "check" in groupMember ? groupMember?.check : groupMember;

  const { isMember, isOwner } =
    shouldCheckGroupOwner || shouldCheckGroupMember
      ? await espaceMembreService.getMemberMembership(session.user.username, groupOwner as Group)
      : { isMember: false, isOwner: false };

  if (shouldCheckGroupOwner && shouldCheckStaff) {
    if (!(isOwner || session.user.isAdmin)) {
      forbidden();
    }
  } else if (shouldCheckGroupOwner) {
    if (!isOwner) {
      forbidden();
    }
  } else if (shouldCheckGroupMember) {
    if (!isMember) {
      forbidden();
    }
  } else if (shouldCheckStaff) {
    if (!session.user.isAdmin) {
      forbidden();
    }
  }

  return session;
};
