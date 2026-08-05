import { GoogleGenAI } from "@google/genai";
// import { fstat } from "fs";
import { readFile } from "fs/promises";
import path from "path";
// import type { ExpenseItemObj } from "@finflow/expense-store";

export class AIService {
  private ai = new GoogleGenAI({});

  public async analyze(input: string, imgPath?: string) {
    const inputData: any[] = [];

    // const x: ExpenseItemObj[] = []
    // console.log(x)
    inputData.push({ type: "text", text: input });

    if (imgPath) {
      const extn = path.extname(imgPath).toLowerCase();
      const image = await readFile(imgPath);
      const image64 = image.toString("base64");

      inputData.push({
        type: "image",
        data: image64,
        mime_type: `image/${extn.replace(".", "")}`,
      });
    }

    const response = await this.ai.interactions.create({
      model: "gemini-3.6-flash",
      input: inputData,
      response_format: {
        type: "text",
        mime_type: "application/json",
      },
    });

    return response.output_text;
  }
}

export const aiService = new AIService();
