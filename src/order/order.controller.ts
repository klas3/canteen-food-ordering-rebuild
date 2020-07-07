import {
  Controller, Post, Body, BadRequestException, ForbiddenException, Get, NotFoundException, Param,
} from '@nestjs/common';
import AppGateway from '../app/app.gateway';
import OrderService from './order.service';
import Order from '../entity/Order';
import { GetUser, Authorize, ForRoles } from '../auth/auth.decorators';
import User from '../entity/User';
import Roles from '../auth/roles';
import DishService from '../dish/dish.service';
import ArchiveService from '../archive/archive.service';
import UserService from '../user/user.service';

@Authorize()
@Controller('order')
class OrderController {
  private readonly countOfDigitsAfterInteger: number = 2;

  constructor(
    private readonly orderService: OrderService,
    private readonly dishService: DishService,
    private readonly archiveService: ArchiveService,
    private readonly userService: UserService,
    private readonly appGateway: AppGateway,
  ) {}

  @Post('create')
  @ForRoles(Roles.Customer, Roles.Cash, Roles.Admin)
  async create(
    @GetUser() user: User,
    @Body() incomingOrder: Order,
  ): Promise<void> {
    const order = incomingOrder;
    order.userId = user.id;
    order.creationDate = new Date();
    order.desiredDate = new Date(order.desiredDate);
    order.totalSum = 0;
    if (order.creationDate > order.desiredDate) {
      throw new BadRequestException('Бажана дата видачі повинна бути пізнішою, ніж дата створення');
    }
    const searchDishes = order.orderedDishes.map(
      (orderedDish) => this.dishService.getById(orderedDish.dishId),
    );
    const foundedDishes = await Promise.all(searchDishes);
    order.orderedDishes = order.orderedDishes.map((orderedDish) => {
      const newOrderedDish = orderedDish;
      const foundedDish = foundedDishes.find(
        (dish) => dish?.id === newOrderedDish.dishId,
      );
      if (!foundedDish) {
        throw new NotFoundException();
      }
      newOrderedDish.dish = foundedDish;
      order.totalSum += foundedDish.cost * newOrderedDish.dishCount;
      return newOrderedDish;
    });
    order.totalSum = parseFloat(order.totalSum.toFixed(this.countOfDigitsAfterInteger));
    order.orderHistoryId = (await this.archiveService.createOrderHistory(order)).id;
    const createdOrder = await this.orderService.create(order);
    if (user.isInRole(Roles.Cash)) {
      this.appGateway.addOrderToCash(createdOrder);
    }
  }

  @Post('delete')
  async delete(
    @GetUser() user: User,
    @Body('orderId') orderId: number,
  ): Promise<void> {
    if (!orderId) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(orderId, true);
    if (user.isInRole(Roles.Customer) && (order?.userId !== user.id || order.isPaid)) {
      throw new ForbiddenException();
    }
    const orderHistory = await this.archiveService.getOrderHistoryById(
      order?.orderHistoryId as string, true,
    );
    if (!orderHistory) {
      throw new NotFoundException();
    }
    await this.orderService.delete(order as Order);
    await this.archiveService.deleteOrderHistory(orderHistory);
    if (user.isInRole(Roles.Cook)) {
      this.appGateway.removeOrderFromCook(orderId);
    }
  }

  @Get('getById')
  async getById(
    @GetUser() user: User,
    @Body('id') id: number,
  ): Promise<Order> {
    const order = await this.orderService.getById(id, true);
    if (order?.userId !== user.id) {
      throw new ForbiddenException();
    }
    return order;
  }

  @Get('getAll')
  async getAll(@GetUser() user: User): Promise<Order[]> {
    let orders: Order[] = [];
    if (user.isInRole(Roles.Admin)) {
      orders = await this.orderService.getByPaymentStatus(false);
    }
    if (user.isInRole(Roles.Cook)) {
      orders = await this.orderService.getByPaymentStatus(true);
    }
    if (user.isInRole(Roles.Cash)) {
      orders = await this.orderService.getForCashier(user.id);
    }
    if (user.isInRole(Roles.Customer)) {
      orders = await this.orderService.getByUserId(user.id);
    }
    const newOrders = orders.map((order) => {
      const newOrder = { ...order };
      newOrder.orderedDishes = order.orderedDishes.map((orderedDish) => {
        const newOrderedDish = { ...orderedDish };
        newOrderedDish.dish.photo = Buffer.from('');
        return newOrderedDish;
      });
      return newOrder as Order;
    });
    return newOrders;
  }

  @ForRoles(Roles.Cash, Roles.Admin)
  @Post('confirmPayment')
  async confirmPayment(@Body('orderId') orderId: number): Promise<void> {
    if (!orderId) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new NotFoundException();
    }
    const orderWithRelations = await this.orderService.getById(orderId, true);
    if (!orderWithRelations) {
      throw new NotFoundException();
    }
    await this.orderService.confirmPayment(order);
    this.appGateway.addOrderToCook(orderWithRelations);
  }

  @ForRoles(Roles.Cook)
  @Post('confirmReadyStatus')
  async confirmReadyStatus(@Body('orderId') orderId: number): Promise<void> {
    if (!orderId) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new NotFoundException();
    }
    if (!order.isPaid) {
      throw new ForbiddenException('Замовлення ще не оплачене');
    }
    const user = await this.userService.getById(order.userId);
    if (!user) {
      throw new NotFoundException();
    }
    await this.orderService.confirmReadyStatus(order);
    this.userService.sendPushNotification(
      user.pushToken as string,
      'Замовлення',
      `Ваше замовлення №${order.id} чекає на вас.`,
    );
    this.appGateway.setOrderToReady(orderId);
  }

  @ForRoles(Roles.Cook)
  @Post('archive')
  async archive(@Body('orderId') orderId: number): Promise<void> {
    if (!orderId) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(orderId, true);
    if (!order) {
      throw new NotFoundException();
    }
    const orderHistory = await this.archiveService.getOrderHistoryById(order.orderHistoryId);
    if (!orderHistory) {
      throw new NotFoundException();
    }
    await this.orderService.archive(order, orderHistory);
    this.appGateway.removeOrderFromCook(orderId);
  }

  @ForRoles(Roles.Admin)
  @Get('getArchivedOrders/:date')
  async getArchivedOrders(@Param('date') date: string): Promise<{
    count: number,
    name: string,
    cost: number
  }[]> {
    const dishes = await this.archiveService.getOrderedDishesHistoryByDate(new Date(date));
    return dishes.map((dish) => ({
      count: dish.dishCount,
      name: dish.dishHistory.name,
      cost: dish.dishHistory.cost,
    }));
  }
}

export default OrderController;
