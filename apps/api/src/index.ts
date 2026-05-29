import express, { Request, Response } from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.use(cors());
app.use(express.json()); 

app.get("/", (req:Request, res:Response) => {
  res.status(200).json({
    message: 'success'
  });
});

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `[server] API uspešno pokrenut na http://localhost:${PORT}`);
});