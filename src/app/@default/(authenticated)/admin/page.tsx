import { unauthorized } from "next/navigation";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { Container } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";

import { GitManagement } from "./GitManagement";
import { RedisManagement } from "./RedisManagement";

const AdminPage = async () => {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    unauthorized();
  }

  return (
    <Container my="4w">
      <h1>Admin</h1>
      <ClientOnly>
        <GitManagement />
        <RedisManagement />
      </ClientOnly>
    </Container>
  );
};

export default AdminPage;
