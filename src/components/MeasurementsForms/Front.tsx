import { forwardRef, Fragment, useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Grid, TextField } from "@mui/material";

const Front = () => {
  const { setValue, control, clearErrors } = useFormContext();

  return (
    <Fragment>
      <Grid container>
        <Grid className="measurementsForm">
          <Grid className="imageGrid">
            <img src={"/images/measurement/silhouette_front.svg"} alt="front" />
          </Grid>

          <Grid className="InputGrid">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="userData.neckSize"
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
                        "userData.neckSize",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("neckSize");
                    }}
                    label="1. Kaela ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Kaela ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="chestGirth"
                render={({ field: { value }, fieldState: { error } }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    variant="standard"
                    type={"number"}
                    required
                    error={!!error}
                    fullWidth
                    onChange={(e) => {
                      setValue(
                        "chestGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("chestGirth");
                    }}
                    label="2. Rinnaümbermõõt"
                    value={value}
                    InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                  />
                )}
                rules={{
                  required: "Rinnaümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="waistGirth"
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
                        "waistGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("waistGirth");
                    }}
                    label="3. Vööümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Vööümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="upperHipGirth"
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
                        "upperHipGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("upperHipGirth");
                    }}
                    label="4. Ülemise puusa ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required:
                    "Ülemise puusa ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="waistLengthFirst"
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
                        "waistLengthFirst",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("waistLengthFirst");
                    }}
                    label="5. Tuharavoldi pikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Mõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="hipGirth"
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
                        "hipGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("hipGirth");
                    }}
                    label="6. Puusa ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Puusa ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="waistLengthSec"
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
                        "waistLengthSec",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("waistLengthSec");
                    }}
                    label="7. Vööjoone kõrgus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Mõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
          </Grid>
          <Grid className="InputGrid">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="upperArmGirth"
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
                        "upperArmGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("upperArmGirth");
                    }}
                    label="8. Käe ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Käe ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="wristGirth"
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
                        "wristGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("wristGirth");
                    }}
                    label="9. Randme ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Käe ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="frontLength"
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
                        "frontLength",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("frontLength");
                    }}
                    label="10. Esipikkus"
                    value={value}
                  />
                )}
                rules={{
                  required: "Esipikkuse sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="thighGirth"
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
                        "thighGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("thighGirth");
                    }}
                    label="11. Reie ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Reie ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="kneeGirth"
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
                        "kneeGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("kneeGirth");
                    }}
                    label="12. Põlve ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Põlve ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="calfGirth"
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
                        "calfGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("calfGirth");
                    }}
                    label="13. Sääre ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Sääre ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="ankleGirth"
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
                        "ankleGirth",
                        e.target.value.length > 0
                          ? parseFloat(e.target.value)
                          : ""
                      );
                      clearErrors("ankleGirth");
                    }}
                    label="14. Pahkluu ümbermõõt"
                    value={value}
                  />
                )}
                rules={{
                  required: "Pahkluu ümbermõõdu sisestamine on kohustuslik.",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Front;
