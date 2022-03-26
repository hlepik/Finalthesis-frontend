import {IPicture} from "./IPicture";

export interface IPatternInstruction {
    id?: string;
    title: string;
    description: string;
    step: number;
    pictures: IPicture[];
    instructionId: string;
}