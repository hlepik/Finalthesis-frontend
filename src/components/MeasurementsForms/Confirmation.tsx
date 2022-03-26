import { useFormContext } from "react-hook-form";
import { Fragment } from "react";
import { Grid } from "@mui/material";
import AlertComponent, { EAlertClass } from "../AlertComponent";

const Confirmation = () => {
  const { getValues, setValue, control } = useFormContext();

  return (
    <Fragment>
      <Grid container>
        <AlertComponent
          message={"Teie andmed on edukalt salvestatud!"}
          show={true}
          type={EAlertClass.Info}
          paddingSide={true}
        />
      </Grid>
    </Fragment>
  );
};

export default Confirmation;
