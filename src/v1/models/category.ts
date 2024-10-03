import { Db } from "../library/db";

export class CategoryModel extends Db {
  constructor() {
    super();
    this.table = "categories";
  }

  async createCategory(categoryInfo: object) {
    let result = await this.insert(this.table, categoryInfo);
    return result;
  }

  async updateCategory(categoryId: number, categoryInfo: object) {
    this.where = "WHERE  cat_id = " + categoryId;
    let result = await this.update(this.table, this.where, categoryInfo);
    return result;
  }

  async deleteCategory(categoryId: number) {
    this.where = "WHERE  cat_id = " + categoryId;
    let result = await this.delete(this.table, this.where);
    return result;
  }

  async getAllCategories() {
    let result: any[] = await this.select(this.table);
    return result;
  }
  async getCategoryById(categoryId: number) {
    this.where = "WHERE  cat_id = " + categoryId;
    let result: any[] = await this.select(this.table, this.where);
    return result[0];
  }

  //getCategoryByName --> if further required
}
