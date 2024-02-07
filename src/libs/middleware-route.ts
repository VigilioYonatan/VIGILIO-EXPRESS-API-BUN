import type{  Request, Response } from "express";

export async function middlewareRoute(req: Request, res: Response) {
    if (req.path.includes("/api")) {
        return res.status(404).json({
            error: 404,
            success: false,
            message: "This endpoint is not correct",
        });
    }
}
