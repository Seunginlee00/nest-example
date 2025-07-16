import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MqttService } from '../mqtt/mqtt.service';

interface CreateNoticeDto {
  msg: string;
  notiType: string;
  notiIdx: number;
  isApi: number;
}

@Injectable()
export class NoticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mqtt: MqttService,
  ) {}

  // | topic              | 중요도       | 권장 QoS    |
  // | ------------------ | --------- | ---------     |
  // | `notice/general`   | 낮음        | `QoS = 0`   |
  // | `notice/emergency` | 매우 높음     | `QoS = 2`  |
  // | `notice/unitstate` | 낮음 (자동삭제) | `QoS = 0` |
  // | `notice/(교관군번)`    | 높음        | `QoS = 1` |

  async createNotice({
    msg,
    notiType,
    notiIdx,
    isApi,
  }: CreateNoticeDto): Promise<{ code: number; result: string }> {
    if (!msg || !notiType || !notiIdx) {
      throw new Error('필수 값이 누락되었습니다.');
    }

    const topic = `notice/${notiType}`;
    const date = new Date();

    let qos: 0 | 1 | 2 = 0;
    let priority: 0 | 1 | 2 = 0;

    console.log('📝 notiType:', notiType);

    switch (notiType) {
      case 'general':
        qos = 0;
        priority = 0;
        break;
      case 'unitstate':
        qos = 0;
        priority = 0;
        break;
      case 'emergency':
        qos = 2;
        priority = 2;
        break;
      default:
        qos = 1;
        priority = 1;
        break;
    }

    console.log('📝 결정된 priority:', priority, 'qos:', qos);

    const created = await this.prisma.tb_mq_message.create({
      data: {
        topic,
        target_idx: Number(notiIdx),
        msg,
        priority,
        reg_datetime: date,
      },
    });

    console.log('✅ 실제 insert:', {
      topic,
      target_idx: Number(notiIdx),
      msg,
      priority,
      reg_datetime: date,
    });

    // payload 만들기
    const payload = JSON.stringify({
      mq_idx: created.mq_idx,
      noti_idx: notiIdx,
      topic,
      msg,
      date,
    });

    // MQTT publish
    const client = this.mqtt.getClient();
    client.publish(topic, payload, { qos });

    console.log(`🚀 Notice published to ${topic} with qos=${qos}:`, payload);

    return { code: 200, result: 'ok' };
  }
}
