import { IPicture } from "./IPicture";

export interface IPatternInstruction {
  id?: string;
  title: string;
  description: string;
  step: number;
  picture: string | null;
  pictureName: string | null;
  instructionId: string;
}
