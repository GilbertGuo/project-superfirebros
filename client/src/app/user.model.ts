export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  token?: string;
  code: string;

  constructor(username: string, password: string, email: string, code: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.code = code;
  }

}
