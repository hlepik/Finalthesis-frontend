import {IInstruction} from "./IInstruction";

export interface ISubCategory {
    id?: string;
    name: string;
    categoryId: string;
    instructions: IInstruction[];

}