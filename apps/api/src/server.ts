import app from './index';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `[server] API uspešno pokrenut na http://localhost:${PORT}`);
});