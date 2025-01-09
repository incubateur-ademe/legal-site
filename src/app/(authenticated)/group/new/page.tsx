import { Container } from "@/dsfr";

import { GroupForm } from "../Form";

const NewGroupPage = () => {
  return (
    <Container my="4w">
      <h1>Créer un nouveau groupe</h1>
      <GroupForm />
    </Container>
  );
};

export default NewGroupPage;
