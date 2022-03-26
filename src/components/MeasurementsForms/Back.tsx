import { Controller, useFormContext } from "react-hook-form";
import { Fragment } from "react";
import { Grid, TextField } from "@mui/material";

const Back = () => {
  const { setValue, control, clearErrors } = useFormContext();

  return (
    <Fragment>
      <Grid container>
        <Grid className="measurementsForm">
          <Grid className="imageGrid">
            <img src={"/images/measurement/silhouette_back.svg"} alt="back" />
          </Grid>

          <Grid className="InputGrid">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="insideLegLength"
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
                        "insideLegLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("insideLegLength");
                    }}
                    label="15. Jala pikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Jala pikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="armLength"
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
                        "armLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("armLength");
                    }}
                    label="16. Varruka pikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Varruka pikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="shoulderLength"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    error={!!error}
                    required
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "shoulderLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("shoulderLength");
                    }}
                    label="17. Õla pikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Õla pikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="armholeLength"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    required
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                    onChange={(e) => {
                      setValue(
                        "armholeLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("armholeLength");
                    }}
                    label="18. Käeaugukaare sügavus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Käeaugukaare sügavuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="backWidth"
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
                        "backWidth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("backWidth");
                    }}
                    label="19. Seljalaius"
                    value={value}
                  />
                )}
                rules={{
                  required: "Seljalaiuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Back;
