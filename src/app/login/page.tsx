import { config } from "@/config";
import { Box, Container, Grid, GridCol } from "@/dsfr";

import style from "./login.module.scss";
import { LoginForm } from "./LoginForm";

const LoginPage = () => (
  <Container ptmd="14v" mbmd="14v" fluid>
    <Grid haveGutters align="center">
      <GridCol md={8} lg={6}>
        <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
          <Grid haveGutters align="center">
            <GridCol md={9} lg={8}>
              <h1>Connexion {config.name}</h1>
              <Box>
                <LoginForm />
              </Box>
            </GridCol>
          </Grid>
        </Container>
      </GridCol>
    </Grid>
  </Container>
);

export default LoginPage;
