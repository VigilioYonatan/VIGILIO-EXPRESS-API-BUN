import express from "express";
import path from "node:path";
import passport from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import enviroments from "~/config/enviroments.config";
import { ERROR_MIDDLEWARE, attachControllers } from "@decorators/express";
import { connectDB } from "~/config/db.config";
import { ServerErrorMiddleware } from "@vigilio/express-core/handler";
import { Container } from "@decorators/di";
import { logger } from "@vigilio/express-core/helpers";
import { apiRouters } from "~/routers/api.router";
import { middlewareRoute } from "~/libs/middleware-route";

export class Server {
    public readonly app: express.Application = express();

    constructor() {
        this.middlewares();
        this.auth();
        this.routes();
    }
    middlewares() {
        // comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
        this.app.use(
            compression({
                threshold: 10000,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );

        // habilitar cookies
        this.app.use(cookieParser());
        // habilitar para consumir json
        this.app.use(express.json());
        // habilitar carpeta public
        this.app.use(
            express.static(path.resolve(import.meta.dir, "..", "..", "public"))
        );

        connectDB();
    }

    async auth() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser(async (_user, _done) => {
            // if (!usuario) return done({ message: "error authenticated" });
            // return done(null, usuario);
        });
    }

    routes() {
        this.app.use(morgan("dev"));
        const apiRouter = express.Router();
        attachControllers(apiRouter, apiRouters);
        Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
        ]);
        this.app.use("/api", apiRouter);
        this.app.use(middlewareRoute);
    }

    listen() {
        const server = this.app.listen(enviroments.PORT, () => {
            logger.primary(`Run server in port ${enviroments.PORT}`);
        });
        return server;
    }
}
