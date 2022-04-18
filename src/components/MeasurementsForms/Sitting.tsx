import { Controller, useFormContext } from "react-hook-form";
import { Fragment } from "react";
import { Grid, TextField } from "@mui/material";

const Sitting = () => {
  const { setValue, control, clearErrors } = useFormContext();

  return (
    <Fragment>
      <Grid container>
        <Grid className="measurementsForm">
          <Grid className="imageGrid">
            <img
              src={"/images/measurement/silhouette_sitting.svg"}
              alt="sitting"
            />
          </Grid>

          <Grid className="InputGrid">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="userData.buttockHeight"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    error={!!error}
                    variant="standard"
                    type={"number"}
                    required
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "userData.buttockHeight",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.buttockHeight");
                    }}
                    label="Istmiku kõrgus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Istmiku kõrguse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Sitting;
