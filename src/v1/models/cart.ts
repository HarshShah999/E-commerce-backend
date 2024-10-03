import { Db } from "../library/db";

export class CartModel extends Db {
  constructor() {
    super();
    this.table = "cart";
  }

  async addToCart(cartInfo: object) {
    let result = await this.insert(this.table, cartInfo);
    return result;
  }

  async getCartItemByProductId(productId: number) {
    this.where = "WHERE pro_id = " + productId;
    let result: any[] = await this.select(this.table, this.where);
    return result[0];
  }
  async removeFromCart(productId: number) {
    this.where = "WHERE pro_id = " + productId;
    let result = await this.delete(this.table, this.where);
    return result;
  }

  async updateCart(quantity: number, cartId: number, productId: number) {
    this.where = "WHERE pro_id = " + productId + " AND cart_id = " + cartId;
    let cartInfo = {
      quantity: quantity,
    };
    let result = await this.update(this.table, this.where, cartInfo);
    return result;
  }

  async getAllCartItems(userId: number) {
    let feilds = `p.name,p.price,c.quantity,(p.price * c.quantity) AS total_price `;
    this.join = `JOIN products p ON p.pro_id=c.pro_id JOIN users u ON u.u_id=c.u_id`;
    this.where = "WHERE  u.u_id  = " + userId;
    let result: any[] = await this.selectJoin(feilds);
    return result;
  }
}
