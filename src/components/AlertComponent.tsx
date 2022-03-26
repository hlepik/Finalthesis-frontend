import Alert from "@mui/material/Alert";
import { FC } from "react";
import { Grid } from "@mui/material";
export enum EAlertClass {
  Success = "success",
  Danger = "error",
  Warning = "warning",
  Info = "info",
}
interface ErrorValues {
  message: string;
  show: boolean;
  type: EAlertClass;
  boldText?: string;
  paddingSide: boolean;
}

const AlertComponent: FC<ErrorValues> = ({
  message,
  show,
  type,
  boldText,
  paddingSide,
}) => {
  return show ? (
    <Grid className={paddingSide ? "DialogAlert" : "NoPaddingAlert"}>
      <Alert severity={type}>
        {message}
        <strong>{boldText}</strong>
      </Alert>
    </Grid>
  ) : null;
};

export default AlertComponent;
