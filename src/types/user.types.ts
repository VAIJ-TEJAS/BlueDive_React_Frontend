export interface IUserData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IAuthResponse {
  user: IUserData;
  token: string;
}