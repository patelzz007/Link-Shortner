import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from "@nestjs/common";
import { User } from "../entities/users.entity";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateUserDTO } from "../dto/users.dto";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "../enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { SuccessDto } from "src/dto/success.dto";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Get("/all")
  @ApiOperation({
    summary: "Find all users",
  })
  @ApiResponse({ status: 200, description: "Success", type: [User] })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post("/create")
  @ApiOperation({
    summary: "Create user",
  })
  @ApiResponse({ status: 200, description: "Success", type: User })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersService.createNewUser(createUserDTO);
  }

  @Get(":id")
  async find(@Param("id") id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update user details",
  })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 200, description: "Success", type: User })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() updateUserDTO: CreateUserDTO,
  ): Promise<User> {
    return await this.usersService.updateOne(id, updateUserDTO);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "Success",
    type: SuccessDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiOperation({
    summary: "Delete user",
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param("id") id: string): Promise<SuccessDto> {
    await this.usersService.deleteOne(id);
    return {
      success: true,
    };
  }
}
