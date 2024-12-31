const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello, from EKS project testv5'));

const PORT = 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));