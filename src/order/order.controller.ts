import { Controller, Post, Body, BadRequestException, ForbiddenException, Get, NotFoundException, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../entity/Order';
import { GetUser, Authorize, ForRoles } from '../auth/auth.decorators';
import { User } from '../entity/User';
import { Roles } from '../auth/roles';
import { DishService } from '../dish/dish.service';
import { ArchiveService } from '../archive/archive.service';
import { UserService } from '../user/user.service';

@Authorize()
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private dishService: DishService,
    private archiveService: ArchiveService,
    private userService: UserService,
  ) {}

  @Post('create')
  async create(
    @GetUser() user: User,
    @Body() order: Order
  ): Promise<void> {
    order.userId = user.id;
    order.creationDate = new Date();
    order.desiredDate = new Date(order.desiredDate);
    order.totalSum = 0;
    if (order.creationDate > order.desiredDate) {
      throw new BadRequestException('Бажана дата видачі повинна бути пізнішою, ніж дата створення');
    }
    for (const orderedDish of order.orderedDishes) {
      const dish = await this.dishService.getById(orderedDish.dishId);
      if (!dish) {
        throw new NotFoundException();
      }
      orderedDish.dish = dish;
      order.totalSum += dish.cost * orderedDish.dishCount;
    }
    order.orderHistoryId = (await this.archiveService.createOrderHistory(order)).id;
    return await this.orderService.create(order);
  }

  @Post('delete')
  async delete(
    @GetUser() user: User,
    @Body('id') id: string,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(id, true);
    if (user.isInRole(Roles.Customer) && (order?.userId !== user.id || order.isPaid)) {
      throw new ForbiddenException();
    }
    const orderHistory = await this.archiveService.getOrderHistoryById(order?.orderHistoryId as string, true);
    if (!orderHistory) {
      throw new NotFoundException();
    }
    await this.orderService.delete(order as Order);
    await this.archiveService.deleteOrderHistory(orderHistory);
    return;
  }

  @Get('getById')
  async getById(
    @GetUser() user: User,
    @Body('id') id: string,
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
      orders = await this.orderService.getByPaymentStatus(true);
    }
    if (user.isInRole(Roles.Cook)) {
      orders = await this.orderService.getByPaymentStatus(false);
    }
    if (user.isInRole(Roles.Cash)) {
      orders = await this.orderService.getForCashier(user.id);
    }
    if (user.isInRole(Roles.Customer)) {
      orders = await this.orderService.getByUserId(user.id);
    }
    return orders;
  }

  @ForRoles(Roles.Cash, Roles.Admin)
  @Post('confirmPayment')
  async confirmPayment(@Body('id') id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(id);
    if (!order) {
      throw new NotFoundException();
    }
    return await this.orderService.confirmPayment(order);
  }

  @ForRoles(Roles.Cook)
  @Post('confirmReadyStatus')
  async confirmReadyStatus(
    @GetUser() user: User, 
    @Body('id') id: string
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(id);
    if (!order) {
      throw new NotFoundException();
    }
    if (!order.isPaid) {
      throw new ForbiddenException('Замовлення ще не оплачене');
    }
    await this.orderService.confirmReadyStatus(order);
    this.userService.sendPushNotification(
      user.pushToken as string, 
      'Замовлення', 
      `Ваше замовлення №${order.id} чекає на вас.`
    );
    return;
  }

  @Post('archive')
  async archive(@Body('id') id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    const order = await this.orderService.getById(id, true);
    if (!order) {
      throw new NotFoundException();
    }
    const orderHistory = await this.archiveService.getOrderHistoryById(order.orderHistoryId);
    if (!orderHistory) {
      throw new NotFoundException();
    }
    return await this.orderService.archive(order, orderHistory);
  }

  @Get('getArchivedOrders/:date')
  async getArchivedOrders(@Param('date') date: string): Promise<{ 
    count: number, 
    name: string, 
    cost: number 
  }[]> {
    const dishes = await this.archiveService.getOrderedDishesHistoryByDate(new Date(date));
    return dishes.map((dish) => {
      return {
        count: dish.dishCount,
        name: dish.dishHistory.name,
        cost: dish.dishHistory.cost,
      };
    });
  }
}
