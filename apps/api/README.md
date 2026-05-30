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

FUNCTION login(REQ_BODY) {
   EMAIL = REQ_BODY.email
   PWD = REQ_BODY.pwd

   IF (EMAIL is null OR PWD is null)
      RETURN RESPONSE(400, "Email and password are required.")

   USER = DB_QUERY("SELECT QUERY", [EMAIL])

   IF (!USER) {
      RETURN RESPONSE(400, "Invalid email or password.")
   }

   IS_PASSWORD_VALID = COMPARE_HASH(PWD, USER.password)
   IF (!IS_PASSWORD_VALID) {
      RETURN RESPONSE(400, "Invalid email or password.")
   }

   JWT_SECRET = GET_ENV("JWT_SECRET")
   TOKEN = GENERATE_JWT({ user_id: USER.id, email: USER.email }, JWT_SECRET, EXPIRES_IN="30d")

   RETURN RESPONSE(200, {
      message: "Login successful",
      token: TOKEN
   })
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

### authGuard

```typescript

FUNCTION authGuard(REQ){
   AUTH_HEADER = REQ.headers["authorization"]

   TOKEN = AUTH_HEADER && AUTH_HEADER.SPLIT(" ")[1]

   IF (TOKEN IS NULL){
      RETURN RESPONSE(401, "Access denied. No token provided.")
   }

   JWT_SECRET = GET_ENV("JWT_SECRET")
   DECODED_PAYLOAD = VERIFY_JWT(TOKEN, JWT_SECRET)

   IF (DECODED_PAYLOAD is invalid or expired){
      RETURN RESPONSE(403, "Invalid or expired token.")_
   }

   REQ.user = DECODED_PAYLOAD

   NEXT()
}

FUNCTION validateRequest(SCHEMA) {
   RETURN FUNCTION(REQ) {
      VALIDATION = SCHEMA.validate(REQ.body)

      IF (VALIDATION.fails) {
         RETURN RESPONSE(400, {
            message: "Validation failed",
            errors: VALIDATION.errors
         })
      }

     NEXT()
   }
}

FUNCTION errorHandler(ERR) {
   LOG_ERROR(ERR.stack)

   IF (ERR.code == "23505") {
      RETURN RESPONSE(409, "The email address is already registered.")
   }

   RETURN RESPONSE(500, "Something went wrong on the server.")
}

```
