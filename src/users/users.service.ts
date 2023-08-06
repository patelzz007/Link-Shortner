import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../entities/users.entity";

import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "src/dto/users.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string, password: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    try {
      if (!user)
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: "User not found.",
        });

      const isMatch = await bcrypt.compare(password, user.password);

      console.log("Find User : ", user);
      console.log("isMatch : ", isMatch);
      // delete user.password;
      return user;
    } catch (err) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User not found.",
      });
    }
  }

  async findOneByUsernameOrEmail({
    email,
    username,
  }: {
    email: string;
    username: string;
  }): Promise<User> {
    return await this.userRepository
      .createQueryBuilder("user")
      .where("user.username = :username OR user.email = :email", {
        username,
        email,
      })
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getUser(username: string) {
    return (
      (await this.getUserByName(username)) ??
      (await this.getUserByEmail(username))
    );
  }

  getUserByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User not found.",
      });
    }

    return user;
  }

  async findAllByEmailOrName({
    email,
    username,
  }: {
    email: string;
    username: string;
  }): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder("user")
      .where("user.username = :username OR user.email = :email", {
        email,
        username,
      })
      .getMany();
  }

  async createNewUser(createUserDTO: CreateUserDTO) {
    const user = new User();
    const hashPassword = await bcrypt.hash(createUserDTO.password, 10);
    user.username = createUserDTO.username;
    user.email = createUserDTO.email;
    user.password = hashPassword;
    user.role = createUserDTO.role;
    user.phoneNumber = createUserDTO.phone_number || null;
    user.avatar = createUserDTO.avatar || null;
    user.address1 = createUserDTO.address1 || null;
    user.address2 = createUserDTO.address2 || null;
    user.address3 = createUserDTO.address3 || null;
    user.postcode = createUserDTO.postcode || null;
    user.town = createUserDTO.town || null;
    user.state = createUserDTO.state || null;
    user.country = createUserDTO.country || null;
    console.log("Create User : ", user);

    const duplicateUsernameOrEmail = await this.findOneByUsernameOrEmail({
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

  async findUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User not found.",
      });
    }

    return user;
  }

  async updateOne(id: string, createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException("User not found");

    const updatedUser = {
      ...user,
      ...createUserDTO,
    };

    const isExistingUser = await this.findAllByEmailOrName({
      email: updatedUser.email,
      username: updatedUser.username,
    });

    // Hash the password
    if (createUserDTO.password) {
      const hashPassword = await bcrypt.hash(createUserDTO.password, 10);
      updatedUser.password = hashPassword;
    }

    const filteredUser = isExistingUser.filter((user) => {
      return user.id !== id;
    });

    if (filteredUser.length)
      throw new BadRequestException("Username or email name must be unique");

    return await this.userRepository.save(updatedUser);
  }

  async deleteOne(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userRepository.remove(user);
  }
}
