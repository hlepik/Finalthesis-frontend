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
import { map, round } from "lodash";
import { IUnit } from "../../dto/IUnit";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { Link } from "react-router-dom";

const ImageGrid = styled(Grid)(({ theme }) => ({
    height: "auto",
    width: "400px",
    [theme.breakpoints.down("lg")]: {
        width: "300px",
    },
    [theme.breakpoints.down("md")]: {
        width: "auto",
    },
}));
const StepperImageGrid = styled(Grid)({
    height: "auto",
    width: "450px",
});
const StyledUserGrid = styled(Grid)({
    border: "2rem solid rgba(247, 216, 123, 0.4)",
    margin: "2rem",
    padding: "1rem",
});
const ColumnGrid = styled(Grid)({
    display: "flex",
    flexDirection: "row",
    columnGap: "1rem",
    justifyContent: "center",
});
const StyledTitle = styled(Typography)({
    fontWeight: 600,
});
const StyledTitle2 = styled(Typography)({
    fontWeight: 600,
    marginBottom: "2rem",
});
const BoldText = styled(Typography)({
    fontWeight: 600,
    marginBottom: "8px",
});
const MeasurementText = styled(Typography)({
    marginBottom: 0,
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
    const [instructionPattern, setInstructionPattern] = useState<IInstruction>({} as IInstruction);
    const [modalState, setModalState] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [canRender, setCanRender] = useState(false);
    const [userStep, setUserStep] = useState<IUserPattern>({} as IUserPattern);
    const [hasStarted, setHasStarted] = useState(false);
    const [unit, setUnit] = useState<IUnit>({} as IUnit);
    const [alertMessage, setAlertMessage] = useState("");

    const [userMeasurements, setUserMeasurements] = useState<IBodyMeasurements>({} as IBodyMeasurements);
    const [hasCalculatedMeasurements, setHasCalculatedMeasurements] = useState(false);

    const loadData = useCallback(async () => {
        let result = await BaseService.get<IInstruction>("/Instructions/" + id, appState.token!);
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
            let resultData = await BaseService.get<IUserPattern>("/UserPatterns/" + id, appState.token!);
            if (resultData.ok && resultData.data) {
                setUserStep(resultData.data);
                setHasStarted(true);
            } else {
                setHasStarted(false);
            }
        }
    }, [appState]);

    const getRole = () => {
        if (appState.token !== null) {
            const info = JSON.parse(atob(appState.token!.split(".")[1]));
            return info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
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
        await BaseService.post<IUserPattern>("/UserPatterns", userStep, appState.token!);
    };

    const updateUserData = async (hasFinished: boolean) => {
        const newUserData = userStep;
        newUserData.stepCount = activeStep;
        newUserData.hasDone = hasFinished;
        setUserStep(newUserData);
        await BaseService.edit<IUserPattern>("/UserPatterns/" + userStep.id, userStep, appState.token!);
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
        let userData = await BaseService.get<IBodyMeasurements>("/BodyMeasurements/pattern/" + id, appState.token!);
        if (userData.ok && userData.data) {
            let unit = await BaseService.get<IUnit>("/Units/" + userData.data.unitId, appState.token!);
            if (unit.ok && unit.data) {
                setUnit(unit.data);
            }
            setHasCalculatedMeasurements(true);
            setUserMeasurements(userData.data);
        } else {
            setAlertMessage(
                "Teie kehamõõtmeid ei leitud. Lisage kehamõõdud või jätkake juhendiga ilma välja arvutatud suurustega!"
            );
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
                            <StyledImg src={`${PicturePath}${instructionPattern.mainPictureName}`} />
                        </ImageGrid>
                        <TextGrid>
                            <Typography variant={"h3"}>{instructionPattern.name}</Typography>
                            <StyledText variant={"body1"}>{instructionPattern.description}</StyledText>
                        </TextGrid>
                    </RowGrid>
                    {getRole() !== "Admin" ? (
                        <ButtonGrid>
                            <BasicButton btnType={"black"} label={"Alusta"} onClick={checkIfUserLoggedIn} />
                        </ButtonGrid>
                    ) : null}
                </MainGrid>
            ) : null}

            {modalState ? (
                <DialogScreen handleClose={handleDialogScreen} isOpened={modalState} fullWidth>
                    {activeStep === 0 ? (
                        <StyledGrid>
                            <StyledText variant={"body1"}>
                                Allolevale nupule vajutades avaneb lõikefail. Ennem lõikefaili avamist on soovitav lasta
                                programmil välja arvutada vastava lõike suurused, mida seejärel kuvatakse samal lehel.
                                Suuruste järgi tuleb lõikefailil märkida väljaarvutatud suuruste kohad ja seejärel välja
                                lõigata lõige. Kui eelpool mainitud on sooritatud, siis võib edasi minna.
                            </StyledText>
                            <StyledText errorMessage={true}>
                                Sama lõike puhul saab lasta programmil välja arvutada suurused vaid korra, seega veendu,
                                et sisestatud kehamõõdud on korrektsed!
                            </StyledText>
                            {alertMessage !== "" && (
                                <>
                                    <AlertComponent
                                        show={alertMessage !== ""}
                                        message={alertMessage}
                                        type={EAlertClass.Danger}
                                        paddingSide={false}
                                    />
                                    <Link to={"/andmed"}>Sisesta kehamõõdud</Link>
                                </>
                            )}
                            {hasCalculatedMeasurements ? (
                                <>
                                    <StyledUserGrid>
                                        <StyledTitle2 variant={"h3"}>
                                            Kasutaja mõõdud lõike suuruse valimisel
                                        </StyledTitle2>

                                        {userMeasurements.waistGirth > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Vööümbermõõt:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.waistGirth, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.chestGirth > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Rinnaümbermõõt:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.chestGirth, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.upperHipGirth > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Ülemise puusa ümbermõõt:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.upperHipGirth, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.waistLengthFirst > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Tuharavoldi pikkus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.waistLengthFirst, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.hipGirth > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Puusaümbermõõt:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.hipGirth, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.waistLengthSec > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Vööjoone kõrgus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.waistLengthSec, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}

                                        {userMeasurements.frontLength > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Esipikkus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.frontLength, 1)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.chestHeight > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Rinnakõrgus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.chestHeight!, 0)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.backLength > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Seljapikkus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.backLength!, 0)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.backWidth > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Seljalaius:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.backWidth!, 0)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.armholeLength > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Käeaugukaare sügavus:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.armholeLength!, 0)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                        {userMeasurements.armHoleWidth !== undefined &&
                                            userMeasurements.armHoleWidth > 0 && (
                                                <ColumnGrid>
                                                    <BoldText variant={"h4"}>Käeaugukaare laius:</BoldText>
                                                    <MeasurementText variant={"h4"}>
                                                        {round(userMeasurements.armHoleWidth!, 0)} {unit.shortName}
                                                    </MeasurementText>
                                                </ColumnGrid>
                                            )}
                                        {userMeasurements.inTake !== undefined && userMeasurements.inTake! > 0 && (
                                            <ColumnGrid>
                                                <BoldText variant={"h4"}>Sissevõtted:</BoldText>
                                                <MeasurementText variant={"h4"}>
                                                    {round(userMeasurements.inTake!, 0)} {unit.shortName}
                                                </MeasurementText>
                                            </ColumnGrid>
                                        )}
                                    </StyledUserGrid>
                                </>
                            ) : null}
                            <StyledButton>
                                <BasicButton btnType={"black"} label={"Ava lõikefail"} onClick={saveFile} />
                                <BasicButton
                                    btnType={"yellow"}
                                    label={"Arvuta lõike suurused"}
                                    onClick={calculateMeasurements}
                                />
                            </StyledButton>
                        </StyledGrid>
                    ) : (
                        <RowGrid>
                            {instructionPattern.patternInstructions[activeStep - 1].pictureName !== null && (
                                <StepperImageGrid>
                                    <StyledImg
                                        src={`${PicturePath}${
                                            instructionPattern.patternInstructions[activeStep - 1].pictureName
                                        }`}
                                    />
                                </StepperImageGrid>
                            )}
                            <TextGrid>
                                <StyledTitle variant={"h5"}>
                                    {instructionPattern.patternInstructions[activeStep - 1].title}
                                </StyledTitle>

                                <HTMLParser html={instructionPattern.patternInstructions[activeStep - 1].description} />
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
                                        iconType={activeStep !== instructionPattern.totalStep ? "next" : undefined}
                                        label={activeStep === instructionPattern.totalStep ? "Lõpeta" : "Edasi"}
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
