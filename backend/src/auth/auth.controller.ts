import { Body, Controller, HttpException, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/login-user.dto";
import type { Request, Response } from "express";
import { AuthGuard } from "./auth.guard";

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
          maxAge: 900000,
          path: "/"
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

    @Post("logout")
    @UseGuards(AuthGuard)
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
      const token = request.cookies["access_token"];
      await this.authService.desvalidateToken(token);
      response.clearCookie("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      })
      return { message: "O usuário foi deslogado com sucesso!" }
    }
}