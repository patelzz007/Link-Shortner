import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDTO {
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
}
