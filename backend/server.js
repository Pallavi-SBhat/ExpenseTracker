import dotenv from 'dotenv';
dotenv.config({ path: 'D:/ExpenseTracker/backend/.env' }); // ✅ force load

import express from 'express';
import cors from 'cors';

console.log("URL:", process.env.SUPABASE_URL);
console.log("ANON:", process.env.SUPABASE_ANON_KEY?.slice(0,20));
console.log("SERVICE:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,20));

import expensesRoutes from './routes/expenses.js';
import savingsRoutes from './routes/savings.js';
import profileRoutes from './routes/profile.js';
import authRoutes from './routes/auth.js';
import predictionRoutes from './routes/predictions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/expenses', expensesRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
