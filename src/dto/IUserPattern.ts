export interface IUserPattern {
  id?: string;
  hasDone: boolean;
  stepCount: number;
  appUserId: string;
  instructionId: string;
  instructionTitle?: string;
  instructionDescription?: string;
  instructionCategory?: string;
}
