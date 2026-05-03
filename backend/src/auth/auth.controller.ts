import { Body, Controller, HttpException, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/login-user.dto";
import type { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
      try {
        const { email, password } = loginUserDto;
        const result = await this.authService.validateUser(email, password);

        response.cookie('access_token', result.token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 3600000,
        });

        return {
          status: "success",
          message: "Usuário autenticado com sucesso!",
          data: {
            user: result.user
          }
        };
      } catch (error) {
        if (error instanceof HttpException) return error.getResponse();
      }
    }
}