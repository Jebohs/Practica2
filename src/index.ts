import express from "express";
import { platform } from "node:os";

const app = express();
app.use(express.json());

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});