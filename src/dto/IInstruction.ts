import { IPatternInstruction } from "./IPatternInstruction";
import { IExtraSize } from "./IExtraSize";

export interface IInstruction {
  id?: string;
  dateAdded: Date;
  name: string;
  description: string;
  totalStep: number;
  patternInstructions: IPatternInstruction[];
  categoryId: string;
  patternFile: string;
  fileName: string;
  categoryName: string;
  mainPictureName: string;
  mainPicture: string;
  extraSizes: IExtraSize[];
}
