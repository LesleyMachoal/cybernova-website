import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5999;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

