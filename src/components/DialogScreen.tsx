import { FC, ReactEventHandler, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogProps, Grid } from "@mui/material";
import BasicButton from "./BasicButton";
import { IBodyMeasurements } from "../dto/IBodyMeasurements";

export interface IDialogScreen {
  isOpened: boolean;
  handleClose?: ReactEventHandler<{}>;
  width?: string;
  fullWidth?: boolean;
  token?: string;
  data?: IBodyMeasurements;
}

const DialogScreen: FC<IDialogScreen> = ({
  children,
  isOpened,
  handleClose,
  width,
  fullWidth,
}) => {
  const contentRef = useRef<any>(null);
  useEffect(() => {
    if (isOpened) {
      const { current: descriptionElement } = contentRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpened]);
  return (
    <Dialog
      aria-describedby="scroll-dialog-description"
      aria-labelledby="scroll-dialog-title"
      open={isOpened}
      fullWidth={fullWidth}
      maxWidth={fullWidth ? "xl" : "md"}
    >
      <Grid className="StyledDialog">
        <Grid className="closeButton">
          <BasicButton
            id={"dialogButton"}
            btnType={"borderGray"}
            iconType={"close"}
            onClick={handleClose}
          />
        </Grid>

        <DialogContent>{children}</DialogContent>
      </Grid>
    </Dialog>
  );
};

export default DialogScreen;
