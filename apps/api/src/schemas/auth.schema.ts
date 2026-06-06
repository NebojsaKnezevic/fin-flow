import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password nust be atleast 8 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password nust be atleast 8 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
