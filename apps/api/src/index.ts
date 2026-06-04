import express from "express";
import cors from "cors";
import setRoutes from "./routes/index.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

setRoutes(app);

app.use(globalErrorHandler);

export default app;
