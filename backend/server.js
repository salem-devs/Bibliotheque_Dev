const express = require('express');
// Importation des routes pour les auteurs
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const statistiqueRoutes = require('./routes/statistiqueRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(logger);
app.use(errorHandler);
// Utilisation des routes pour les auteurs
app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/statistiques', statistiqueRoutes);    


app.get('/', (req, res) => {
  res.json({
    message: 'API Bibliothèque opérationnelle'
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});