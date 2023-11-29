import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";
import cors from "cors";

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());
//app.use(cors());
//app.use(express.static("public"));
app.use("/account", accountsRouter);

global.fileName = "accounts.json";

//LOG
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level,message,label,timestamp}) => {
  return `${timestamp}  [${label}] ${level}:${message} ` 
})
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "My-logAPI.log" }),
  ],
  format: combine(
    label({labe:'MyAPI'}),
    timestamp(),
    myFormat
  )
});



// levantando server
app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info("Api Started");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    }; // stringify para converter json para string
    writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => {
        logger.info("Api Started and File Created");
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
