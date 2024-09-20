/*
 * File Name    : message.repository.ts
 * Description  : Message 관련 데이터베이스 접근 로직을 처리하는 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     메시지 관련 데이터베이스 작업 처리
 * 2024.09.20    김재영      Modified    에러 처리 로직 추가 및 메시지 저장 기능 개선
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CustomWsException } from '../chat.service';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  // 특정 방에 속한 메시지들 찾기 (시간순 정렬)
  async findMessagesByRoom(roomId: number): Promise<Message[]> {
    try {
      return await this.find({
        where: { chatroom: { chatroomId: roomId } },
        order: { timestamp: 'ASC' }, // 메시지를 시간순으로 정렬
      });
    } catch (error) {
      throw new InternalServerErrorException('메시지를 불러오는 도중 오류가 발생했습니다: ' + error.message);
    }
  }

  // 메시지 저장하기
  async saveMessage(roomId: number, senderId: number, content: string): Promise<Message> {
    if (!content || content.trim() === '') {
      throw new CustomWsException('메시지 내용이 비어 있을 수 없습니다.');
    }

    try {
      const message = new Message();
      message.chatroom = { chatroomId: roomId } as any; // ChatRoom 객체를 설정
      message.user = senderId; // sender를 UserId로 수정
      message.content = content;
      message.timestamp = new Date(); // 현재 타임스탬프 저장
      return await this.save(message);
    } catch (error) {
      throw new InternalServerErrorException('메시지를 저장하는 도중 오류가 발생했습니다: ' + error.message);
    }
  }
}