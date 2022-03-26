import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Grid, TextField, Typography } from "@mui/material";
import BasicButton from "../../components/BasicButton";
import { BaseService } from "../../service/base-service";
import { IAppUser } from "../../dto/IAppUser";
import { IBodyMeasurements } from "../../dto/IBodyMeasurements";
import MeasurementsStepper from "../../components/MeasurementsStepper";
import DialogScreen from "../../components/DialogScreen";
import { Controller, useForm } from "react-hook-form";
import { isBlank } from "../../utils/isBlank";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { EMAIL_REGEX } from "../../utils/regex";

export interface IUser {
  appUser: IAppUser;
  passwordConfirm: string;
  password: string;
}

const UserPage = () => {
  const appState = useContext(AppContext);
  const [user, setUser] = useState({} as IAppUser);
  const [measurements, setMeasurements] = useState({} as IBodyMeasurements);
  const [modalState, setModalState] = useState(false);
  const [userModalState, setUserModalState] = useState(false);
  const [message, setMessage] = useState(false);
  const [role, setRole] = useState("");

  const [dialogValue, setDialogValue] = useState("");
  const { control, setError, setValue, getValues, clearErrors } =
    useForm<IUser>({
      defaultValues: {
        appUser: {},
        password: "",
        passwordConfirm: "",
      },
    });
  const loadData = useCallback(async () => {
    console.log(appState.token);
    let result = await BaseService.get<IAppUser>(
      "/AppUser/" + appState.id,
      appState.token!
    );
    if (result.ok && result.data) {
      setUser(result.data);
      setValue("appUser", result.data);
      if (role !== "Admin") {
        let response = await BaseService.get<IBodyMeasurements>(
          "/BodyMeasurements/" + appState.id,
          appState.token!
        );
        if (response.ok && response.data) {
          setMeasurements(response.data);
        }
      }
    }
  }, [appState]);

  const saveUserData = async () => {
    if (isBlank(getValues("appUser.firstname"))) {
      setError("appUser.firstname", {
        type: "manual",
        message: "Eesnime sisestamine on kohustuslik.",
      });
      return;
    }
    if (isBlank(getValues("appUser.lastname"))) {
      setError("appUser.lastname", {
        type: "manual",
        message: "Perekonnanime sisestamine on kohustuslik.",
      });
      return;
    }
    if (isBlank(getValues("appUser.email"))) {
      setError("appUser.email", {
        type: "manual",
        message: "Emaili sisestamine on kohustuslik.",
      });
      return;
    }
    if (!getValues("appUser.email").match(EMAIL_REGEX)) {
      setError("appUser.email", {
        type: "manunal",
        message: "Email ei ole korrektne",
      });
      return;
    }

    let response = await BaseService.edit<IAppUser>(
      "/AppUser/" + appState.id,
      getValues("appUser"),
      appState.token!
    );
    setMessage(true);
  };
  const updatePassword = async () => {
    if (getValues("password") !== getValues("passwordConfirm")) {
      setError("password", {
        type: "manual",
        message: "Paroolid ei ühti.",
      });
      return false;
    }
    if (isBlank(getValues("password"))) {
      setError("password", {
        type: "manual",
        message: "Parooli sisestamine on kohustuslik.",
      });
      return;
    }

    let response = await BaseService.edit<string>(
      "/AppUser/password/" + appState.id,
      getValues("password"),
      appState.token!
    );
    if (response.ok) {
      setMessage(true);
    } else {
      setError("password", {
        type: "manual",
        message:
          "Parool peab olema 6 sümbolit pikk ja sisaldama vähemalt ühte suurt tähte, numbrit ja sümbolit.",
      });
    }
  };
  const handleDialogScreen = () => {
    setModalState(!modalState);
  };
  const handleUserDialogScreen = () => {
    setUserModalState(!userModalState);
  };

  useEffect(() => {
    const info = JSON.parse(atob(appState.token!.split(".")[1]));
    const userRole =
      info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    setRole(userRole);
    loadData();
  }, [loadData]);

  return (
    <Fragment>
      <Grid className="TableGrid" flexDirection={"column"}>
        <Typography variant={"h3"}>Minu andmed</Typography>

        <Grid className="UserData">
          <Grid>
            <Typography variant={"body1"}>Eesnimi:</Typography>
            <Typography variant={"body1"}>Perekonnanimi:</Typography>
            <Typography variant={"body1"}>Email:</Typography>
          </Grid>
          <Grid>
            <Typography variant={"body2"}>{user.firstname}</Typography>
            <Typography variant={"body2"}>{user.lastname}</Typography>
            <Typography variant={"body2"}>{user.email}</Typography>
          </Grid>
        </Grid>
        <Grid className="ButtonGrid">
          <BasicButton
            btnType={"black"}
            label={"Vaheta parooli"}
            type={"submit"}
            onClick={() => {
              handleUserDialogScreen();
              setDialogValue("password");
            }}
          />
          <BasicButton
            btnType={"black"}
            label={"Muuda andmeid"}
            type={"submit"}
            onClick={() => {
              handleUserDialogScreen();
              setDialogValue("userData");
            }}
          />
        </Grid>

        {role !== "Admin" ? (
          <>
            <Typography variant={"h3"}>Minu keha mõõdud</Typography>
            <Grid className="UserData">
              <Grid>
                <Typography variant={"body1"}>Kaelaümbermõõt:</Typography>
                <Typography variant={"body1"}>Rinnaümbermõõt:</Typography>
                <Typography variant={"body1"}>Vööümbermõõt:</Typography>
                <Typography variant={"body1"}>Ülemine puus:</Typography>
                <Typography variant={"body1"}>Lühema puusa kõrgus:</Typography>
                <Typography variant={"body1"}>Puusa ümbermõõt:</Typography>
                <Typography variant={"body1"}>Puusa pikkus:</Typography>
                <Typography variant={"body1"}>Käe ümbermõõt:</Typography>
                <Typography variant={"body1"}>Randme ümbermõõt:</Typography>
                <Typography variant={"body1"}>Esipikkus:</Typography>
                <Typography variant={"body1"}>Reie ümbermõõt:</Typography>
                <Typography variant={"body1"}>Põlve ümbermõõt:</Typography>
              </Grid>
              <Grid>
                <Typography variant={"body2"}>
                  {measurements.neckSize}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.chestGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.waistGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.upperHipGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.waistLengthFirst}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.hipGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.waistLengthSec}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.upperArmGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.wristGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.frontLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.thighGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.kneeGirth}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant={"body1"}>Sääre ümbermõõt:</Typography>
                <Typography variant={"body1"}>Jala ümbermõõt:</Typography>
                <Typography variant={"body1"}>
                  Jala sisemise külje pikkus:
                </Typography>
                <Typography variant={"body1"}>Käe pikkus:</Typography>
                <Typography variant={"body1"}>Õla pikkus:</Typography>
                <Typography variant={"body1"}>Käeaugukaare sügavus:</Typography>
                <Typography variant={"body1"}>Selja laius:</Typography>
                <Typography variant={"body1"}>Puusa kõrgus:</Typography>
                <Typography variant={"body1"}>Selja pikkus:</Typography>
                <Typography variant={"body1"}>Rinna kõrgus:</Typography>
                <Typography variant={"body1"}>Istmiku kõrgus:</Typography>
                <Typography variant={"body1"}>Üldpikkus:</Typography>
              </Grid>
              <Grid>
                <Typography variant={"body2"}>
                  {measurements.calfGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.ankleGirth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.insideLegLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.armLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.shoulderLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.armholeLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.backWidth}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.waistHeight}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.backLength}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.chestHeight}
                </Typography>
                <Typography variant={"body2"}>
                  {measurements.buttockHeight}
                </Typography>
                <Typography variant={"body2"}>{measurements.length}</Typography>
              </Grid>
            </Grid>
            <Grid className="ButtonGrid">
              {measurements.kneeGirth === undefined ? (
                <BasicButton
                  btnType={"black"}
                  label={"Lisa"}
                  onClick={handleDialogScreen}
                />
              ) : (
                <BasicButton
                  btnType={"yellow"}
                  onClick={handleDialogScreen}
                  label={"Muuda"}
                />
              )}

              <DialogScreen
                isOpened={userModalState}
                handleClose={handleUserDialogScreen}
              >
                <Grid className={"formGrid"}>
                  {dialogValue === "password" ? (
                    <>
                      <AlertComponent
                        message={"Parooli vahetamine õnnestus!"}
                        show={message}
                        type={EAlertClass.Success}
                        paddingSide={false}
                      />
                      <Controller
                        control={control}
                        name="password"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            label={"Uus parool*"}
                            value={value}
                            variant="standard"
                            onChange={(e) => {
                              onChange(e);
                              clearErrors("password");
                            }}
                          />
                        )}
                        rules={{
                          required: "Parooli sisestamine on kohustuslik.",
                        }}
                      />
                      <Controller
                        control={control}
                        name="passwordConfirm"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            label={"Uus parool uuesti*"}
                            value={value}
                            variant="standard"
                            onChange={(e) => {
                              onChange(e);
                              clearErrors("passwordConfirm");
                            }}
                          />
                        )}
                        rules={{
                          required: "Parooli sisestamine on kohustuslik.",
                        }}
                      />
                      <BasicButton
                        btnType={"yellow"}
                        label={"Salvesta"}
                        type={"submit"}
                        onClick={updatePassword}
                      />
                    </>
                  ) : (
                    <>
                      <AlertComponent
                        message={"Andmete muutmine õnnestus!"}
                        show={message}
                        type={EAlertClass.Success}
                        paddingSide={false}
                      />

                      <Controller
                        control={control}
                        name="appUser.firstname"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            label={"Nimi*"}
                            value={value}
                            variant="standard"
                            onChange={(e) => {
                              onChange(e);
                              clearErrors("appUser.firstname");
                            }}
                          />
                        )}
                        rules={{
                          required: "Nime sisestamine on kohustuslik.",
                        }}
                      />
                      <Controller
                        control={control}
                        name="appUser.lastname"
                        render={({
                          field: { onChange, value, name },
                          fieldState: { error },
                        }) => (
                          <TextField
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            label={"Perekonnanimi*"}
                            value={value}
                            variant="standard"
                            onChange={(e) => {
                              onChange(e);
                              clearErrors("appUser.lastname");
                            }}
                          />
                        )}
                        rules={{
                          required: "Perekonnanime sisestamine on kohustuslik.",
                        }}
                      />
                      <Controller
                        control={control}
                        name="appUser.email"
                        render={({
                          field: { onChange, value, name },
                          fieldState: { error },
                        }) => (
                          <TextField
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            label={"Email*"}
                            value={value}
                            variant="standard"
                            onChange={(e) => {
                              onChange(e);
                              clearErrors("appUser.email");
                            }}
                          />
                        )}
                        rules={{
                          required: "Emaili sisestamine on kohustuslik.",
                        }}
                      />
                      <BasicButton
                        btnType={"yellow"}
                        label={"Salvesta"}
                        type={"submit"}
                        onClick={saveUserData}
                      />
                    </>
                  )}
                </Grid>
              </DialogScreen>

              {modalState ? (
                <MeasurementsStepper
                  handleClose={handleDialogScreen}
                  isOpened={modalState}
                  token={appState.token!}
                  data={measurements}
                />
              ) : null}
            </Grid>
          </>
        ) : null}
      </Grid>
    </Fragment>
  );
};

export default UserPage;
