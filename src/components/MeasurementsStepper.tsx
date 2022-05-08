import { FC, useEffect, useState } from "react";
import { MobileStepper } from "@mui/material";
import DialogScreen, { IDialogScreen } from "./DialogScreen";
import { theme } from "../utils/theme";
import Sitting from "./MeasurementsForms/Sitting";
import Front from "./MeasurementsForms/Front";
import Side from "./MeasurementsForms/Side";
import Back from "./MeasurementsForms/Back";
import BasicButton from "./BasicButton";
import Main from "./MeasurementsForms/Main";
import { BaseService } from "../service/base-service";
import { IBodyMeasurements } from "../dto/IBodyMeasurements";
import { FormProvider, useForm } from "react-hook-form";
import Confirmation from "./MeasurementsForms/Confirmation";
import { IAppUser } from "../dto/IAppUser";

export interface IFormValues {
    userData: IBodyMeasurements;
}
const MeasurementsStepper: FC<IDialogScreen> = ({ isOpened, handleClose, token, data }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [measurements, setMeasurements] = useState({} as IBodyMeasurements);
    const [modalState, setModalState] = useState(false);
    let formMethods = useForm<IFormValues>({
        defaultValues: {
            userData: {
                neckSize: 0,
                chestGirth: 0,
                waistGirth: 0,
                upperHipGirth: 0,
                waistLengthFirst: 0,
                hipGirth: 0,
                waistLengthSec: 0,
                upperArmGirth: 0,
                wristGirth: 0,
                frontLength: 0,
                thighGirth: 0,
                kneeGirth: 0,
                calfGirth: 0,
                ankleGirth: 0,
                insideLegLength: 0,
                armLength: 0,
                shoulderLength: 0,
                armholeLength: 0,
                backWidth: 0,
                waistHeight: 0,
                backLength: 0,
                chestHeight: 0,
                buttockHeight: 0,
                length: 0,
                unitId: "",
                appUserId: "",
            },
        },
    });
    const handleDialogScreen = () => {
        setModalState(!modalState);
    };

    const handleNext = () => {
        isCurrentStepValid().then((isValid) => {
            if (isValid) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                console.log("step is not valid");
            }
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validateApplicantData = () => {
        let isInvalid = false;

        if (formMethods.getValues("userData.length") < 1) {
            formMethods.setError("userData.length", {
                type: "manual",
                message: "Pikkuse väärtus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.unitId") === "") {
            formMethods.setError("userData.unitId", {
                type: "manual",
                message: "Mõõtühiku on kohustuslik.",
            });
            isInvalid = true;
        }
        return !isInvalid;
    };

    const validateFrontData = () => {
        let isInvalid = false;

        if (formMethods.getValues("userData.neckSize") < 1) {
            formMethods.setError("userData.neckSize", {
                type: "manual",
                message: "Kaela ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.chestGirth") < 1) {
            formMethods.setError("userData.chestGirth", {
                type: "manual",
                message: "Rinna ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.waistGirth") < 1) {
            formMethods.setError("userData.waistGirth", {
                type: "manual",
                message: "Vöö ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.waistGirth") < 1) {
            formMethods.setError("userData.waistGirth", {
                type: "manual",
                message: "Vöö ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.upperHipGirth") < 1) {
            formMethods.setError("userData.upperHipGirth", {
                type: "manual",
                message: "Ülemise puusa ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.waistLengthFirst") < 1) {
            formMethods.setError("userData.waistLengthFirst", {
                type: "manual",
                message: "Puusa kõrgus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.hipGirth") < 1) {
            formMethods.setError("userData.hipGirth", {
                type: "manual",
                message: "Puusa ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.waistLengthSec") < 1) {
            formMethods.setError("userData.waistLengthSec", {
                type: "manual",
                message: "Puusa pikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.upperArmGirth") < 1) {
            formMethods.setError("userData.upperArmGirth", {
                type: "manual",
                message: "Käe ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.wristGirth") < 1) {
            formMethods.setError("userData.wristGirth", {
                type: "manual",
                message: "Randme ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.thighGirth") < 1) {
            formMethods.setError("userData.thighGirth", {
                type: "manual",
                message: "Reie ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.frontLength") < 1) {
            formMethods.setError("userData.frontLength", {
                type: "manual",
                message: "Esipikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.kneeGirth") < 1) {
            formMethods.setError("userData.kneeGirth", {
                type: "manual",
                message: "Põlve ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.calfGirth") < 1) {
            formMethods.setError("userData.calfGirth", {
                type: "manual",
                message: "Sääre ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.ankleGirth") < 1) {
            formMethods.setError("userData.ankleGirth", {
                type: "manual",
                message: "Pahkluu ümbermõõt liiga väike.",
            });
            isInvalid = true;
        }
        return !isInvalid;
    };

    const validateBackData = () => {
        let isInvalid = false;

        if (formMethods.getValues("userData.insideLegLength") < 1) {
            formMethods.setError("userData.insideLegLength", {
                type: "manual",
                message: "Jala pikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.armLength") < 1) {
            formMethods.setError("userData.armLength", {
                type: "manual",
                message: "Varruka pikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.shoulderLength") < 1) {
            formMethods.setError("userData.shoulderLength", {
                type: "manual",
                message: "Õla pikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.shoulderLength") < 1) {
            formMethods.setError("userData.shoulderLength", {
                type: "manual",
                message: "Õla pikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.armholeLength") < 1) {
            formMethods.setError("userData.armholeLength", {
                type: "manual",
                message: "Käeaugukaare sügavus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.backWidth") < 1) {
            formMethods.setError("userData.backWidth", {
                type: "manual",
                message: "Seljalaius liiga väike.",
            });
            isInvalid = true;
        }
        return !isInvalid;
    };

    const validateSideData = () => {
        let isInvalid = false;

        if (formMethods.getValues("userData.waistHeight") < 1) {
            formMethods.setError("userData.waistHeight", {
                type: "manual",
                message: "Üldpikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.backLength") < 1) {
            formMethods.setError("userData.backLength", {
                type: "manual",
                message: "Seljapikkus liiga väike.",
            });
            isInvalid = true;
        }
        if (formMethods.getValues("userData.chestHeight") < 1) {
            formMethods.setError("userData.chestHeight", {
                type: "manual",
                message: "Rinnakõrgus liiga väike.",
            });
            isInvalid = true;
        }

        return !isInvalid;
    };
    const validateSittingData = () => {
        if (formMethods.getValues("userData.buttockHeight") < 1) {
            formMethods.setError("userData.buttockHeight", {
                type: "manual",
                message: "Istmiku kõrgus liiga väike.",
            });
            return false;
        }
        return true;
    };

    const isCurrentStepValid = async (): Promise<boolean> => {
        switch (activeStep) {
            case 0:
                return validateApplicantData();
            case 1:
                return validateFrontData();
            case 2:
                return validateBackData();
            case 3:
                return validateSideData();
            case 4:
                return validateSittingData();
            default:
                return new Promise<boolean>((resolve) => resolve(true));
        }
    };

    const getStepperContent = (idx: number) => {
        switch (idx) {
            case 0:
                return <Main />;
            case 1:
                return <Front />;
            case 2:
                return <Back />;
            case 3:
                return <Side />;
            case 4:
                return <Sitting />;
            case 5:
                return <Confirmation />;
            default:
                return null;
        }
    };
    const onSubmit = async (formData: IFormValues) => {
        if (data?.id !== undefined) {
            const url = "/BodyMeasurements/" + formData.userData.id;
            let response = await BaseService.edit(url, formData.userData, token!);
            if (response.statusCode >= 200 && response.statusCode < 400) {
            }
        } else {
            let response = await BaseService.post("/BodyMeasurements", formData.userData, token!);
            if (response.statusCode >= 200 && response.statusCode < 400) {
                console.log("andmed edukalt salvestatud");
            } else {
                console.log("miskit läks pekki");
            }
        }
    };

    useEffect(() => {
        if (data !== undefined) {
            setMeasurements(data);
            formMethods.setValue("userData", data);
        }
        setModalState(isOpened);
    }, []);
    return (
        <DialogScreen handleClose={handleDialogScreen} isOpened={modalState} token={token} data={data}>
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    {getStepperContent(activeStep)}
                    <MobileStepper
                        variant="dots"
                        steps={6}
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
                                        iconType={activeStep !== 4 ? "next" : undefined}
                                        label={activeStep === 5 ? "Sulge" : "Edasi"}
                                        onClick={activeStep === 5 ? handleClose : handleNext}
                                        type={"submit"}
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
                </form>
            </FormProvider>
        </DialogScreen>
    );
};
export default MeasurementsStepper;
