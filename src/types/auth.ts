import { IUser } from './user';

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId?: string;
}

export interface ILoginResponse {
  access_token: string;
  user: IUser;
}
  