import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BaseService } from "../../service/base-service";
import { Grid, MobileStepper, styled, Typography } from "@mui/material";
import { IInstruction } from "../../dto/IInstruction";
import { useNavigate, useParams } from "react-router-dom";
import { FilePath, PicturePath } from "../../configuration";
import BasicButton from "../../components/BasicButton";
import { theme } from "../../utils/theme";
import DialogScreen from "../../components/DialogScreen";
import { IPatternInstruction } from "../../dto/IPatternInstruction";
import HTMLParser from "../../components/HTMLParser";
import FileSaver from "file-saver";
import { COLOR_BLACK } from "../../utils/constants";
import { IUserPattern } from "../../dto/IUserPattern";
import { IBodyMeasurements } from "../../dto/IBodyMeasurements";

const ImageGrid = styled(Grid)(({ theme }) => ({
  height: "auto",
  width: "450px",
  [theme.breakpoints.down("lg")]: {
    width: "400px",
  },
  [theme.breakpoints.down("md")]: {
    width: "auto",
  },
}));
const StepperImageGrid = styled(Grid)({
  height: "auto",
  width: "550px",
});
const StyledTitle = styled(Typography)({
  marginBottom: "1rem",
});
const StyledImg = styled("img")({
  width: "100%",
  height: "auto",
});
const RowGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  backgroundColor: "rgba(247, 216, 123, 0.4)",
  padding: "1rem",
  margin: "2rem",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));
const ButtonGrid = styled(Grid)({
  display: "flex",
  justifyContent: "flex-end",
  marginRight: "2rem",
});
const TextGrid = styled(Grid)(({ theme }) => ({
  marginLeft: "2rem",
  minWidth: "450px",
  [theme.breakpoints.down("lg")]: {
    minWidth: "auto",
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    marginTop: "1rem",
  },
}));
const StyledText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "errorMessage",
})<{ errorMessage?: boolean }>(({ errorMessage }) => ({
  fontSize: "1.5rem",
  fontWeight: 400,
  lineHeight: "2rem",
  marginTop: "1rem",
  color: errorMessage ? "#D91117" : COLOR_BLACK,
}));
const MainGrid = styled(Grid)({
  marginLeft: "auto",
  marginRight: "auto",
});
const StyledGrid = styled(Grid)({
  width: "60%",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
});
const StyledButton = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  columnGap: "2rem",
  justifyContent: "center",
  marginTop: "3rem",
});
const UserPatternDetail = () => {
  const appState = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructionPattern, setInstructionPattern] = useState<IInstruction>(
    {} as IInstruction
  );
  const [modalState, setModalState] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [canRender, setCanRender] = useState(false);
  const [userStep, setUserStep] = useState<IUserPattern>({} as IUserPattern);
  const [hasStarted, setHasStarted] = useState(false);

  const [userMeasurements, setUserMeasurements] = useState<IBodyMeasurements>(
    {} as IBodyMeasurements
  );
  const [hasCalculatedMeasurements, setHasCalculatedMeasurements] =
    useState(false);

  const loadData = useCallback(async () => {
    let result = await BaseService.get<IInstruction>(
      "/Instructions/" + id,
      appState.token!
    );
    if (result.ok && result.data) {
      const pattern = result.data;
      let response = await BaseService.getAll<IPatternInstruction>(
        "/PatternInstructions/instructionId/" + result.data.id,
        appState.token!
      );
      if (response.ok && response.data) {
        pattern.patternInstructions = response.data;
        setInstructionPattern(pattern);

        setCanRender(true);
      }
    }
    if (activeStep === 0 && !hasStarted && appState.token !== null) {
      let resultData = await BaseService.get<IUserPattern>(
        "/UserPatterns/" + id,
        appState.token!
      );
      if (resultData.ok && resultData.data) {
        setUserStep(resultData.data);
        setHasStarted(true);
      }
    }
  }, [appState]);

  const getRole = () => {
    if (appState.token !== null) {
      const info = JSON.parse(atob(appState.token!.split(".")[1]));
      return info[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    }
    return "";
  };

  const insertUserStep = async (hasFinished: boolean) => {
    const newUserData = userStep;
    newUserData.stepCount = activeStep;
    newUserData.hasDone = hasFinished;
    newUserData.appUserId = appState.id;
    if (id != null) {
      newUserData.instructionId = id;
    }
    setUserStep(newUserData);

    console.log(userStep);
    let response = await BaseService.post<IUserPattern>(
      "/UserPatterns",
      userStep,
      appState.token!
    );
    if (response.ok && response.data) {
      console.log("õnnestus");
    } else {
      console.log("ebaõnnestus");
    }
  };

  const updateUserData = async (hasFinished: boolean) => {
    const newUserData = userStep;
    newUserData.stepCount = activeStep;
    newUserData.hasDone = hasFinished;
    setUserStep(newUserData);

    console.log(userStep);
    let response = await BaseService.edit<IUserPattern>(
      "/UserPatterns/" + userStep.id,
      userStep,
      appState.token!
    );
    if (response.statusCode >= 200 && response.statusCode < 400) {
      console.log("õnnestus");
    } else {
      console.log("ebaõnnestus1");
    }
  };

  const handleDialogScreen = () => {
    setModalState(!modalState);
    if (modalState) {
      if (hasStarted) {
        updateUserData(activeStep === instructionPattern.totalStep);
      } else {
        insertUserStep(activeStep === instructionPattern.totalStep);
      }
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const checkIfUserLoggedIn = () => {
    if (appState.token === null) {
      navigate("/login");
    }
    setModalState(!modalState);
  };
  const saveFile = () => {
    FileSaver.saveAs(FilePath + instructionPattern.fileName, "file");
  };

  const calculateMeasurements = async () => {
    let userData = await BaseService.get<IBodyMeasurements>(
      "/BodyMeasurements/pattern/" + id,
      appState.token!
    );
    if (userData.ok && userData.data) {
      setHasCalculatedMeasurements(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"PageContainer"}>
      {canRender ? (
        <MainGrid>
          <RowGrid>
            <ImageGrid>
              <StyledImg
                src={`${PicturePath}${instructionPattern.mainPictureName}`}
              />
            </ImageGrid>
            <TextGrid>
              <Typography variant={"h3"}>{instructionPattern.name}</Typography>
              <StyledText variant={"body1"}>
                {instructionPattern.description}
              </StyledText>
            </TextGrid>
          </RowGrid>
          {getRole() !== "Admin" ? (
            <ButtonGrid>
              <BasicButton
                btnType={"black"}
                label={"Alusta"}
                onClick={checkIfUserLoggedIn}
              />
            </ButtonGrid>
          ) : null}
        </MainGrid>
      ) : null}

      {modalState ? (
        <DialogScreen
          handleClose={handleDialogScreen}
          isOpened={modalState}
          fullWidth
        >
          {activeStep === 0 ? (
            <StyledGrid>
              <StyledText variant={"body1"}>
                Allolevale nupule vajutades avaneb lõikefail. Ennem lõikefaili
                avamist on soovitav lasta programmil välja arvutada vastava
                lõike suurused, mida seejärel kuvatakse samal lehel. Suuruste
                järgi tuleb lõikefailil märkida väljaarvutatud suuruste kohad ja
                seejärel välja lõigata lõige. Kui eelpool mainitud on
                sooritatud, siis võib edasi minna.
              </StyledText>
              <StyledText errorMessage={true}>
                Sama lõike puhul saab lasta programmil välja arvutada suurused
                vaid korra, seega veendu, et sisestatud kehamõõdud on
                korrektsed!
              </StyledText>
              <StyledButton>
                <BasicButton
                  btnType={"black"}
                  label={"Ava lõikefail"}
                  onClick={saveFile}
                />
                <BasicButton
                  btnType={"yellow"}
                  label={"Arvuta lõike suurused"}
                  onClick={calculateMeasurements}
                />
              </StyledButton>
              {hasCalculatedMeasurements ? (
                <Grid>siia tulevad mõõdud</Grid>
              ) : null}
            </StyledGrid>
          ) : (
            <RowGrid>
              <StepperImageGrid>
                <StyledImg
                  src={`${PicturePath}${
                    instructionPattern.patternInstructions[activeStep - 1]
                      .pictureName
                  }`}
                />
              </StepperImageGrid>
              <TextGrid>
                <StyledTitle variant={"h5"}>
                  {instructionPattern.patternInstructions[activeStep - 1].title}
                </StyledTitle>

                <HTMLParser
                  html={
                    instructionPattern.patternInstructions[activeStep - 1]
                      .description
                  }
                />
              </TextGrid>
            </RowGrid>
          )}

          <MobileStepper
            variant="dots"
            steps={instructionPattern.totalStep + 1}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              <>
                {theme.direction === "rtl" ? (
                  <BasicButton
                    btnType={"transparent"}
                    iconType={"previous"}
                    label={"Tagasi"}
                    onClick={handleNext}
                  />
                ) : (
                  <BasicButton
                    btnType={"transparent"}
                    iconType={
                      activeStep !== instructionPattern.totalStep
                        ? "next"
                        : undefined
                    }
                    label={
                      activeStep === instructionPattern.totalStep
                        ? "Sulge"
                        : "Edasi"
                    }
                    onClick={
                      activeStep === instructionPattern.totalStep
                        ? handleDialogScreen
                        : handleNext
                    }
                  />
                )}
              </>
            }
            backButton={
              <>
                {theme.direction === "rtl" ? (
                  <BasicButton
                    btnType={activeStep === 0 ? "gray" : "transparent"}
                    iconType={"next"}
                    label={"Edasi"}
                    onClick={handleBack}
                  />
                ) : (
                  <BasicButton
                    btnType={activeStep === 0 ? "gray" : "transparent"}
                    iconType={"previous"}
                    onClick={handleBack}
                    label={"Tagasi"}
                    disabled={activeStep === 0}
                  />
                )}
              </>
            }
          />
        </DialogScreen>
      ) : null}
    </Grid>
  );
};

export default UserPatternDetail;
