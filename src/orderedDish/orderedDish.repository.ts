import { Repository, EntityRepository } from "typeorm";
import { OrderedDish } from "../entity/OrderedDish";
import { OrderedDishHistory } from "../entity/OrderedDishHistory";

@EntityRepository(OrderedDish)
export class OrderedDishRepository extends Repository<OrderedDish> {
  async createOrderedDish(orderedDish: OrderedDish): Promise<void> {
    await this.save(orderedDish);
  }

  async createOrderedDishHistory(orderedDishHistory: OrderedDishHistory): Promise<void> {
    await this.save(orderedDishHistory);
  }

  async deleteOrderedDish(id: string): Promise<void> {
    await this.delete(id);
  }

  async getOrderedDishesByOrderId(orderId: string): Promise<OrderedDish[]> {
    return await this.find({ orderId });
  }
}
