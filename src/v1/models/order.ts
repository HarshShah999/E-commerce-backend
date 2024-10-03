import { Db } from "../library/db";

export class OrderModel extends Db {
  constructor() {
    super();
    this.table = "orders";
  }

  async createOrder(userId: number) {
    let userInfo = {
      u_id: userId,
    };
    let result = await this.insert(this.table, userInfo);
    return result;
  }

  //updating order stautus --> pending, shipped, completed
  async updateOrderStatus(orderId: number, orderStatus: string) {
    let orderInfo = {
      orderstatus: orderStatus,
    };
    this.where = "WHERE o_id = " + orderId;
    let result = await this.update(this.table, this.where, orderInfo);
    return result;
  }

  //updating payment status
  async updatePaymentStatus(orderId: number, paymentStatus: string) {
    let orderInfo = {
      paymentstatus: paymentStatus,
    };
    this.where = "WHERE o_id = " + orderId;
    let result = await this.update(this.table, this.where, orderInfo);
    return result;
  }

  //delete order
  async deleteOrder(orderId: number) {
    this.where = "WHERE o_id = " + orderId;
    let result = await this.delete(this.table, this.where);
    return result;
  }
}
