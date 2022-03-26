import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BaseService } from "../../service/base-service";
import { IUnit } from "../../dto/IUnit";
import {
  Grid,
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
import { ICategory } from "../../dto/ICategory";

const CategoryIndex = () => {
  const appState = useContext(AppContext);
  const [category, setCategory] = useState(([] as ICategory[]) || "");
  const [alertMessage, setAlertMessage] = useState(false);
  const [insertSuccess, setInsertSuccess] = useState(false);

  const [dialogType, setDialogType] = useState<EDialogType>(EDialogType.Create);

  const [modalState, setModalState] = useState(false);
  const { handleSubmit, control, setError, setValue, getValues, reset } =
    useForm<IUnit>({
      defaultValues: {
        name: "",
      },
    });

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<ICategory>(
      "/Categories",
      appState.token!
    );

    if (result.ok && result.data) {
      setCategory(result.data);
    }
  }, [appState]);

  const handleClose = () => {
    setModalState(!modalState);
    setAlertMessage(false);
    setInsertSuccess(false);
    reset();
  };
  const handleDialogScreen = (
    dialogType?: EDialogType,
    category?: ICategory
  ) => {
    if (dialogType !== undefined) {
      setDialogType(dialogType);
      if (dialogType === EDialogType.Create) {
        reset();
      }
    }
    if (category !== undefined) {
      setValue("name", category.name);
      setValue("id", category.id);
    }
    setModalState(!modalState);
  };

  const onSubmit = async (data: ICategory) => {
    if (dialogType === EDialogType.Delete) {
      let result = await BaseService.delete<ICategory>(
        "/Categories/" + data.id,
        appState.token!
      );
      if (result.ok) {
        setModalState(!modalState);
        await loadData();
      }
    }
    if (isBlank(data.name)) {
      setError("name", {
        type: "manual",
        message: "Kategooria sisestamine on kohustuslik",
      });
      return false;
    }
    const categoryList = category.filter((item) => item.name === data.name);
    if (categoryList.length !== 0) {
      setError("name", {
        type: "manual",
        message: "Kategooria juba olemas",
      });
      return false;
    }

    const url = "/Categories";
    if (dialogType === EDialogType.Edit) {
      const url = "/Categories/" + data.id;
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
    <Grid container className={"PageContainer"}>
      <Grid>
        <Typography variant="h1">Kategooriad</Typography>
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
            message={"Kategooria muutmine õnnestus"}
            show={true}
            type={EAlertClass.Success}
            paddingSide={true}
          />
        ) : (
          <Grid className={"formGrid"}>
            {dialogType === EDialogType.Create ? (
              <>
                <AlertComponent
                  message={"Kategooria lisamine õnnestus!"}
                  show={insertSuccess}
                  type={EAlertClass.Success}
                  paddingSide={false}
                />

                <Typography variant={"h4"}>Sisestage uus kategooria</Typography>
              </>
            ) : dialogType === EDialogType.Edit ? (
              <Typography variant={"h4"}>Muudke kategooriat</Typography>
            ) : (
              <AlertComponent
                message={"Kas olete kindel, et soovite kustutada kategooriat: "}
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
                render={({
                  field: { onChange, value, name },
                  fieldState: { error },
                }) => (
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
                  required: "Kategooria sisestamine on kohustuslik.",
                }}
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant={"h5"}>Nimetus</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <BasicButton
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
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default CategoryIndex;
