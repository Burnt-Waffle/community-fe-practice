import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/public/pages/login/login.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});