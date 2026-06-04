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
});
