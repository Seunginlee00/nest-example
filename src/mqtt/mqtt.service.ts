import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleDestroy {
  private client!: mqtt.MqttClient;

  async connect(): Promise<mqtt.MqttClient> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect('mqtt://115.68.194.78:1883');

      this.client.on('connect', () => {
        console.log('🚀 MQTT connected');
        resolve(this.client);
      });

      this.client.on('error', (err) => {
        console.error('MQTT Error:', err);
        reject(err);
      });
    });
  }

  publish(
    topic: string,
    message: string,
    options?: mqtt.IClientPublishOptions,
  ) {
    this.client.publish(topic, message, options || {}, (err) => {
      if (err) {
        console.error('MQTT publish error:', err);
      }
    });
  }

  // 웹소켓으로 다른곳으로 전달하는 역할,,,, 이건 좀 더 나와봐야 알음

  // async handleMessage(topic: string, payload: Buffer) {
  //   const data = payload.toString();
  //   console.log('MQTT message:', topic, data);

  //   // 1) DB에 저장
  //   await this.prisma.tb_watch_data.create({
  //     data: {
  //       topic,
  //       payload: data,
  //       received_at: new Date(),
  //     },
  //   });

  //   // 2) 상황실 알림 (웹소켓 or Slack Webhook)
  //   this.situationGateway.server.emit('watch-update', {
  //     topic,
  //     data,
  //   });
  // }

  getClient() {
    return this.client;
  }

  onModuleDestroy() {
    this.client?.end();
  }
}
