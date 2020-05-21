import { app } from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`automerge-store listening at http://localhost:${port}`)
);
