import { Container, type ContainerProps } from "./Container";
import { Grid, GridCol } from "./Grid";

export const CenteredContainer = ({ children, ...rest }: ContainerProps) => (
  <Container {...rest}>
    <Grid align="center">
      <GridCol md={10} lg={8}>
        {children}
      </GridCol>
    </Grid>
  </Container>
);
