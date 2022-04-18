import { EPageStatus } from "../../types/EPageStatus";
import { Link } from "react-router-dom";
import { IAppUser } from "../../dto/IAppUser";
import { useContext, useEffect, useState } from "react";
import { AppContext, IAppState } from "../../context/AppContext";
import React, { useCallback } from "react";
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
  Typography,
} from "@mui/material";
import BasicButton from "../../components/BasicButton";
import { EDialogType } from "../../types/EDialogType";
import { useForm } from "react-hook-form";
import DialogScreen from "../../components/DialogScreen";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { ICategory } from "../../dto/ICategory";

const StyledTable = styled(Table)({
  width: "auto",
});
const StyledGrid = styled(Grid)({
  marginBottom: "3rem",
});
const AppUserIndex = () => {
  const appState = useContext(AppContext);
  const [users, setUser] = useState([] as IAppUser[]);
  const [dialogType, setDialogType] = useState<EDialogType>(EDialogType.Create);
  const [alertMessage, setAlertMessage] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [modalState, setModalState] = useState(false);
  const { handleSubmit, setValue, getValues, reset } = useForm<IAppUser>({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      normalizedUserName: "",
      email: "",
      normalizedEmail: "",
      emailConfirmed: false,
      passwordHash: "",
      securityStamp: "",
      concurrencyStamp: "",
      phoneNumber: "",
      phoneNumberConfirmed: false,
      twoFactorEnabled: false,
      lockoutEnd: new Date(),
      lockoutEnabled: false,
      accessFailedCount: 0,
    },
  });
  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<IAppUser>(
      "/AppUser",
      appState.token!
    );
    if (result.ok && result.data) {
      setUser(result.data);
    }
  }, [appState]);

  const onSubmit = async (data: IAppUser) => {
    if (dialogType === EDialogType.Delete) {
      let result = await BaseService.delete<ICategory>(
        "/AppUser/" + data.id,
        appState.token!
      );
      if (result.ok) {
        setModalState(!modalState);
        await loadData();
      }
    }
  };

  const handleDialogScreen = (dialogType?: EDialogType, user?: IAppUser) => {
    if (dialogType !== undefined) {
      setDialogType(dialogType);
      if (dialogType === EDialogType.Create) {
        reset();
      }
    }
    if (user !== undefined) {
      setValue("firstname", user.firstname);
      setValue("id", user.id);
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
      <StyledGrid>
        <Typography variant="h1">Kasutajad</Typography>
      </StyledGrid>
      <DialogScreen handleClose={handleClose} isOpened={modalState}>
        {alertMessage ? (
          <AlertComponent
            message={"Kasutaja muutmine õnnestus"}
            show={true}
            type={EAlertClass.Success}
            paddingSide={true}
          />
        ) : (
          <Grid className={"formGrid"}>
            {dialogType === EDialogType.Create ? (
              <>
                <AlertComponent
                  message={"Kasutaja lisamine õnnestus!"}
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
                message={"Kas olete kindel, et soovite kustutada kasutajat: "}
                boldText={`${getValues("firstname")} ${getValues("lastname")}`}
                show={true}
                paddingSide={false}
                type={EAlertClass.Danger}
              />
            )}

            <Grid className={"formButton"}>
              <BasicButton
                btnType={dialogType === EDialogType.Delete ? "red" : "yellow"}
                label={
                  dialogType === EDialogType.Delete ? "Kustuta" : "Salvesta"
                }
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
                <Typography variant={"h5"}>Eesnimi</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={"h5"}>Perekonnanimi</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={"h5"}>Email</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.firstname}</TableCell>
                <TableCell>{item.lastname}</TableCell>
                <TableCell>{item.email}</TableCell>

                <TableCell>
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

export default AppUserIndex;
