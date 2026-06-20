import app from "./index";
import dotenv from "dotenv";
import os from "os";

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
}

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `\x1b[36m%s\x1b[0m`,
    `http://${getLocalIpAddress()}:${PORT} http://localhost:${PORT}`,
  );
});
