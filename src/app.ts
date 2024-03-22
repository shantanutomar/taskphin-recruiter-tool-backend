import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import sequelize from './database/dbConfig';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

console.log(`port`, port);

app.use(cors());
app.use(bodyParser.json());

app.use('/candidates', candidateRoutes);

sequelize.sync().then(() => {
    sequelize
        .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        .then(() => {
            console.log('UUID extension created or already exists');
        })
        .catch((error) => {
            console.error('Error creating UUID extension:', error);
        });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
