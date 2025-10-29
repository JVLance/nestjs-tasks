import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from './../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
    constructor(
        private readonly messageService: MessageFormatterService
    ){}

    log(message:string): string {
        const result = this.messageService.format(message);
        return result;
    }
}
