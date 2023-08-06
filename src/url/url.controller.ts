import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { Url } from "src/entities/url.entity";
import { UrlService } from "./url.service";
import { ShortenURLDto } from "src/dto/url.dto";

@Controller("url")
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post("shorten")
  shortenUrl(
    @Body()
    url: ShortenURLDto,
  ) {
    return this.urlService.shortenUrl(url);
  }

  @Get(":code")
  async redirect(
    @Res() res,
    @Param("code")
    code: string,
  ) {
    const url = await this.urlService.redirect(code);

    return res.redirect(url.longUrl);
  }
}
