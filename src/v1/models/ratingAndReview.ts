import { Db } from "../library/db";

export class ReviewModel extends Db {
  constructor() {
    super();
    this.table = "ratingandreviews";
  }

  async createReview(reviewInfo: object) {
    let result = await this.insert(this.table, reviewInfo);
    return result;
  }

  async getReviewByUserIdAndOrderItemId(userId: number, orderItemId: number) {
    this.where = "WHERE u_id = " + userId + " AND  oi_id = " + orderItemId;
    let result: any[] = await this.select(this.table, this.where);
    return result;
  }

  //get particular product's review
  async getProductReviews(productId: number) {
    let fields = ` (u.firstname || ' ' || u.lastname) AS fullname,
                p.name As productName,
                r.rating,
                r.reviews`;

    this.join = `JOIN users u ON u.u_id = r.u_id
                JOIN products p ON p.pro_id = r.pro_id `;

    this.where = "WHERE  p.pro_id = " + productId;

    this.orderby = "ORDER BY r.rating DESC";
    this.limit = "10";

    this.where = this.join + " " + this.where;
    let result: any[] = await this.select(
      this.table,
      this.where,
      this.orderby,
      this.limit,
      fields
    );
    return result;
  }
}
