const express = require('express');


const app = express();
const port = 3000;

const cors = require('cors');

app.use(express.json());
app.use(cors());

const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const file = fs.readFileSync('./api-docs.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const v1Router = require('./routes/v1');

app.use('/v1', v1Router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
