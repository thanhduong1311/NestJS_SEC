import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailToken } from 'src/entities/EmailToken.entity';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Teacher } from 'src/entities/teacher.entity';
import { Admin } from 'src/entities/admin.entity';
import { Student } from 'src/entities/student.entity';
import { AccountManagementModule } from '../account_management/accountManagement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailToken, Teacher, Admin, Student]),
    AccountManagementModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'Anhngusimple@gmail.com',
            pass: 'bhow iqhj korz oakl'
          },
          tls: {
            rejectUnauthorized: false
          }
        },

        template: {
          dir: join(__dirname, '../../mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      })
    })
  ],
  providers: [EmailService],
  controllers: []
})
export class EmailModule {}
