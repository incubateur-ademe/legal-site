import "server-only";

import { forbidden } from "next/navigation";
import { type Session } from "next-auth";

import { auth } from "../next-auth/auth";
import { UnexpectedSessionError } from "./error";

type AssertParam<T> = T | { check: T; message?: string };
type AssertSessionParams = {
  admin?: AssertParam<boolean>;
  message?: string;
  owner?: AssertParam<string>;
};

const defaultMessage = "Session non trouvée.";

/**
 * Assert that the current session is present and that the user is either owner of the document or staff.
 */
export const assertServerSession = async ({
  admin,
  message = defaultMessage,
  owner,
}: AssertSessionParams = {}): Promise<Session> => {
  const session = await auth();
  if (!session?.user) {
    throw new UnexpectedSessionError(message);
  }

  const shouldCheckOwner = typeof owner === "string" || owner?.check;
  const shouldCheckStaff = typeof admin === "boolean" ? admin : admin?.check;
  const isOwner = session.user.username === shouldCheckOwner;

  if (shouldCheckOwner && shouldCheckStaff) {
    if (!(isOwner || session.user.isAdmin)) {
      forbidden();
    }
  } else if (shouldCheckOwner) {
    if (!isOwner) {
      forbidden();
    }
  } else if (shouldCheckStaff) {
    if (!session.user.isAdmin) {
      forbidden();
    }
  }

  return session;
};
