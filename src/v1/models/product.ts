import { Db } from "../library/db";

export class ProductModel extends Db {
  public table2: string;
  constructor() {
    super();
    this.table = "products";
    this.table2 = "ratingandreviews";
  }

  async createProduct(productInfo: object) {
    let result = await this.insert(this.table, productInfo);
    return result;
  }
  async updateProduct(productId: number, productInfo: object) {
    this.where = "WHERE  pro_id = " + productId;
    let result = await this.update(this.table, this.where, productInfo);
    return result;
  }

  async deleteProduct(productId: number) {
    this.where = "WHERE  pro_id = " + productId;
    let result = await this.delete(this.table, this.where);
    return result;
  }

  async getProductById(productId: number) {
    this.where = "WHERE  pro_id = " + productId;
    let result: any[] = await this.select(this.table, this.where);
    return result[0];
  }

  async updateProductRating(productId: number) {
    this.where = "WHERE  pro_id = " + productId;
    this.uniqueField = "rating";
    let avgRating = await this.selectAvg(
      this.table2,
      this.uniqueField,
      this.where
    );

    //now update that rating in product
    let productInfo = {
      rating: avgRating,
    };
    let result = await this.update(this.table, this.where, productInfo);
    return result;
  }

  async getProductByName(productName: string, page: number) {
    this.where = "WHERE name LIKE '%" + productName + "%'";
    this.page = page;

    let result: any[] = await this.listRecords();
    return result;
  }

  async filterProduct(
    productName: string,
    minPrice: number,
    maxPrice: number,
    order: "asc" | "desc",
    orderby: string,
    page: number
  ) {
    this.where = "WHERE name LIKE '%" + productName + "%'";

    if (maxPrice && minPrice) {
      this.where += " AND price BETWEEN " + minPrice + " AND " + maxPrice;
    }
    if (order && orderby) {
      this.orderby = "ORDER BY " + orderby + " " + order;
    }
    this.page = page;

    let result: any[] = await this.listRecords();
    return result;
  }
  //get All products -->if further required
}
