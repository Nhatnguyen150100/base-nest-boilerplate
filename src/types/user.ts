import { IRole } from './roles';

export interface IUserReq {
  id: string;
  email: string;
  role: IRole;
  [x: string]: any;
}
