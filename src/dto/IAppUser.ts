export interface IAppUser {
  id?: string;
  firstname: string;
  lastname: string;
  username: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}
