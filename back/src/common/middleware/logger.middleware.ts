import { Request, Response, NextFunction } from "express";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, body, query, params } = req;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `[${method}] ${originalUrl} → ${res.statusCode} (${duration}ms)`,
    );

    if (Object.keys(body || {}).length) {
      console.log("Body:", body);
    }

    if (Object.keys(query || {}).length) {
      console.log("Query:", query);
    }

    if (Object.keys(params || {}).length) {
      console.log("Params:", params);
    }
  });

  next();
}
