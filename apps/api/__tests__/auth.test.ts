import * as t from "vitest";
import request from "supertest";
import app from "../src/index";
import { users } from "../src/db/schemas/users";
import db from "../src/db/db";
import { eq } from "drizzle-orm";

//US-00 — User Authentication
t.describe("US-00 — User Authentication", () => {
  t.beforeAll(async () => {
    await db.delete(users).where(eq(users.email, "test@gmail.com"));
  });

  const user = {
    email: "test@gmail.com",
    password: "Test1test2!",
  };

  t.it("REGISTRATION - new user", async () => {
    const response = await request(app).post("/auth/register").send(user);

    t.expect(response.status).toBe(201);
    t.expect(response.body).toHaveProperty("id");
    t.expect(response.body).toHaveProperty("email", user.email);
  });

  t.it("REGISTRATION - existing user", async () => {
    const response = await request(app).post("/auth/register").send(user);

    t.expect(response.status).toBe(409);
    t.expect(response.body).toHaveProperty("error");
  });

  t.it("REGISTRATION - missing email", async () => {
    const reponse = await request(app)
      .post("/auth/register")
      .send({ ...user, email: undefined });

    t.expect(reponse.status).toBe(400);
    t.expect(reponse.body).toHaveProperty("error");
  });

  t.it("REGISTRATION - missing password", async () => {
    const reponse = await request(app)
      .post("/auth/register")
      .send({ ...user, password: undefined });

    t.expect(reponse.status).toBe(400);
    t.expect(reponse.body).toHaveProperty("error");
  });

  t.it("REGISTRATION - invalid email", async () => {
    const reponse = await request(app)
      .post("/auth/register")
      .send({ ...user, email: "invalid" });

    t.expect(reponse.status).toBe(400);
    t.expect(reponse.body).toHaveProperty("error");
  });

  t.it("REGISTRATION - weak password", async () => {
    const reponse = await request(app)
      .post("/auth/register")
      .send({ ...user, password: "weak" });

    t.expect(reponse.status).toBe(400);
    t.expect(reponse.body).toHaveProperty("error");
  });

  t.it.each([
    // 1. Success cases (Happy path)
    {
      email: "test@gmail.com",
      password: "Test1test2!",
      expectedStatus: 200,
      description: "Valid credentials",
    },

    // 2. Authentication failures
    {
      email: "test@gmail.com",
      password: "WrongPassword123!",
      expectedStatus: 401,
      description: "Incorrect password",
    },
    {
      email: "nonexistent@gmail.com",
      password: "Test1test2!",
      expectedStatus: 401,
      description: "Non-existent user",
    },

    // 3. Validation & Bad formats
    {
      email: "invalid-email-format",
      password: "Test1test2!",
      expectedStatus: 400,
      description: "Invalid email format",
    },
    {
      email: "test@gmail.com",
      password: "short",
      expectedStatus: 400,
      description: "Password below minimum length",
    },

    // 4. Missing fields
    {
      email: "",
      password: "Test1test2!",
      expectedStatus: 400,
      description: "Missing email",
    },
    {
      email: "test@gmail.com",
      password: "",
      expectedStatus: 400,
      description: "Missing password",
    },
    {
      email: "",
      password: "",
      expectedStatus: 400,
      description: "Missing all fields",
    },

    // 5. Edge cases & Security
    {
      email: "TEST@GMAIL.COM",
      password: "Test1test2!",
      expectedStatus: 401,
      description: "Email case-insensitivity check",
    },
    {
      email: "' OR 1=1 --",
      password: "anything",
      expectedStatus: 400,
      description: "SQL Injection attempt in email",
    },
    {
      email: "test@gmail.com",
      password: "a".repeat(100),
      expectedStatus: 400,
      description: "Payload too large (password over limit)",
    },
  ])("LOGIN - $description ", async ({ email, password, expectedStatus }) => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });

    t.expect(response.status).toBe(expectedStatus);

    if (expectedStatus === 200) {
      t.expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = response.headers["set-cookie"][0];
      // console.log("WTTTTFFFFFff", cookies);
      t.expect(cookies).toContain("token=");
    }
  });
});
