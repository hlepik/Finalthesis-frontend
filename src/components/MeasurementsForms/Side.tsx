import { Controller, useFormContext } from "react-hook-form";
import { Fragment } from "react";
import { Grid, TextField } from "@mui/material";

const Side = () => {
  const { clearErrors, setValue, control } = useFormContext();

  return (
    <Fragment>
      <Grid container>
        <Grid className="measurementsForm">
          <Grid className="imageGrid">
            <img src={"/images/measurement/silhouette_side.svg"} alt="side" />
          </Grid>

          <Grid className="InputGrid">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="userData.waistHeight"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    required
                    fullWidth
                    error={!!error}
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "userData.waistHeight",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.waistHeight");
                    }}
                    label="20. Üldpikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Üldpikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="userData.backLength"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    required
                    error={!!error}
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "userData.backLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.backLength");
                    }}
                    label="21. Seljapikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Seljapikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="userData.chestHeight"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    required
                    error={!!error}
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "userData.chestHeight",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.chestHeight");
                    }}
                    label="22. Rinnakõrgus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Rinnakõrguse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Side;
