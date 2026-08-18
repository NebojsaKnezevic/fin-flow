import { GoogleGenAI } from "@google/genai";
import { getJsonSchema } from "@repo/models";
import { readFile } from "fs/promises";
import path from "path";
import { AppError } from "../errors/app.error";

export class AIService {
  private ai = new GoogleGenAI({});

  public async analyzePrompt(options: {
    model: string;
    prompt: string;
    schema: any;
    // imgPath?: string;
    img?: string;
    imgMime?: string;
  }) {
    const inputData: any[] = [{ type: "text", text: options.prompt }];

    if (options.img && options.imgMime) {
      inputData.push({
        type: "image",
        data: options.img,
        mime_type: options.imgMime,
      });
    }

    const response = await this.ai.interactions.create({
      model: options.model,
      input: inputData,
      stream: false,
      store: false,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: getJsonSchema(options.schema),
      },
    });

    const rawText = response.output_text || "{}";
    console.log(rawText);
    // return options.schema.parse(JSON.parse(rawText));
    return response;
  }

  public async *analyzePromptStream(options: {
    model: string;
    prompt: string;
    schema: any;
    imgPath?: string;
  }) {
    const inputData: any = [{ type: "text", text: options.prompt }];

    if (options.imgPath) {
      const extn = path.extname(options.imgPath).toLowerCase().replace(".", "");
      const image = await readFile(options.imgPath);

      inputData.push({
        type: "image",
        data: image.toString("base64"),
        mime_type: extn === "jpg" ? "image/jpeg" : `image/${extn}`,
      });
    }

    const responseStream = await this.ai.interactions.create({
      model: options.model,
      input: inputData,
      stream: true,
      store: false,

      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: getJsonSchema(options.schema),
      },
    });

    for await (const chunk of responseStream) {
      // console.log(chunk);
      yield chunk;
    }
  }

  //   public async analyze(
  //     userId: string,
  //     recipeJsonSchema: any,
  //     input?: string,
  //     imgPath?: string,
  //   ) {
  //     if (!input && !imgPath)
  //       throw new AppError(400, "Please provide data throw text or image.");

  //     const inputData: any[] = [];

  //     const categories = await categoryService.getCategoriesForUser(userId);

  //     const systemPrompt = `Extract expenses from text and image. Rules:
  // 1. ITEM: Create a new categoryItem and attach it properly to parent for every item on the list you see, unless there is the exact same category.
  // 2. CATEGORY: Assign lowest-level category ID/name from: ${JSON.stringify(categories)}. `;

  //     inputData.push({ type: "text", text: systemPrompt });

  //     if (input) {
  //       inputData.push({ type: "text", text: input });
  //     }

  //     if (imgPath) {
  //       const extn = path.extname(imgPath).toLowerCase();
  //       const image = await readFile(imgPath);
  //       const image64 = image.toString("base64");

  //       inputData.push({
  //         type: "image",
  //         data: image64,
  //         mime_type: `image/${extn.replace(".", "")}`,
  //       });
  //     }

  //     //AI response
  //     const response = await this.ai.interactions.create({
  //       model: "gemini-3.6-flash",
  //       input: inputData,
  //       response_format: {
  //         type: "text",
  //         mime_type: "application/json",
  //         schema: recipeJsonSchema,
  //       },
  //     });

  //     //Parse AI response
  //     insertExpenseExtendedSchema
  //       // .omit({ occuredAt: true })
  //       .parse(JSON.parse(response.output_text || ""));

  //     return response.output_text;
  //   }
}

export const aiService = new AIService();
