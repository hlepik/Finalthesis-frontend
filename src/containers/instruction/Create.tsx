import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { IPatternInstruction } from "../../dto/IPatternInstruction";
import { BaseService } from "../../service/base-service";
import { ICategory } from "../../dto/ICategory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BasicButton from "../../components/BasicButton";
import { IFile } from "../../dto/IFile";

export interface IInstructionForm {
  name: string;
  totalStep: number;
  patternInstruction: IPatternInstruction[] | null;
  categoryId: string;
  patternFile: string | null;
  fileName: string;
}

const RowGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));
const ButtonGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "end",
  marginTop: "2rem",
}));

const InstructionCreate = () => {
  const appState = useContext(AppContext);
  const [categories, setCategories] = useState<ICategory[]>([] as ICategory[]);
  const [step, setStep] = useState(1);
  const [expanded, setExpanded] = useState<string | false>(false);

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    getFieldState,
    clearErrors,
    watch,
    reset,
  } = useForm<IInstructionForm>({
    defaultValues: {
      name: "",
      totalStep: 0,
      patternInstruction: null,
      categoryId: "",
      fileName: "",
      patternFile: "",
    },
  });

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<ICategory>(
      "/Categories",
      appState.token!
    );

    if (result.ok && result.data) {
      setCategories(result.data);
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

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const addNewStep = () => {
    setStep(step + 1);
  };
  const removeStep = () => {
    if (step !== 0) {
      setStep(step - 1);
    }
  };
  const savePattern = () => {
    setValue("totalStep", step);
    // TODO: send data to BE
  };

  const editImages = (images: IFile[]) => {
    DiscountsService.putFiles(Number(id), images)
      .then((updatedImages) => {
        setImages(updatedImages);
        useSnackbar(t("common.images"), "success", "put");
      })
      .catch((err) => {
        useSnackbar(t("common.images"), "error", "put", err);
      });
  };

  const deleteImage = (imageId: string) => {
    FileService.delFile(imageId)
      .then(() => {
        setImages((prevState) => [
          ...prevState.filter((image) => image.id !== imageId),
        ]);
        useSnackbar(t("common.image"), "success", "del");
      })
      .catch((err) => {
        useSnackbar(t("common.image"), "error", "del", err);
      });
  };

  const handleUploadImagesDialogClose = (resetForm: () => void) => {
    resetForm();
    setImagesUploadDialogState(false);
  };

  const handleUploadImagesDialogSubmit = (
    discountId: number | null | string,
    imagesFD: FormData,
    resetForm: () => void
  ) => {
    if (discountId !== null) {
      DiscountsService.saveFile(Number(discountId), imagesFD)
        .then((files) => {
          setImages(files as IFile[]);
          handleUploadImagesDialogClose(resetForm);
          useSnackbar(t("discounts.detail.pictures"), "success", "post");
        })
        .catch((err) => {
          useSnackbar(t("discounts.detail.pictures"), "error", "post", err);
        });
      handleUploadImagesDialogClose(resetForm);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"PageContainer"}>
      <RowGrid>
        <Typography variant={"h3"}>Uue lõike sisestamine</Typography>

        <Grid>
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
              required: "Mõõtühiku valimine on kohustuslik.",
            }}
          />
        </Grid>
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
                onChange={(e) => {
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
          {watch("fileName") !== "" ? (
            <>
              <Typography variant={"body1"}>Lisatud fail:</Typography>
              <Typography variant={"body1"}>{watch("fileName")}</Typography>
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
              onClick={handleFileDelete}
            />
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
                        onChange={(e) => {
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
                <Grid>
                  <UploadDialog
                    fileTypes={ACCEPTED_IMAGE_FILE_TYPES}
                    isOpened={imagesUploadDialogState}
                    maxFileSize={MAX_IMAGE_SIZE_BYTES}
                    multiple
                    parentId={Number(id)}
                    title={t("discounts.detail.addPictures")}
                    onClose={handleUploadImagesDialogClose}
                    onSubmit={handleUploadImagesDialogSubmit}
                  />
                </Grid>
                <Grid>
                  <Controller
                    control={control}
                    name={`patternInstruction.${i}.description`}
                    render={({
                      field: { onChange, value, name },
                      fieldState: { error },
                    }) => (
                      <TextareaAutosize
                        aria-label="minimum height"
                        value={value === null ? "" : value}
                        minRows={3}
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
