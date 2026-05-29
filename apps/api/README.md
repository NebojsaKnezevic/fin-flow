# FinFlow api

## API Endpoints

### US-00 Auth

| Method | Route          | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /auth/register | Register new user        |
| POST   | /auth/login    | Login, returns JWT token |

## Pseudo code

### US-00 — User Authentication

````typescript
FUNCTION register(REQ_BODY) {
   EMAIL = REQ_BODY.email
   PWD = REQ_BODY.pwd

   OF(EMAIL is null OR PWD is null)
      RETURN RESPONSE(400, "Email and password are required.")
   IF(EMAIL is not valid format)
      RETURN RESPONSE(400, "Invalid email format.")
   IF(PWD.length is not valid format)
      RETURN RESPONSE(400, "Invalid password format.")

   HASHED_PWD = HASH_FUNCTION(PWD)

   NEW_USER = DB_QUERY(
      "INSERT QUERY",
      [EMAIL, HASHED_PWD]
   )

   RETURN RESPONSE(201, {
      message: "Registration successful!",
      uuser: { id: NEW_USER.id, email: NEW_USER.email }
   })
}

FUNCTION POST /auth/login(EMAIL, PWD) {
   ...
}
\```
````

---

## Middlewares

| Middleware        | Description                            |
| ----------------- | -------------------------------------- |
| `authGuard`       | Verifies JWT token on protected routes |
| `errorHandler`    | Global error handler                   |
| `validateRequest` | Validates request body/params          |
