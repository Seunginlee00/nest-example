import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MqttService } from '../mqtt/mqtt.service'; // 경로 맞춰서
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly mqttService: MqttService) {}

  async afterInit() {
    await this.mqttService.connect();
    const client = this.mqttService.getClient();

    client.subscribe('chat/room/+', (err) => {
      if (err) console.error('Subscribe error:', err);
      else console.log('✅ MQTT subscribed to chat/room/+');
    });

    client.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      console.log('MQTT Message:', topic, msg);

      this.server.emit('chat', { topic, ...msg });
    });
  }
}
