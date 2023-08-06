import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Url } from "src/entities/url.entity";
import { nanoid } from "nanoid";
import { isURL } from "class-validator";
import { ShortenURLDto } from "src/dto/url.dto";
@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  async shortenUrl(url: ShortenURLDto) {
    const { longUrl } = url;

    //checks if longurl is a valid URL
    if (!isURL(longUrl)) {
      throw new BadRequestException("String Must be a Valid URL");
    }
    const urlCode = nanoid(10);
    const baseURL = process.env.BASE_URL;

    console.log("What is this base URL :", baseURL);

    try {
      //check if the URL has already been shortened
      let url = await this.repo.findOneBy({ longUrl });
      //return it if it exists
      if (url)
        return {
          url: url.shortUrl,
        };

      //if it doesn't exist, shorten it
      const shortUrl = `${baseURL}/url/${urlCode}`;

      //add the new record to the database
      url = this.repo.create({
        urlCode,
        longUrl,
        shortUrl,
      });

      this.repo.save(url);
      // return url.shortUrl;
      return {
        url: url.shortUrl,
      };
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException("Server Error");
    }
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.repo.findOneBy({ urlCode });
      if (url) return url;
    } catch (error) {
      console.log(error);
      throw new NotFoundException("Resource Not Found");
    }
  }
}
