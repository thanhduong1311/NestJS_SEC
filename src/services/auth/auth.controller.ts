import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import {
  AuthDtoRequest,
  AuthDtoResponse,
  ChangePassword,
  RecoverPassword,
  RefreshToken,
  StudentDtoRegister,
  VerifyDtoRequest,
  VerifyRecovery
} from './dto/authDto';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { StudentDtoResponse } from 'src/modules/student/dto/StudentDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get current User
  @Get()
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request): ResponseData<any> {
    try {
      const response: AuthDtoResponse = {
        accessToken: req.headers.authorization.split(' ')[1],
        refreshToken: '',
        profile: req.user
      };
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // Verify email after register
  @Post('verify')
  async verify(@Body() verifyInfo: VerifyDtoRequest): Promise<ResponseData<any>> {
    try {
      const check = await this.authService.verifyEmail(verifyInfo);
      return new ResponseData<any>(check, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  // Verify email after register
  @Post('resend-verify-email')
  async reRerify(@Body() verifyInfo: RecoverPassword): Promise<ResponseData<any>> {
    try {
      const check = await this.authService.reSendVerifyEmail(verifyInfo);
      return new ResponseData<any>(check, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('resend-email-recover-password')
  async reSendVerifyCodeChangePassword(
    @Body() verifyInfo: RecoverPassword
  ): Promise<ResponseData<any>> {
    try {
      const check = await this.authService.resendEmailRecoverPassword(verifyInfo);
      return new ResponseData<any>(check, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  // Login
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request, @Body() body: AuthDtoRequest): ResponseData<any> {
    try {
      body.username;
      return new ResponseData<any>(req.user, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // Register default for student
  @Post('register')
  async register(@Body() registerInfo: StudentDtoRegister): Promise<ResponseData<any>> {
    try {
      const response = await this.authService.studentRegister(registerInfo);
      return new ResponseData<StudentDtoResponse>(
        response,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentDtoResponse>(null, err.message, HttpStatus.ERROR);
    }
  }

  // Get new refresh token and access token
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshToken): Promise<ResponseData<any>> {
    try {
      const response = await this.authService.refreshToken(data.refreshToken);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  //Recover password
  @Post('recover-password')
  async recoverPassword(@Body() data: RecoverPassword): Promise<ResponseData<any>> {
    try {
      const response = await this.authService.recoverPassword(data);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('recovery-code')
  async recoverCode(@Body() data: VerifyRecovery): Promise<ResponseData<any>> {
    try {
      let check = await this.authService.verifyRecovery(data);
      if (check === undefined) {
        check = await this.authService.verifyEmail({
          email: data.userOrEmail,
          code: data.code
        });
      }
      return new ResponseData<any>(check, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('change-password')
  async changePassword(@Body() data: ChangePassword): Promise<ResponseData<any>> {
    try {
      const response = await this.authService.changePassword(data);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
}
