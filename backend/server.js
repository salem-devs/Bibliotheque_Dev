const express = require('express');
const path = require('path');

// Importation des routes
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');

// Importation des middlewares
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());

// Permet à Express de servir le frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware de journalisation
app.use(logger);

// Routes API
app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/statistiques', statistiqueRoutes);

// Route introuvable
app.use(notFound);

// Gestionnaire d'erreurs
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});