import type { Request, Response } from "express";
import Router from "express-promise-router";
import { getSumResult } from "~/services/sum.service";

export const test01Router = Router();

test01Router.get("/hi", async (req: Request, res: Response) => {
  res.json({ msg: "hihi!" });
});

test01Router.post("/sum", async (req: Request, res: Response) => {
  const info: { a: number; b: number } = req.body;
  const sum = getSumResult(info.a, info.b);

  res.json({ sum });
});

test01Router.get("/err", async (req: Request, res: Response) => {
  throw new Error("bbbbb");
});
