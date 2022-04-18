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
                name="userData.insideLegLength"
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
                        "userData.insideLegLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.insideLegLength");
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
                name="userData.armLength"
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
                        "userData.armLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.armLength");
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
                name="userData.shoulderLength"
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
                        "userData.shoulderLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.shoulderLength");
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
                name="userData.armholeLength"
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
                        "userData.armholeLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.armholeLength");
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
                name="userData.backWidth"
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
                        "userData.backWidth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("userData.backWidth");
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
