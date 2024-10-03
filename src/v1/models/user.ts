import { Db } from "../library/db";

export class UserModel extends Db {
  constructor() {
    super();
    this.table = "users";
  }
  async createUser(userInfo: object) {
    let result = await this.insert(this.table, userInfo);
    return result;
  }
  async updateUser(userId: number, userInfo: object) {
    this.where = "WHERE u_id = " + userId;
    let result = await this.update(this.table, this.where, userInfo);
    return result;
  }

  async deleteUser(userId: number) {
    this.where = "WHERE u_id = " + userId;
    let result = await this.delete(this.table, this.where);
    return result;
  }

  //finding exsiting user--->by email
  async findUserByEmail(email: string) {
    this.where = "WHERE email = '" + email + "'";

    let result: any = await this.select(
      this.table,
      this.where,
      this.orderby,
      this.limit
    );
    console.log("INside User Model#####", result);
    return result[0];
  }

  //finding user by Id
  async findUserById(userId: number) {
    this.where = "WHERE u_id = " + userId;
    let result: any[] = await this.select(
      this.table,
      this.where,
      this.orderby,
      this.limit
    );
    return result;
  }
}
