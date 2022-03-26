import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Typography,
  styled,
} from "@mui/material";
import React, { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DropzoneArea } from "react-mui-dropzone";

import { MAXIMUM_FILES_TO_UPLOAD } from "../configuration";
import { objToFormData } from "../utils/objToFormData";

const ContentContainer = styled(Box)(() => ({
  width: "585px",
}));

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

export interface IUploadContractDialog {
  onClose: (resetFormState: () => void) => void;
  onSubmit: (
    merchantId: number | string | null,
    fileFD: FormData,
    resetFormState: () => void
  ) => void;
  isOpened: boolean;
  title?: string;
  description?: string;
  fileTypes: string[];
  maxFileSize: number;
  multiple?: boolean;
  parentId: number | string | null;
}

interface IFormState {
  file: File | File[] | null;
}

const UploadDialog: FC<IUploadContractDialog> = ({
  fileTypes,
  maxFileSize,
  onClose,
  onSubmit,
  isOpened,
  parentId,
  multiple,
  title,
  description,
}) => {
  const { t } = useTranslation("translation");

  const { handleSubmit, control, reset, clearErrors } = useForm<IFormState>({
    defaultValues: {
      file: null,
    },
  });

  const resetForm = () => {
    reset({
      file: null,
    });
    clearErrors();
  };

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [isOpened]);

  const handleClose = () => {
    resetForm();
    onClose(resetForm);
  };

  const formSubmitHandler: SubmitHandler<IFormState> = (
    formData: IFormState
  ) => {
    onSubmit(parentId, objToFormData(formData), resetForm);
  };

  return (
    <Dialog
      fullWidth={false}
      maxWidth="xl"
      open={isOpened}
      onClose={handleClose}
    >
      <DialogTitle {...({ component: "div" } as any)}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ContentContainer
          component="form"
          id="add-files-form"
          onSubmit={handleSubmit(formSubmitHandler)}
        >
          <Controller
            control={control}
            name="file"
            render={({
              field: { onChange },
              fieldState: { error, invalid },
            }) => (
              <DropZoneContainer isError={invalid}>
                <DropzoneArea
                  acceptedFiles={fileTypes}
                  dropzoneText={
                    description || multiple
                      ? t("common.browseFiles")
                      : t("common.browseFile")
                  }
                  filesLimit={multiple ? MAXIMUM_FILES_TO_UPLOAD : 1}
                  getDropRejectMessage={(
                    rejectedFile: File,
                    acceptedFiles: string[],
                    maxFileSize: number
                  ) => {
                    return `${t("common.fail")} ${rejectedFile.name} ${t(
                      "common.rejected"
                    )}\n${t("common.allowed.fileSize")}: ${maxFileSize}\n${t(
                      "common.allowed.fileTypes"
                    )}:\n ${acceptedFiles.join(",\n")}`;
                  }}
                  getFileAddedMessage={(fileName: string) => {
                    return `${t("common.fail")} ${fileName} ${t(
                      "common.successfullyAdded"
                    )}\n`;
                  }}
                  getFileLimitExceedMessage={(filesLimit: number) => {
                    return `${t("common.rejected.filesCount")} ${filesLimit}`;
                  }}
                  maxFileSize={maxFileSize}
                  showAlerts={["error", "success"]}
                  showFileNames={true}
                  showPreviews={false}
                  showPreviewsInDropzone
                  onChange={(files) => onChange(multiple ? files : files[0])}
                />
                {error?.message && (
                  <FormHelperText>
                    {t("common.validation.messages.required.file")}
                  </FormHelperText>
                )}
              </DropZoneContainer>
            )}
            rules={{ required: true }}
          />
        </ContentContainer>
      </DialogContent>
      <DialogActions>
        <BasicButton color="primary" variant="outlined" onClick={handleClose}>
          {t("common.close")}
        </BasicButton>
        <BasicButton
          color="primary"
          form="add-files-form"
          type="submit"
          variant="contained"
        >
          {t("common.save")}
        </BasicButton>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
