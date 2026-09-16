const express = require('express');
// Importation des routes pour les auteurs
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
// Utilisation des routes pour les auteurs
app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API Bibliothèque opérationnelle'
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});