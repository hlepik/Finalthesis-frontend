import { IPatternInstruction } from "./IPatternInstruction";

export interface IInstruction {
  id?: string;
  dateAdded: Date;
  name: string;
  totalStep: number;
  patternInstruction: IPatternInstruction[];
  subCategoryId: string;
  patternFile: "";
  fileName: "";
}
