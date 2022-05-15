import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FormControl, Grid, Input, InputAdornment, InputLabel, styled, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Navigate } from "react-router-dom";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { Controller, useForm } from "react-hook-form";
import BasicButton from "../../components/BasicButton";
import { IdentityService } from "../../service/identity-service";
import IconButton from "@mui/material/IconButton";

const StyledGrid = styled(Grid)({
    marginBottom: "1rem",
    width: "100%",
});
const StyledForm = styled("form")({
    width: "100%",
});

interface ILoginInputs {
    email: string;
    password: string;
}
const LoginPage = () => {
    const appState = useContext(AppContext);
    const [loginData] = useState({ email: "", password: "", id: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { handleSubmit, control, getFieldState, clearErrors, getValues } = useForm<ILoginInputs>({
        defaultValues: loginData,
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const loginClicked = async () => {
        let response = await IdentityService.Login("Account/Login", getValues());
        if (!response.ok) {
            if (response.statusCode === 404) {
                setAlertMessage("Vale kasutajanimi või parool!");
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
            {appState.token !== null ? <Navigate to="/andmed" /> : null}
            <Grid container className="LoginContainer">
                <Grid className="LoginBox">
                    <StyledForm onSubmit={handleSubmit(loginClicked)}>
                        <AlertComponent
                            show={alertMessage !== ""}
                            message={alertMessage}
                            type={EAlertClass.Danger}
                            paddingSide={false}
                        />

                        <StyledGrid>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
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
                                    required: "Emaili sisestamine on kohustuslik.",
                                }}
                            />
                        </StyledGrid>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value, name }, fieldState: { error, invalid } }) => (
                                <FormControl variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">Parool*</InputLabel>
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
                            <div className="ErrorMessage">{getFieldState("password").error!.message}</div>
                        ) : null}

                        <Grid className="ButtonGrid">
                            <BasicButton btnType={"black"} label={"logi sisse"} type={"submit"} />
                        </Grid>
                    </StyledForm>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default LoginPage;
