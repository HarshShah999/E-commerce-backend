import { Db } from "../library/db";

export class OrderItemModel extends Db {
  constructor() {
    super();
    this.table = "orderitems";
  }

  async createOrderItem(orderId: number, productId: number, quantity: number) {
    let orderItemInfo = {
      orderId: orderId,
      productId: productId,
      quantity: quantity,
    };
    let result = await this.insert(this.table, orderItemInfo);
    return result;
  }

  async getOrderItems(userId: number) {
    this.where = "WHERE  u.u_id = " + userId;
    this.join = `JOIN 
    orders o ON o.o_id = oi.o_id  -- Join orders before using its columns
JOIN 
    users u ON u.u_id = o.u_id  -- Join users using the correct foreign key
JOIN 
    products p ON p.pro_id = oi.pro_id  -- Join products based on pro_id`;

    let fields: string = ` CONCAT(u.firstname, ' ', u.lastname) AS fullname,
    o.orderdate,
    p.name,
    p.price,
    oi.quantity,
    (p.price * oi.quantity) AS totalPrice`;

    let result: any[] = await this.selectJoin(fields);
    return result;
  }

  async getOrderItemById(orderItemId: number) {
    this.where = "WHERE oi_id = " + orderItemId;
    let result: any[] = await this.select(this.table, this.where);
    return result[0];
  }
}
