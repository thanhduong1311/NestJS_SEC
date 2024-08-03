import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailMessage } from 'src/global/globalEnum';
import { EmailToken } from 'src/entities/EmailToken.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTokenRequest } from './dto/emailTokenDto';
import { formatDate } from 'src/utils/dateFormat';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailToken) private emailTokenRepository: Repository<EmailToken>,
    private readonly emailService: MailerService
  ) {}

  async findOne(email: string) {
    const foundInfo = await this.emailTokenRepository.findOneBy({ email: email });
    return foundInfo;
  }

  // Send, resend verify email for new account, verify done -> delete email token
  async sendVerifyEmail(email: string) {
    const checkEmail = await this.emailTokenRepository.findOneBy({ email: email });
    if (checkEmail) {
      await this.emailTokenRepository.delete({ email: email });
    }

    const verifyCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
      .toString()
      .padStart(6, '0');

    const newData: EmailTokenRequest = {
      email: email,
      token: await this.hashCode(verifyCode),
      createAt: formatDate(new Date()),
      expiresAt: formatDate(new Date(new Date().getTime() + 20 * 60 * 1000))
    };

    await this.emailTokenRepository.save(newData);

    await this.emailService.sendMail({
      to: email,
      subject: EmailMessage.Verify_email_title,
      template: './verifyEmail',
      context: {
        code: verifyCode
      }
    });
  }

  async sendRecoverPasswordEmail(email: string, username: string) {
    const checkEmail = await this.emailTokenRepository.findOneBy({ email: email });
    if (checkEmail) {
      await this.emailTokenRepository.delete({ email: email });
    }

    const verifyCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
      .toString()
      .padStart(6, '0');

    const newData: EmailTokenRequest = {
      email: email,
      token: await this.hashCode(verifyCode),
      createAt: formatDate(new Date()),
      expiresAt: formatDate(new Date(new Date().getTime() + 20 * 60 * 1000))
    };

    await this.emailTokenRepository.save(newData);

    await this.emailService.sendMail({
      to: email,
      subject: EmailMessage.Verify_email_title,
      template: './recoverPassword',
      context: {
        code: verifyCode,
        username: username
      }
    });
  }

  // Check code and expire
  async checkVerifyCode(email: string, code: string) {
    const foundInfo = await this.emailTokenRepository.findOneBy({ email: email });

    if (!foundInfo) {
      throw new HttpException('Cannot found email token of email ' + email, 401);
    }

    const now = new Date();
    const expiryDate = new Date(foundInfo.expiresAt);

    const checkCode = await bcrypt.compare(code, foundInfo.token);
    if (checkCode && expiryDate <= now) {
      await this.emailTokenRepository.delete(foundInfo);
      return true;
    } else {
      if (!checkCode) throw new HttpException('Invalid code!', 401);
      else throw new HttpException('Expired code!', 401);
    }
  }

  // Hash email token
  private async hashCode(code: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(code, salt);
    return hash;
  }
}
