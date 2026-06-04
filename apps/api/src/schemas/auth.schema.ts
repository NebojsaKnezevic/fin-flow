import {z} from 'zod';

export const registerSchema = z.object({
    email: z
    .string({required_error: 'Email is required'})
    .email({message: 'Invalid email frmat'}),
    password: z.
    string({required_error: "Password is required"})
    .min(10, {message: "Password nust be atleast 8 characters"})
});

export type RegisterInput = z.infer<typeof registerSchema>;