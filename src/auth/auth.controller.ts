import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Body,
  HttpStatus,
  HttpException,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LoginDTO } from "src/dto/auth/login.dto";
import { RegisterDTO } from "src/dto/auth/register.dto";

import { UsersService } from "src/users/users.service";
import { AuthenticatedRequest } from "src/interfaces/AuthenticatedRequest";
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: "Login as a user.",
  })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 404, description: "User Not Found." })
  @UsePipes(ValidationPipe)
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Body() loginDTO: LoginDTO) {
    console.log("What is this loginDTO : ", loginDTO);
    try {
      await this.authService.validateUserPassword(loginDTO);
      console.log("Validate 123");
      // Password is valid, proceed with authentication logic
      return await this.authService.login(loginDTO);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post("/register")
  @ApiOperation({
    summary: "Register as a user.",
  })
  // @ApiResponse({ status: 400, description: "Bad Request" })
  // @ApiResponse({ status: 503, description: "Something Went Wrong" })
  @UsePipes(ValidationPipe)
  async create(@Body() registerDTO: RegisterDTO) {
    return await this.authService.register(registerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Add bearer authentication to Swagger
  @ApiOperation({ summary: "Validate Token" }) // Add operation summary
  @ApiOkResponse({ description: "Token is valid" }) // Add success response description
  @ApiUnauthorizedResponse({ description: "Unauthorized", status: 401 }) // Add unauthorized response description
  @Get("validate")
  async validateToken(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
