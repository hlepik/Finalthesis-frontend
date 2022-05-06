import { IPatternInstruction } from "./IPatternInstruction";
import { IExtraSize } from "./IExtraSize";
import { IBodyMeasurements } from "./IBodyMeasurements";

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
    bodyMeasurements: IBodyMeasurements[];
    circleSkirtType: string;
}
