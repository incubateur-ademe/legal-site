import { unauthorized } from "next/navigation";

import { Container } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";

import { GitManagement } from "./GitManagement";

const AdminPage = async () => {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    unauthorized();
  }

  return (
    <Container my="4w">
      <h1>Admin</h1>
      <GitManagement />
    </Container>
  );
};

export default AdminPage;
