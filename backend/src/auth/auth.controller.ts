import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/login-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async validateUser(@Body() loginUserDto: LoginUserDto) {
      const { email, password } = loginUserDto;
    
      const user = await this.authService.validateUser(email, password);
    
      if (!user) {throw new UnauthorizedException("E-mail ou senha incorretos!");}
    
      return user;
    }
}