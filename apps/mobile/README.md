# FinFlow mobile app

## Pseudo code

### US-00 — User Authentication

```typescript
FUNCTION onAppLaunch() {
   TOKEN = getSecureStorage("auth_token")

   IF (TOKEN exists && IS_VALID(TOKEN)) {
      SET_AUTH_STATE(true)
      NAVIGATE("dashboardScreen")
   } ELSE {
      SET_AUTH_STATE(false)
      NAVIGATE("loginScreen")
   }
}

FUNCTION handleLogin(EMAIL, PWD) {
   IF (EMAIL is null || PWD is null) {
      SHOW_FIELD_ERROR("Required field")
      RETURN
   }

   SHOW_LOADING_SPINNER()
   RESPONSE = HTTP_POST(API_URL + "/auth/login", { email, password })
   HIDE_LOADING_SPINNER()

   IF (NETWORK_ERROR) {
      SHOW_ERROR_ALERT("No internet connection.")
   } ELSE IF (RESPONSE.status == 200) {
      SAVE_SECURE_STORAGE("auth_token", RESPONSE.body.token)
      SET_AUTH_STATE(true)
      NAVIGATE("dashboardScreen")
   } ELSE {
      SHOW_ERROR_ALERT("Login failed: " + RESPONSE.error_msg)
   }
}

FUNCTION handleRegister(EMAIL, PWD, REPEATED_PWD) {
   IF (EMAIL is not valid format) {
      SHOW_FIELD_ERROR("Invalid email.")
      RETURN
   }

   IF (PWD != REPEATED_PWD) {
      SHOW_FIELD_ERROR("Passwords don't match.")
      RETURN
   }

   SHOW_LOADING_SPINNER()
   RESPONSE = HTTP_POST(API_URL + "/auth/register", { email, password })
   HIDE_LOADING_SPINNER()

   IF (NETWORK_ERROR) {
      SHOW_ERROR_ALERT("No internet connection.")
   } ELSE IF (RESPONSE.status == 201) {
      SHOW_SUCCESS_MODAL("Registration successful!")
      NAVIGATE("loginScreen")
   } ELSE {
      SHOW_ERROR_ALERT("Registration failed: " + RESPONSE.error_msg)
   }
}
```
