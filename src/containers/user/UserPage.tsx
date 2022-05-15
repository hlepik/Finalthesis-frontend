import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Grid, styled, TextField, Typography } from "@mui/material";
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
import { useNavigate } from "react-router-dom";

export interface IUser {
    appUser: IAppUser;
    passwordConfirm: string;
    password: string;
}

const StyledGrid = styled(Grid)({
    marginLeft: "4rem",
});
const StyledInputGrid = styled(Grid)({
    marginTop: "1rem",
});
const StyledText = styled(Typography)({
    marginBottom: "5.3px",
});
const StyledBasicButton = styled(Grid)({
    marginTop: "2rem",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "flex-end",
});

const UserPage = () => {
    const appState = useContext(AppContext);
    const [user, setUser] = useState({} as IAppUser);
    const [measurements, setMeasurements] = useState<IBodyMeasurements>({} as IBodyMeasurements);
    const [modalState, setModalState] = useState(false);
    const [userModalState, setUserModalState] = useState(false);
    const [message, setMessage] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const [dialogValue, setDialogValue] = useState("");
    const { control, setError, setValue, getValues, clearErrors } = useForm<IUser>({
        defaultValues: {
            appUser: {},
            password: "",
            passwordConfirm: "",
        },
    });
    const loadData = useCallback(async () => {
        let result = await BaseService.get<IAppUser>("/AppUser/" + appState.id, appState.token!);
        if (result.ok && result.data) {
            setUser(result.data);
            setValue("appUser", result.data);

            let userRole;
            if (role === "") {
                userRole = getRole();
            }
            if (role !== "Admin" && userRole !== "Admin") {
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
        if (response.statusCode >= 200 && response.statusCode < 400) {
            setMessage(true);
            await loadData();
        }
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
        if (response.statusCode >= 200 && response.statusCode < 400) {
            setMessage(true);
            await loadData();
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
        loadData();
    };
    const handleUserDialogScreen = () => {
        setUserModalState(!userModalState);
    };
    const getRole = () => {
        if (appState.token !== null) {
            const info = JSON.parse(atob(appState.token!.split(".")[1]));
            const userRole = info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            setRole(userRole);
            return userRole;
        }
        navigate("/login");
    };

    useEffect(() => {
        getRole();
        if (appState.token !== null) {
            loadData();
        }
    }, [loadData]);

    return (
        <Fragment>
            <Grid className="TableGrid" flexDirection={"column"}>
                <Typography variant={"h1"}>Minu andmed</Typography>

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
                <DialogScreen isOpened={userModalState} handleClose={handleUserDialogScreen}>
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
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            error={!!error}
                                            fullWidth
                                            helperText={error ? error.message : null}
                                            label={"Uus parool*"}
                                            value={value}
                                            type={"password"}
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
                                <StyledInputGrid>
                                    <Controller
                                        control={control}
                                        name="passwordConfirm"
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <TextField
                                                error={!!error}
                                                fullWidth
                                                helperText={error ? error.message : null}
                                                label={"Uus parool uuesti*"}
                                                value={value}
                                                type={"password"}
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
                                </StyledInputGrid>
                                <StyledBasicButton>
                                    <BasicButton
                                        btnType={"yellow"}
                                        label={"Salvesta"}
                                        type={"submit"}
                                        onClick={updatePassword}
                                    />
                                </StyledBasicButton>
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
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                <StyledInputGrid>
                                    <Controller
                                        control={control}
                                        name="appUser.lastname"
                                        render={({ field: { onChange, value, name }, fieldState: { error } }) => (
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
                                </StyledInputGrid>
                                <StyledInputGrid>
                                    <Controller
                                        control={control}
                                        name="appUser.email"
                                        render={({ field: { onChange, value, name }, fieldState: { error } }) => (
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
                                </StyledInputGrid>
                                <StyledBasicButton>
                                    <BasicButton
                                        btnType={"yellow"}
                                        label={"Salvesta"}
                                        type={"submit"}
                                        onClick={saveUserData}
                                    />
                                </StyledBasicButton>
                            </>
                        )}
                    </Grid>
                </DialogScreen>

                {role !== "Admin" ? (
                    <>
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
                                    <StyledText variant={"body2"}>{measurements.neckSize}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.chestGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.waistGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.upperHipGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.waistLengthFirst}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.hipGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.waistLengthSec}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.upperArmGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.wristGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.frontLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.thighGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.kneeGirth}</StyledText>
                                </Grid>
                                <StyledGrid>
                                    <Typography variant={"body1"}>Sääre ümbermõõt:</Typography>
                                    <Typography variant={"body1"}>Jala ümbermõõt:</Typography>
                                    <Typography variant={"body1"}>Jala sisemise külje pikkus:</Typography>
                                    <Typography variant={"body1"}>Käe pikkus:</Typography>
                                    <Typography variant={"body1"}>Õlapikkus:</Typography>
                                    <Typography variant={"body1"}>Käeaugukaare sügavus:</Typography>
                                    <Typography variant={"body1"}>Selja laius:</Typography>
                                    <Typography variant={"body1"}>Puusa kõrgus:</Typography>
                                    <Typography variant={"body1"}>Selja pikkus:</Typography>
                                    <Typography variant={"body1"}>Rinna kõrgus:</Typography>
                                    <Typography variant={"body1"}>Istmiku kõrgus:</Typography>
                                    <Typography variant={"body1"}>Üldpikkus:</Typography>
                                </StyledGrid>
                                <Grid>
                                    <StyledText variant={"body2"}>{measurements.calfGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.ankleGirth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.insideLegLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.armLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.shoulderLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.armholeLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.backWidth}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.waistHeight}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.backLength}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.chestHeight}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.buttockHeight}</StyledText>
                                    <StyledText variant={"body2"}>{measurements.length}</StyledText>
                                </Grid>
                            </Grid>
                            <Grid className="ButtonGrid">
                                {measurements.kneeGirth === undefined ? (
                                    <BasicButton btnType={"black"} label={"Lisa"} onClick={handleDialogScreen} />
                                ) : (
                                    <BasicButton btnType={"yellow"} onClick={handleDialogScreen} label={"Muuda"} />
                                )}

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
                    </>
                ) : null}
            </Grid>
        </Fragment>
    );
};

export default UserPage;
