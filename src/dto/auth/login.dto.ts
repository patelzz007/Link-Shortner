import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: "Username is required.",
  })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Password is required.",
  })
  @IsString()
  password: string;
}
