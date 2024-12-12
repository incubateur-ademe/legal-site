import { fr } from "@codegouvfr/react-dsfr";

import { ClipLoader } from "@/components/ReactSpinners";
import { Container } from "@/dsfr";

const DefaultLoading = () => {
  return (
    <Container className="flex-1 flex items-center justify-center h-full my-10">
      <ClipLoader color={fr.colors.decisions.text.default.grey.default} size="4em" />
    </Container>
  );
};

export default DefaultLoading;
