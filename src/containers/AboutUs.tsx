import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { IUserPattern } from "../dto/IUserPattern";
import { EDialogType } from "../types/EDialogType";
import { useForm } from "react-hook-form";
import { IUnit } from "../dto/IUnit";
import { BaseService } from "../service/base-service";
import { Grid, styled, Typography } from "@mui/material";

const StyledTitle = styled(Typography)({
  textAlign: "center",
  marginBottom: "3rem",
});

const StyledText = styled(Typography)({
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: 300,
  lineHeight: "2.5rem",
});

const ColumnGrid = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  marginLeft: "auto",
  marginRight: "auto",
});
const AboutUs = () => {
  const appState = useContext(AppContext);

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<IUserPattern>(
      "/UserPatterns  ",
      appState.token!
    );

    if (result.ok && result.data) {
    }
  }, [appState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"PageContainer"}>
      <Grid className="layoutContainer">
        <ColumnGrid>
          <Grid>
            <StyledTitle variant={"h1"}>Fit My Body</StyledTitle>
          </Grid>
          <Grid>
            <StyledText variant={"body1"}>
              Fit My Body on 2022 alustanud veebileht, mille peamiseks
              eesmärgiks on aidata kasutajatel õmmelda iseseisvalt riideid
              vastavalt nende kehamõõtudele. Kasutaja saab sisestada enda
              kehamõõdud ja valida sobiva lõike, mida soovib endale õmmelda ja
              seejärel saab kasutaja lasta programmil välja arvutada vajaminevad
              mõõdud. Seejärel saab kasutaja endale alla laadida või välja
              printida valitud toote lõike. Lõike allalaadimise juures avaneb
              kasutajal võimalus vaadata samm-sammult juhendit, kuidas oleks
              antud toode mõistlik valmis õmmelda. Juhend pole kohustuslik
              läbimiseks vaid on toeks neile, kes ei tunne ennast õmblemises
              veel nii tugevalt. Juhendid on koostatud võimalikult selgelt ja
              juhendi juures võib leida ka abistavaid pildi või videomaterjale.
            </StyledText>
          </Grid>
        </ColumnGrid>
      </Grid>
    </Grid>
  );
};

export default AboutUs;
