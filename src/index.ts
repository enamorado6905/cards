import { config } from "dotenv";
config();
import app from "./app";
import { startConnection } from "./database";
async function main() {
  startConnection();
  app.listen(app.get("port"));
  console.log("Server on port", app.get("port"));
}
main();
