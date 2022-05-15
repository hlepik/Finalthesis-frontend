import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BaseService } from "../../service/base-service";
import {
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
import { Controller, useForm } from "react-hook-form";
import DialogScreen from "../../components/DialogScreen";
import BasicButton from "../../components/BasicButton";
import { isBlank } from "../../utils/isBlank";
import { EDialogType } from "../../types/EDialogType";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { IMeasurementType } from "../../dto/IMeasurementType";

const StyledTable = styled(Table)({
    width: "auto",
});
const StyledBasicButton = styled(BasicButton)({
    marginLeft: "3rem",
    marginRight: "1rem",
});
const StyledGrid = styled(Grid)({
    marginBottom: "1rem",
    width: "100%",
});
const MeasurementTypeIndex = () => {
    const appState = useContext(AppContext);
    const [measurementType, setMeasurementType] = useState(([] as IMeasurementType[]) || "");
    const [alertMessage, setAlertMessage] = useState(false);
    const [insertSuccess, setInsertSuccess] = useState(false);

    const [dialogType, setDialogType] = useState<EDialogType>(EDialogType.Create);

    const [modalState, setModalState] = useState(false);
    const { handleSubmit, control, setError, setValue, getValues, reset } = useForm<IMeasurementType>({
        defaultValues: {
            name: "",
            dbName: "",
        },
    });

    const loadData = useCallback(async () => {
        let result = await BaseService.getAll<IMeasurementType>("/MeasurementTypes", appState.token!);

        if (result.ok && result.data) {
            setMeasurementType(result.data);
        }
    }, [appState]);

    const handleClose = () => {
        setModalState(!modalState);
        setAlertMessage(false);
        setInsertSuccess(false);
        reset();
    };
    const handleDialogScreen = (dialogType?: EDialogType, measurementType?: IMeasurementType) => {
        if (dialogType !== undefined) {
            setDialogType(dialogType);
            if (dialogType === EDialogType.Create) {
                reset();
            }
        }
        if (measurementType !== undefined) {
            setValue("name", measurementType.name);
            setValue("dbName", measurementType.dbName);
            setValue("id", measurementType.id);
        }
        setModalState(!modalState);
    };

    const onSubmit = async (data: IMeasurementType) => {
        if (dialogType === EDialogType.Delete) {
            let result = await BaseService.delete<IMeasurementType>("/MeasurementTypes/" + data.id, appState.token!);
            if (result.ok) {
                setModalState(!modalState);
                await loadData();
            }
        }
        if (isBlank(data.name)) {
            setError("name", {
                type: "manual",
                message: "Nimetuse sisestamine on kohustuslik",
            });
            return false;
        }
        if (isBlank(data.dbName)) {
            setError("dbName", {
                type: "manual",
                message: "Sisestamine on kohustuslik",
            });
            return false;
        }
        const measurementTypeList = measurementType.filter((item) => item.name === data.name);
        if (measurementTypeList.length !== 0) {
            setError("name", {
                type: "manual",
                message: "Nimetus juba olemas",
            });
            return false;
        }

        let url = "/MeasurementTypes";
        if (dialogType === EDialogType.Edit) {
            url = "/MeasurementTypes/" + data.id;
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Grid container className={"layoutContainer"}>
            <Grid>
                <Typography variant="h1">Nimetus</Typography>
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
                        message={"Muutmine õnnestus"}
                        show={true}
                        type={EAlertClass.Success}
                        paddingSide={true}
                    />
                ) : (
                    <Grid className={"formGrid"}>
                        {dialogType === EDialogType.Create ? (
                            <>
                                <AlertComponent
                                    message={"Lisamine õnnestus!"}
                                    show={insertSuccess}
                                    type={EAlertClass.Success}
                                    paddingSide={false}
                                />

                                <Typography variant={"h4"}>Sisestage uus</Typography>
                            </>
                        ) : dialogType === EDialogType.Edit ? (
                            <Typography variant={"h4"}>Muudke nimetust</Typography>
                        ) : (
                            <AlertComponent
                                message={"Kas olete kindel, et soovite kustutada antud nimetust: "}
                                boldText={getValues("name")}
                                show={true}
                                paddingSide={false}
                                type={EAlertClass.Danger}
                            />
                        )}

                        {dialogType === EDialogType.Delete ? null : (
                            <>
                                <StyledGrid>
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
                                            required: "Nimetuse sisestamine on kohustuslik.",
                                        }}
                                    />
                                </StyledGrid>
                                <Controller
                                    control={control}
                                    name="dbName"
                                    render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                                        <TextField
                                            error={!!error}
                                            fullWidth
                                            helperText={error ? error.message : null}
                                            label={"Andmebaasi välja nimetus*"}
                                            value={value}
                                            variant="standard"
                                            onChange={(e) => {
                                                onChange(e);
                                                setInsertSuccess(false);
                                            }}
                                        />
                                    )}
                                    rules={{
                                        required: "Sisestamine on kohustuslik.",
                                    }}
                                />
                            </>
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
                        {measurementType.map((item) => (
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            </TableContainer>
        </Grid>
    );
};

export default MeasurementTypeIndex;
