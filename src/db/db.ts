import { User } from 'src/user/create-user.dto';

export class Db {
  private users: User[] = [];

  constructor(private usrs: User[]) {
    this.users = this.usrs;
  }

  public get getAllUsers(): User[] {
    console.log(this.users);

    return this.users;
  }

  public addUser(user: User) {
    this.users.push(user);
    return user;
  }

  /**
   * removeUser
   */
  public removeUser(id: string) {
    const filteredUser = this.users.filter((usr) => usr.id !== id);
    this.users = filteredUser;
    return id;
  }

  /**
   * getById
   */
  public getById(id: string) {
    return this.users.find((usr) => usr.id === id);
  }

  /**
   * updateUser
   */
  public updateUser(id: string, body: User) {
    const mappedUser = this.users.map((usr) => {
      if (usr.id === id) {
        return { ...usr, ...body };
      }
      return usr;
    });
    this.users = mappedUser;
    return { body };
  }

  /**
   * Проверяет, если пользователь
   */
  public hasUser(id: string) {
    return this.users.find((user) => id === user.id);
  }
}

export const dbInstance = new Db([]);
