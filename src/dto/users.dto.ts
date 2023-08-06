import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({
    message: "Username is required.",
  })
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty({
    message: "Email is required.",
  })
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak.",
  })
  @IsNotEmpty({
    message: "Password is required.",
  })
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty({
    message: "Role is required.",
  })
  role: string = Role.ADMIN;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address1: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address2: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address3: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postcode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  town: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;
}
