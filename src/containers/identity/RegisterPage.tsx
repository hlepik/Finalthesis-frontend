import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { isBlank } from "../../utils/isBlank";
import { EMAIL_REGEX } from "../../utils/regex";
import { IdentityService } from "../../service/identity-service";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import BasicButton from "../../components/BasicButton";

interface IFormValues {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

const RegisterPage = () => {
  const appState = useContext(AppContext);

  const [registerData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    getFieldState,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<IFormValues>({ defaultValues: registerData });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const registerClicked = async (data: IFormValues) => {
    if (isBlank(data.firstName)) {
      setError("firstName", {
        type: "manual",
        message: "Eesnime sisestamine on kohustuslik.",
      });
      return;
    }
    if (isBlank(data.lastName)) {
      setError("lastName", {
        type: "manual",
        message: "Perekonnanime sisestamine on kohustuslik.",
      });
      return;
    }
    if (isBlank(data.email)) {
      setError("email", {
        type: "manual",
        message: "Emaili sisestamine on kohustuslik.",
      });
      return;
    }
    if (!data.email.match(EMAIL_REGEX)) {
      setError("email", {
        type: "manunal",
        message: "Email ei ole korrektne",
      });
      return;
    }
    if (isBlank(data.password)) {
      setError("password", {
        type: "manual",
        message: "Parooli sisestamine on kohustuslik.",
      });
      return;
    }
    if (data.password !== confirmPassword) {
      setError("password", {
        type: "manual",
        message: "Paroolid ei ühti.",
      });

      return;
    }
    let response = await IdentityService.register(
      "Account/Register",
      getValues()
    );
    if (!response.ok) {
      if (response.statusCode === 400) {
        setError("password", {
          type: "manual",
          message:
            "Parool peab olema 6 sümbolit pikk ja sisaldama vähemalt ühte suurt tähte, numbrit ja sümbolit.",
        });
        return;
      }
      if (response.statusCode === 404) {
        setError("email", {
          type: "manual",
          message: response.messages![0],
        });
        return;
      }
    } else {
      setAlertMessage("");
      appState.setAuthInfo(
        response.data!.token,
        response.data!.firstname,
        response.data!.lastname,
        response.data!.id
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <Fragment>
      {appState.token !== null ? <Navigate to="/" /> : null}
      <Grid container className="LoginContainer">
        <Grid className="LoginBox">
          <form onSubmit={handleSubmit(registerClicked)}>
            <AlertComponent
              show={alertMessage !== ""}
              message={alertMessage}
              type={EAlertClass.Danger}
              paddingSide={false}
            />

            <Controller
              control={control}
              name="firstName"
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
                <TextField
                  error={!!error}
                  fullWidth
                  helperText={error ? error.message : null}
                  label={"Eesnimi*"}
                  value={value}
                  variant="standard"
                  onChange={(e) => {
                    clearErrors(name);
                    onChange(e);
                  }}
                />
              )}
              rules={{
                required: "Parooli sisestamine on kohustuslik.",
              }}
            />
            <Controller
              control={control}
              name="lastName"
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
                    clearErrors(name);
                    onChange(e);
                  }}
                />
              )}
              rules={{
                required: "Perekonnanime sisestamine on kohustuslik",
              }}
            />
            <Controller
              control={control}
              name="email"
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
                    clearErrors(name);
                    onChange(e);
                  }}
                />
              )}
              rules={{
                required: "Emaili sisestamine on kohustuslik",
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value, name },
                fieldState: { error, invalid },
              }) => (
                <FormControl variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">
                    Parool*
                  </InputLabel>
                  <Input
                    error={!!error}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              )}
              rules={{
                required: "Parooli sisestamine on kohustuslik.",
              }}
            />
            {getFieldState("password").invalid ? (
              <div className="ErrorMessage">
                {getFieldState("password").error!.message}
              </div>
            ) : null}

            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Kinnita parool*
              </InputLabel>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {getFieldState("password").invalid ? (
              <div className="ErrorMessage">
                {getFieldState("password").error!.message}
              </div>
            ) : null}
            <Grid className="ButtonGrid">
              <BasicButton
                btnType={"black"}
                label={"Registreeri"}
                type={"submit"}
              />
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default RegisterPage;
