import { Db } from "../library/db";

export class OtpModel extends Db {
  constructor() {
    super();
    this.table = "otps";
  }

  async createOtp(otpInfo: object) {
    let result = await this.insert(this.table, otpInfo);
    return result;
  }

  async findRecentOtp(email: string) {
    this.where =
      "WHERE email = '" + email + "' AND CURRENT_TIMESTAMP < expires_at ";
    this.orderby = "ORDER BY created_at DESC";
    this.limit = "LIMIT 1";
    let result: any[] = await this.select(
      this.table,
      this.where,
      this.orderby,
      this.limit
    );
    return result;
  }

  async deleteOtp(otp: number) {
    this.where = "WHERE otp = '" + otp + "'";
    let result = await this.delete(this.table, this.where);
    return result;
  }
}
