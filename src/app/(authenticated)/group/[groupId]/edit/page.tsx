import { notFound } from "next/navigation";

import { Container } from "@/dsfr";
import { gitRepo } from "@/lib/repo";
import { type NextServerPageProps } from "@/utils/next";

import { GroupForm } from "../../Form";

interface Params {
  groupId: string;
}

const EditGroupPage = async ({ params }: NextServerPageProps<Params>) => {
  const { groupId } = await params;

  const group = await gitRepo.getGroup(groupId);

  if (!group) {
    notFound();
  }

  return (
    <Container my="4w">
      <h1>Modifier le groupe {group.name}</h1>
      <GroupForm editGroup={group} />
    </Container>
  );
};

export default EditGroupPage;
