import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { IUnit } from "../../dto/IUnit";
import { IInstruction } from "../../dto/IInstruction";
import { IFormValues } from "../../components/MeasurementsStepper";
import { IPatternInstruction } from "../../dto/IPatternInstruction";

export interface IInstructionForm {
  name: string;
  totalStep: number;
  patternInstruction: IPatternInstruction[] | null;
  subCategoryId: string;
}
const InstructionEdit = () => {
  const appState = useContext(AppContext);
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    clearErrors,
    reset,
  } = useForm<IInstructionForm>({
    defaultValues: {
      name: "",
      totalStep: 0,
      patternInstruction: null,
      subCategoryId: "",
    },
  });
  useEffect(() => {}, []);

  return (
    <Grid container className={"PageContainer"}>
      <Typography variant={"h2"}>Uue lõike sisestamine</Typography>
    </Grid>
  );
};
export default InstructionEdit;
