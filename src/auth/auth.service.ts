import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { LoginDTO } from "src/dto/auth/login.dto";
import { CreateUserDTO } from "src/dto/users.dto";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { RegisterDTO } from "src/dto/auth/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return await this.usersService.findOne(email, password);
  }

  async validateUserPassword(loginDTO: LoginDTO): Promise<void> {
    const { email, password } = loginDTO;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User Not Found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Incorrect Password.",
      });
    }
  }

  async login(loginDTO: LoginDTO): Promise<{
    email: string;
    username: string;
    userId: string;
    role: string;
    token: string;
  }> {
    const { email, password } = loginDTO;

    const user = await this.usersService.getUserByEmail(email);

    console.log("Auth Service Login User", user)

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User Not Found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: "Invalid Credentials.",
      });
    }

    const token = this.jwtService.sign({
      userId: user.id,
      email,
      username: user.username,
      role: user.role,
    });

    return {
      email,
      username: user.username,
      userId: (user.id),
      role: user.role,
      token,
    };
  }

  async register(registerDTO: RegisterDTO) {
    const user = new User();
    const hashPassword = await bcrypt.hash(registerDTO.password, 10);
    user.username = registerDTO.username;
    user.email = registerDTO.email;
    user.password = hashPassword;
    user.role = registerDTO.role;
    console.log("Create User : ", user);

    const duplicateUsernameOrEmail =
      await this.usersService.findOneByUsernameOrEmail({
        email: user.email,
        username: user.username,
      });

    console.log("Duplicate Username Or Email :", duplicateUsernameOrEmail);
    if (duplicateUsernameOrEmail) {
      // throw new BadRequestException("Username or email has already been taken");
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: "Username or email has already been taken.",
      });
    }

    return await this.userRepository.save(user);
  }
}
