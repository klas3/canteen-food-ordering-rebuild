import { WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import Order from '../entity/Order';

@WebSocketGateway()
class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: any;

  handleConnection(client: any): void {
    client.emit('connection');
  }

  addOrderToCash(order: Order): void {
    this.server.emit('addOrderToCash', order);
  }

  addOrderToCook(order: Order): void {
    this.server.emit('addOrderToCook', order);
  }

  setOrderToReady(orderId: number): void {
    this.server.emit('setOrderToReady', orderId);
  }

  removeOrderFromCook(orderId: number): void {
    this.server.emit('removeOrderFromCook', orderId);
  }
}

export default AppGateway;
