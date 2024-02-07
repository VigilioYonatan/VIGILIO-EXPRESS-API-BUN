import { Injectable } from "@decorators/di";
import { Controller, Get, Res } from "@decorators/express";
import { AppService } from "./app.service";
import { type Response } from "express";

@Injectable()
@Controller("/")
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get("/")
    async index(@Res() res: Response) {
        const result = this.appService.index();
        return res.render("web/index", result);
    }
}
