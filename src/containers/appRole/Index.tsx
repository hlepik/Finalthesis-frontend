import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IAppRole } from "../../dto/IAppRole";
import { AppContext } from "../../context/AppContext";
import { BaseService } from "../../service/base-service";
import {
    Button,
    Grid,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import BasicButton from "../../components/BasicButton";
import { EDialogType } from "../../types/EDialogType";
import { ICategory } from "../../dto/ICategory";
import { Controller, useForm } from "react-hook-form";
import DialogScreen from "../../components/DialogScreen";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { isBlank } from "../../utils/isBlank";

const StyledTable = styled(Table)({
    width: "auto",
});
const StyledBasicButton = styled(BasicButton)({
    marginLeft: "3rem",
    marginRight: "1rem",
});
const BasicButtonSpace = styled(BasicButton)({
    marginLeft: "1rem",
});

const AppRoleIndex = () => {
    const appState = useContext(AppContext);
    const [appRole, setAppRole] = useState([] as IAppRole[]);
    const [dialogType, setDialogType] = useState<EDialogType>(EDialogType.Create);
    const [alertMessage, setAlertMessage] = useState(false);
    const [insertSuccess, setInsertSuccess] = useState(false);
    const [modalState, setModalState] = useState(false);
    const { handleSubmit, control, setError, setValue, getValues, reset } = useForm<IAppRole>({
        defaultValues: {
            name: "",
            normalizedName: "",
            concurrencyStamp: "",
        },
    });
    const navigate = useNavigate();
    const loadData = useCallback(async () => {
        let result = await BaseService.getAll<IAppRole>("/AppRole", appState.token!);

        if (result.ok && result.data) {
            setAppRole(result.data);
        }
    }, [appState]);

    const onSubmit = async (data: IAppRole) => {
        if (dialogType === EDialogType.Delete) {
            let result = await BaseService.delete<IAppRole>("/AppRole/" + data.id, appState.token!);
            if (result.ok) {
                setModalState(!modalState);
                await loadData();
            }
        }
        if (isBlank(data.name)) {
            setError("name", {
                type: "manual",
                message: "Rolli sisestamine on kohustuslik",
            });
            return false;
        }
        const roleList = appRole.filter((item) => item.name === data.name);
        if (roleList.length !== 0) {
            setError("name", {
                type: "manual",
                message: "Roll juba olemas",
            });
            return false;
        }

        const url = "/AppRole";
        if (dialogType === EDialogType.Edit) {
            const role = appRole.find((item) => item.id === data.id);
            setValue("concurrencyStamp", role!.concurrencyStamp);
            setValue("normalizedName", getValues("name").toUpperCase());
            const url = "/AppRole/" + data.id;
            let response = await BaseService.edit(url, getValues(), appState.token!);
            if (response.statusCode >= 200 && response.statusCode < 400) {
                reset();
                setAlertMessage(true);
                await loadData();
            }
        }
        if (dialogType === EDialogType.Create) {
            let response = await BaseService.post(url, getValues(), appState.token!);
            if (response.statusCode >= 200 && response.statusCode < 400) {
                reset();
                setInsertSuccess(true);
                await loadData();
            }
        }
    };

    const handleDialogScreen = (dialogType?: EDialogType, role?: IAppRole) => {
        if (dialogType !== undefined) {
            setDialogType(dialogType);
            if (dialogType === EDialogType.Create) {
                reset();
            }
        }
        if (role !== undefined) {
            setValue("name", role.name);
            setValue("id", role.id);
        }
        setModalState(!modalState);
    };

    const handleClose = () => {
        setModalState(!modalState);
        setAlertMessage(false);
        setInsertSuccess(false);
        reset();
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Grid container className={"layoutContainer"}>
            <Grid>
                <Typography variant="h1">Kasutaja rollid</Typography>
                <Grid className={"AddButton"}>
                    <BasicButton
                        btnType={"black"}
                        label={"Lisa"}
                        onClick={() => {
                            handleDialogScreen(EDialogType.Create);
                        }}
                    />
                </Grid>
            </Grid>

            <DialogScreen handleClose={handleClose} isOpened={modalState}>
                {alertMessage ? (
                    <AlertComponent
                        message={"Rolli muutmine õnnestus"}
                        show={true}
                        type={EAlertClass.Success}
                        paddingSide={true}
                    />
                ) : (
                    <Grid className={"formGrid"}>
                        {dialogType === EDialogType.Create ? (
                            <>
                                <AlertComponent
                                    message={"Rolli lisamine õnnestus!"}
                                    show={insertSuccess}
                                    type={EAlertClass.Success}
                                    paddingSide={false}
                                />

                                <Typography variant={"h4"}>Sisestage uus roll</Typography>
                            </>
                        ) : dialogType === EDialogType.Edit ? (
                            <Typography variant={"h4"}>Muudke rolli</Typography>
                        ) : (
                            <AlertComponent
                                message={"Kas olete kindel, et soovite kustutada rolli: "}
                                boldText={getValues("name")}
                                show={true}
                                paddingSide={false}
                                type={EAlertClass.Danger}
                            />
                        )}

                        {dialogType === EDialogType.Delete ? null : (
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                                    <TextField
                                        error={!!error}
                                        fullWidth
                                        helperText={error ? error.message : null}
                                        label={"Nimetus*"}
                                        value={value}
                                        variant="standard"
                                        onChange={(e) => {
                                            onChange(e);
                                            setInsertSuccess(false);
                                        }}
                                    />
                                )}
                                rules={{
                                    required: "Rolli sisestamine on kohustuslik.",
                                }}
                            />
                        )}
                        <Grid className={"formButton"}>
                            <BasicButton
                                btnType={dialogType === EDialogType.Delete ? "red" : "yellow"}
                                label={dialogType === EDialogType.Delete ? "Kustuta" : "Salvesta"}
                                onClick={handleSubmit(onSubmit)}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogScreen>
            <TableContainer>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant={"h5"}>Nimetus</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appRole.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <StyledBasicButton
                                        btnType={"black"}
                                        label={"Muuda"}
                                        onClick={() => {
                                            handleDialogScreen(EDialogType.Edit, item);
                                        }}
                                    />

                                    <BasicButton
                                        btnType={"yellow"}
                                        label={"Kustuta"}
                                        onClick={() => {
                                            handleDialogScreen(EDialogType.Delete, item);
                                        }}
                                    />
                                    <BasicButtonSpace
                                        btnType={"black"}
                                        label={"Vaheta"}
                                        onClick={() => {
                                            navigate("/role/change/" + item.id);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            </TableContainer>
        </Grid>
    );
};

export default AppRoleIndex;
