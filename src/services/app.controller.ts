import { Injectable } from "@decorators/di";
import { Controller, Get } from "@decorators/express";
import { AppService } from "./app.service";

@Injectable()
@Controller("/")
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get("/")
    async index() {
        const result = this.appService.index();
        return result;
    }
}
