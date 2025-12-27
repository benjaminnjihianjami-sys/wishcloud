import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import { securityHeaders } from './security-headers.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(compression());
app.use(securityHeaders);

app.get('/', (req, res) => res.send('Wishcloud API running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
