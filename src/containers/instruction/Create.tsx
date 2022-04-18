import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { IPatternInstruction } from "../../dto/IPatternInstruction";
import { BaseService } from "../../service/base-service";
import { ICategory } from "../../dto/ICategory";
import { FormDataService } from "../../service/FormDataService";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import BasicButton from "../../components/BasicButton";
import { DropzoneArea } from "react-mui-dropzone";
import TextEditor from "../../components/TextEditor";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import { IMeasurementType } from "../../dto/IMeasurementType";
import { IExtraSize } from "../../dto/IExtraSize";
import DialogScreen from "../../components/DialogScreen";
import { objToFormData } from "../../utils/objToFormData";
import { PicturePath } from "../../configuration";
import { COLOR_GOLD } from "../../utils/constants";

export interface IInstructionForm {
  id: string | null;
  name: string;
  description: string;
  totalStep: number;
  patternInstruction: IPatternInstruction[] | null;
  categoryId: string;
  patternFile: string | null;
  fileName: string;
  categoryName?: string;
  mainPictureName: string | null;
  mainPicture: string | null;
  extraSizes: IExtraSize[] | null;
}

const RowGrid = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  marginLeft: "auto",
  marginRight: "auto",
  rowGap: "1rem",
  width: "40rem",
  justifyContent: "center",
});
const ButtonGrid = styled(Grid)({
  display: "flex",
  justifyContent: "end",
  marginTop: "2rem",
});
const ImageGrid = styled(Grid)({
  height: "150px",
});
const StyledImg = styled("img")({
  height: "100%",
  width: "auto",
});
const StyledColumnGrid = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  columnGap: "2rem",
});
const SmallGrid = styled(Grid)({
  width: "20rem",
});
const StyledTypography = styled(Typography)({
  border: `5px solid ${COLOR_GOLD}`,
  padding: "1rem",
});
const StyledButtonGrid = styled(Grid)({
  width: "15rem",
});
const DropZoneContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "isError" && prop !== "required",
})<{
  isError?: boolean;
  required?: boolean;
}>(({ isError, required }) => ({
  "& .MuiSnackbar-root": {
    whiteSpace: "pre",
  },
  "& .MuiDropzonePreviewList-imageContainer": {
    paddingTop: "18px !important",
  },
  "& .MuiDropzonePreviewList-root": {
    marginTop: "0px !important",
  },
  "& .MuiDropzoneArea-root": {
    border: "solid 1px",
    padding: "10px",
    borderColor: isError ? "#d32f2f" : "#c4c4c4",
  },
  "& .MuiSvgIcon-root": {
    color: isError ? "#d32f2f" : "#c4c4c4",
  },
  "& .MuiFormHelperText-root": {
    color: "#d32f2f",
    marginLeft: "14px",
  },
  "& p.MuiTypography-root": {
    font: "inherit",
    color: isError ? "#d32f2f" : "inherit",
    "&::after": {
      content: required ? '" *"' : '""',
      color: isError ? "#d32f2f" : "inherit",
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const ContentContainer = styled(Box)(() => ({
  width: "585px",
}));
export const ACCEPTED_IMAGE_FILE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
];

export interface IImageList {
  step: number;
  img: string | null;
  file: string | null;
}
export const MAX_IMAGE_SIZE_BYTES = 1000000;

const InstructionCreate = () => {
  const appState = useContext(AppContext);
  const [categories, setCategories] = useState<ICategory[]>([] as ICategory[]);
  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState<IMeasurementType[]>(
    [] as IMeasurementType[]
  );
  const [measurementsForExtra, setMeasurementsForExtra] = useState<
    IMeasurementType[]
  >([] as IMeasurementType[]);

  const { id } = useParams();

  const {
    control,
    setError,
    setValue,
    getValues,
    getFieldState,
    clearErrors,
    watch,
  } = useForm<IInstructionForm>({
    defaultValues: {
      name: "",
      description: "",
      totalStep: 0,
      patternInstruction: null,
      categoryId: "",
      fileName: "",
      patternFile: "",
      categoryName: "",
      mainPicture: "",
      mainPictureName: null,
      extraSizes: null,
    },
  });
  const navigate = useNavigate();
  const [imageDialogState, setImageDialogState] = useState<{
    open: boolean;
    index: number | null;
  }>({
    open: false,
    index: null,
  });
  const [expanded, setExpanded] = useState<string | false>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [modalState, setModalState] = useState<{
    open: boolean;
    index: number | null;
  }>({
    open: false,
    index: null,
  });

  const [imageUrL, setImageURL] = useState<IImageList[]>([] as IImageList[]);

  const handleDropzoneClose = () => {
    setImageDialogState({ open: false, index: null });
  };

  const loadData = useCallback(async () => {
    let typesResult = await BaseService.getAll<IMeasurementType>(
      "/MeasurementTypes",
      appState.token!
    );

    if (typesResult.ok && typesResult.data) {
      setMeasurements(typesResult.data);
      setMeasurementsForExtra(typesResult.data);
    }
    let result = await BaseService.getAll<ICategory>(
      "/Categories",
      appState.token!
    );

    if (result.ok && result.data) {
      setCategories(result.data);
    }

    if (id !== undefined) {
      let result = await BaseService.get<IInstructionForm>(
        "/Instructions/" + id,
        appState.token!
      );

      if (result.ok && result.data) {
        let patternResult = await BaseService.getAll<IPatternInstruction>(
          "/PatternInstructions/instructionId/" + id,
          appState.token!
        );
        if (patternResult.ok && patternResult.data) {
          setValue("patternInstruction", patternResult.data);
        } else {
          console.log("ei saanud");
        }
        let extraResult = await BaseService.getAll<IExtraSize>(
          "/ExtraSizes/instructionId/" + id,
          appState.token!
        );
        if (extraResult.ok && extraResult.data) {
          setValue("extraSizes", extraResult.data);
        } else {
          console.log("ei saanud");
        }
        setValue("name", result.data.name);
        setValue("categoryId", result.data.categoryId);
        setValue("description", result.data.description);
        setValue("fileName", result.data.fileName);
        setValue("mainPicture", result.data.mainPicture);
        setValue("mainPictureName", result.data.mainPictureName);
      }
    }
  }, [appState]);

  const saveFile = (e: any) => {
    setValue("fileName", e.target.files[0].name);
    setValue("patternFile", e.target.files[0]);
  };
  const handleFileDelete = () => {
    setValue("fileName", "");
    setValue("patternFile", null);
  };

  const saveImage = (e: any) => {
    setValue("mainPicture", e.target.files[0]);
    setValue("mainPictureName", e.target.files[0].name);
  };
  const handleImageDelete = () => {
    setValue("mainPicture", null);
    setValue("mainPictureName", null);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const addNewStep = () => {
    console.log(getValues());
    setStep(step + 1);
  };
  const removeStep = () => {
    if (step !== 0) {
      setStep(step - 1);
    }
  };

  const insertPatternInstruction = async (data: IPatternInstruction) => {
    const url = "/PatternInstructions";
    let response = await FormDataService.post(
      url,
      objToFormData(data),
      appState.token!
    );

    if (response.statusCode >= 200 && response.statusCode < 400) {
      return;
    } else {
      console.log("error");
    }
  };

  const insertExtraSizes = async (data: IExtraSize) => {
    const url = "/ExtraSizes";

    console.log(data);
    let response = await BaseService.post(url, data, appState.token!);

    if (response.statusCode >= 200 && response.statusCode < 400) {
      return;
    } else {
      console.log("error");
    }
  };

  const updateData = async (instruction: IInstructionForm) => {
    for (const each of getValues("patternInstruction")!) {
      each.instructionId = instruction.id as string;
      each.picture = each.pictureName;
      await insertPatternInstruction(each);
    }
    if (getValues("extraSizes") !== null) {
      for (const element of getValues("extraSizes")!) {
        element.instructionId = instruction.id as string;
        await insertExtraSizes(element);
      }
    }
  };

  const savePattern = async () => {
    setValue("totalStep", step);
    if (getValues("name") === "") {
      setError("name", {
        type: "manual",
        message: "Lõike nimetuse lisamine on kohustuslik.",
      });
      return false;
    }

    if (getValues("patternFile") === "") {
      setErrorMessage("Lõikefaili sisestamine on kohustuslik.");
      return false;
    }

    if (getValues("categoryId") === "") {
      setError("categoryId", {
        type: "manual",
        message: "Kategooria valimine on kohustuslik.",
      });
      return false;
    }
    if (getValues("patternInstruction") !== null) {
      let count = 0;
      for (const item of getValues("patternInstruction")!) {
        if (item.title === null) {
          setError(`patternInstruction.${count}.title`, {
            type: "manual",
            message: "Pealkirja sisestamine on kohustuslik.",
          });
          return false;
        }
        if (item.description === null) {
          setError(`patternInstruction.${count}.description`, {
            type: "manual",
            message: "Juhendi sisestamine on kohustuslik.",
          });
          return false;
        }
        count = count + 1;
      }
    }

    let stepperStep = 0;

    for (const value of getValues("patternInstruction")!) {
      setValue(`patternInstruction.${stepperStep}.step`, stepperStep);
      stepperStep = stepperStep + 1;
    }

    if (getValues("id") === undefined) {
      const url = "/Instructions";

      let response = await FormDataService.post(
        url,
        objToFormData(getValues()),
        appState.token!
      );

      if (response.statusCode >= 200 && response.statusCode < 400) {
        const instruction = response.data as unknown as IInstructionForm;

        await updateData(instruction);

        navigate("/instruction");
      } else {
        console.log("error");
      }
    } else {
      /* const url = "/Instructions";

      let response = await FormDataService.edit(
          url,
          objToFormData(getValues()),
          appState.token!
      );

      if (response.statusCode >= 200 && response.statusCode < 400) {
        await updateData(getValues())
      }*/
    }
  };

  const handlePictureDialogOpen = (index: number) => {
    setImageDialogState({ open: true, index: index });
  };

  const handlePictureDialogClose = () => {
    setImageDialogState({ open: false, index: null });
  };

  const handlePictureDelete = (index: number) => {
    const newArray = [...imageUrL];
    const a = imageUrL.findIndex((item) => item.step === index);

    newArray[a].img = null;
    newArray[a].file = null;
    setImageURL(newArray);
  };

  const getImageStep = (index: number) => {
    for (const item of imageUrL) {
      if (item.step === index) {
        return item;
      }
    }
    return null;
  };
  const handleUploadImagesDialogSubmit = () => {
    const image = getValues(
      `patternInstruction.${imageDialogState.index!}.picture`
    );
    console.log(image);

    setValue(
      `patternInstruction.${imageDialogState.index!}.pictureName`,
      image![0]
    );

    console.log(getValues());

    handlePictureDialogClose();
  };

  const handleNewSelectList = () => {
    if (getValues("extraSizes") !== null) {
      const listLength = getValues("extraSizes")!.length;
      setValue(`extraSizes.${listLength}.name`, "");
    } else {
      setValue(`extraSizes.${0}.name`, "");
    }
  };
  const handleClose = () => {
    setModalState({ open: false, index: null });
  };
  const handleExtraDelete = () => {
    setValue(`extraSizes.${modalState.index!}.name`, "delete");
    const filteredData = getValues("extraSizes")!.filter(
      (x) => x.name !== "delete"
    );
    setValue("extraSizes", filteredData);
    setModalState({ open: false, index: null });
  };
  const handleDialogScreen = (index: number) => {
    setModalState({ open: true, index: index });
  };

  const getImageUrl = (image: string) => {
    return URL.createObjectURL(image as unknown as MediaSource);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"layoutContainer"}>
      <RowGrid>
        <Typography variant={"h3"}>Uue lõike sisestamine</Typography>

        {errorMessage.length > 1 ? (
          <AlertComponent
            message={errorMessage}
            show={true}
            type={EAlertClass.Danger}
            paddingSide={false}
          />
        ) : null}
        <DialogScreen handleClose={handleClose} isOpened={modalState.open}>
          <Grid className={"formGrid"}>
            <AlertComponent
              message={"Kas olete kindel, et soovite kustutada avaruslisa: "}
              boldText={getValues("name")}
              show={true}
              paddingSide={false}
              type={EAlertClass.Danger}
            />

            <Grid className={"formButton"}>
              <BasicButton
                btnType={"red"}
                label={"Kustuta"}
                onClick={handleExtraDelete}
              />
            </Grid>
          </Grid>
        </DialogScreen>
        <SmallGrid>
          <Controller
            control={control}
            name={"categoryId"}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl variant="standard" fullWidth error={!!error}>
                <InputLabel id="demo-simple-select-standard-label">
                  Kategooria*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    clearErrors("categoryId");
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {getFieldState("categoryId").invalid && (
                  <FormHelperText>
                    {getFieldState("categoryId")!.error!.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
            rules={{
              required: "Kategooria valimine on kohustuslik.",
            }}
          />
        </SmallGrid>
        <Grid>
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
                label={"Lõike nimetus*"}
                value={value}
                variant="standard"
                onChange={(e: any) => {
                  clearErrors(name);
                  onChange(e);
                }}
              />
            )}
            rules={{
              required: "Lõike nimetuse sisestamine on kohustuslik.",
            }}
          />
        </Grid>
        <Grid>
          <Controller
            control={control}
            name="description"
            render={({
              field: { onChange, value, name },
              fieldState: { error },
            }) => (
              <TextField
                error={!!error}
                fullWidth
                helperText={error ? error.message : null}
                label={"Lõike kirjeldus*"}
                value={value}
                multiline
                variant="standard"
                onChange={(e: any) => {
                  clearErrors(name);
                  onChange(e);
                }}
              />
            )}
            rules={{
              required: "Lõike kirjelduse sisestamine on kohustuslik.",
            }}
          />
        </Grid>
        {watch("extraSizes") !== null
          ? getValues("extraSizes")!.map((item, i) => (
              <StyledColumnGrid key={i}>
                <Controller
                  control={control}
                  name={`extraSizes.${i}.name`}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl variant="standard" fullWidth error={!!error}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Mõõt
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={value === undefined ? "" : value}
                        onChange={(e) => {
                          onChange(e);
                        }}
                      >
                        {measurementsForExtra.map((measurement) => (
                          <MenuItem
                            key={measurement.id}
                            value={measurement.dbName}
                          >
                            {measurement.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  control={control}
                  name={`extraSizes.${i}.extra`}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      fullWidth
                      type={"number"}
                      label={"Avaruslisa suurus (cm)"}
                      value={value === undefined || value === null ? "" : value}
                      variant="standard"
                      onChange={(e) => {
                        setValue(
                          `extraSizes.${i}.extra`,
                          parseInt(e.target.value)
                        );
                      }}
                    />
                  )}
                />

                <BasicButton
                  btnType={"borderRed"}
                  iconType={"delete"}
                  onClick={() => handleDialogScreen(i)}
                />
              </StyledColumnGrid>
            ))
          : null}
        <StyledTypography>
          Vali lisa kehamõõt lisamaks kõik vajalikud kehamõõdud, mida on vaja
          lõike suuruste arvutamisel. Saad lisada avaruslisa juurde neile
          mõõtudele, millele seda vaja on!
        </StyledTypography>
        <StyledButtonGrid>
          <BasicButton
            btnType={"yellow"}
            label={"Lisa kehamõõt"}
            onClick={() => handleNewSelectList()}
          />
        </StyledButtonGrid>
        <Grid>
          {watch("fileName") !== "" ? (
            <>
              <StyledColumnGrid>
                <Typography variant={"body1"}>Lisatud fail:</Typography>
                <Typography variant={"body1"}>{watch("fileName")}</Typography>
              </StyledColumnGrid>
            </>
          ) : null}
          {watch("fileName") === "" ? (
            <Button component={"label"} disableRipple id={"file-upload-btn"}>
              <input
                accept={"application/pdf"}
                hidden
                type={"file"}
                onChange={(e) => {
                  saveFile(e);
                }}
              />
              <Typography variant={"body1"}>Lisa fail</Typography>
            </Button>
          ) : (
            <BasicButton
              btnType={"transparent"}
              label={"Eemalda fail"}
              paddingSide={0}
              onClick={handleFileDelete}
            />
          )}
        </Grid>
        <Grid>
          {watch("mainPictureName") === null ? (
            <>
              <Button component={"label"} disableRipple id={"file-upload-btn"}>
                <input
                  accept={"image/*"}
                  hidden
                  type={"file"}
                  onChange={(e) => {
                    saveImage(e);
                  }}
                />
                <Typography variant={"body1"}>Lisa esilehe pilt</Typography>
              </Button>
            </>
          ) : (
            <>
              {id === undefined ? (
                <ImageGrid>
                  <StyledImg src={getImageUrl(watch("mainPicture")!)} />
                </ImageGrid>
              ) : (
                <ImageGrid>
                  <StyledImg
                    src={`${PicturePath}${watch("mainPictureName")}`}
                  />
                </ImageGrid>
              )}
              <Grid>
                <BasicButton
                  btnType={"transparent"}
                  label={"Eemalda pilt"}
                  paddingSide={0}
                  onClick={handleImageDelete}
                />
              </Grid>
            </>
          )}
        </Grid>

        {[...Array(step)].map((x, i) => (
          <Grid key={i}>
            <Accordion
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Samm {i + 1}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid>
                  <Controller
                    control={control}
                    name={`patternInstruction.${i}.title`}
                    render={({
                      field: { onChange, value, name },
                      fieldState: { error },
                    }) => (
                      <TextField
                        error={!!error}
                        fullWidth
                        helperText={error ? error.message : null}
                        label={"Pealkiri*"}
                        value={value === null ? "" : value}
                        variant="standard"
                        onChange={(e: any) => {
                          clearErrors(name);
                          onChange(e);
                        }}
                      />
                    )}
                    rules={{
                      required: "Pealkirja sisestamine on kohustuslik.",
                    }}
                  />
                </Grid>
                {watch(`patternInstruction.${i}.pictureName`) !== undefined &&
                watch(`patternInstruction.${i}.pictureName`) !== null &&
                watch(`patternInstruction.${i}`) !== null ? (
                  <>
                    {id === undefined ? (
                      <ImageGrid>
                        <StyledImg
                          src={URL.createObjectURL(
                            watch(
                              `patternInstruction.${i}.pictureName`
                            )! as unknown as MediaSource
                          )}
                        />
                      </ImageGrid>
                    ) : (
                      <ImageGrid>
                        <StyledImg
                          src={`${PicturePath}${watch(
                            `patternInstruction.${i}.pictureName`
                          )}`}
                        />
                      </ImageGrid>
                    )}
                    <BasicButton
                      btnType={"transparent"}
                      label={"Eemalda pilt"}
                      paddingSide={0}
                      onClick={() => {
                        setValue(`patternInstruction.${i}.pictureName`, null);
                        setValue(`patternInstruction.${i}.picture`, null);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <BasicButton
                      endIcon={<AddCircleIcon />}
                      btnType={"transparent"}
                      label={"Lisa pilt"}
                      paddingSide={0}
                      onClick={() => handlePictureDialogOpen(i)}
                    />
                  </>
                )}

                {/*<Grid>
                  {getImageStep(i) !== null && getImageStep(i)!.img !== null ? (
                    <Grid key={getImageStep(i)!.img}>
                      <img src={getImageStep(i)!.img!} />
                      <BasicButton
                        btnType={"black"}
                        iconType={"close"}
                        paddingSide={0}
                        onClick={() => {
                          handlePictureDelete(i);
                        }}
                      />
                    </Grid>
                  ) : null}
                </Grid>*/}

                <Grid>
                  <Dialog
                    fullWidth={false}
                    maxWidth="xl"
                    open={imageDialogState.open}
                    onClose={handleDropzoneClose}
                  >
                    <DialogTitle {...({ component: "div" } as any)}>
                      <Typography component="h1" variant="h4">
                        Pilt
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <ContentContainer component="form" id="add-files-form">
                        <Controller
                          control={control}
                          name={`patternInstruction.${i}.picture`}
                          render={({
                            field: { onChange },
                            fieldState: { error, invalid },
                          }) => (
                            <DropZoneContainer isError={invalid}>
                              <DropzoneArea
                                acceptedFiles={ACCEPTED_IMAGE_FILE_TYPES}
                                dropzoneText={"Lisa või lohista pilt siia"}
                                filesLimit={1}
                                getDropRejectMessage={(
                                  rejectedFile: File,
                                  acceptedFiles: string[],
                                  maxFileSize: number
                                ) => {
                                  return `${"common.fail"} ${
                                    rejectedFile.name
                                  } ${"common.rejected"}\n"Lubatud failisuurus:" ${maxFileSize}\n
                      "Lubatud failitüübid:"
                    \n ${acceptedFiles.join(",\n")}`;
                                }}
                                getFileLimitExceedMessage={(
                                  filesLimit: number
                                ) => {
                                  return `"Maksimaalne failide arv" ${filesLimit}`;
                                }}
                                maxFileSize={MAX_IMAGE_SIZE_BYTES}
                                showAlerts={["error", "success"]}
                                showFileNames={true}
                                showPreviews={false}
                                showPreviewsInDropzone
                                onChange={(files) => onChange(files)}
                              />
                            </DropZoneContainer>
                          )}
                          rules={{ required: true }}
                        />
                      </ContentContainer>
                    </DialogContent>
                    <DialogActions>
                      <BasicButton
                        label={"Sulge"}
                        btnType={"red"}
                        onClick={handleDropzoneClose}
                      />

                      <BasicButton
                        color="primary"
                        form="add-files-form"
                        onClick={handleUploadImagesDialogSubmit}
                        variant="contained"
                        btnType={"black"}
                        label={"Salvesta"}
                      />
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid>
                  <Controller
                    control={control}
                    name={`patternInstruction.${i}.description`}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { error },
                    }) => (
                      <TextEditor
                        error={!!error}
                        helperText={error?.message}
                        reference={ref}
                        title={"Õpetus"}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                    rules={{
                      required: "Õpetuse lisamine on kohustuslik.",
                    }}
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}

        <ButtonGrid>
          <BasicButton
            btnType={"yellow"}
            label={"Lisa uus samm "}
            onClick={addNewStep}
          />
          <BasicButton
            btnType={"red"}
            label={"Eemalda samm"}
            onClick={removeStep}
          />
        </ButtonGrid>
        <ButtonGrid>
          <BasicButton
            btnType={"black"}
            label={"Salvesta"}
            onClick={savePattern}
          />
        </ButtonGrid>
      </RowGrid>
    </Grid>
  );
};
export default InstructionCreate;
