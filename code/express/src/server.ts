import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import createError from "http-errors";
import { setupRouter } from "./routes/_index";
import { setupSocketio } from "./socketio/_index";
import { logger } from "./utils/logger";
import { setupRedis } from "./utils/redis";

const app = express();
app.use(express.json());
app.use(cookieParser());

// this is the default port that App runs your React app on
app.use(cors({ origin: `http://localhost:4200` }));

// set up redis
setupRedis();

// API Group Routes
setupRouter(app);

// Handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

// Add error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const INTERNAL_SERVER_ERROR = 500;
  logger.debug(err);
  return res.status(INTERNAL_SERVER_ERROR).json({ error: err.message });
});

const server = http.createServer(app);

// set up socket.io
setupSocketio(server, "/api/001");

// app start
server.listen(process.env.PORT, () => {
  logger.info(`⚡️[server]: Server is running at *:${process.env.PORT}`);
});
