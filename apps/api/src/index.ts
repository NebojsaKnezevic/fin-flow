import express from "express";
import cors from "cors";
import setRoutes from "./routes/index.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

setRoutes(app);

app.use(globalErrorHandler);

export default app;
