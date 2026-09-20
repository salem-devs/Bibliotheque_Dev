const API = '/api';

let pageLivre = 1;
let rechercheLivre = '';

const message = document.getElementById('message');

function afficherMessage(texte) {
  message.textContent = texte;
  message.style.display = 'block';

  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}

async function requete(url, options = {}) {
  const response = await fetch(url, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }

  return data;
}

/* =========================
   NAVIGATION
========================= */

document.querySelectorAll('nav button').forEach((button) => {
  button.addEventListener('click', () => {
    const sectionId = button.dataset.section;

    document.querySelectorAll('.section').forEach((section) => {
      section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'dashboard') {
      chargerStatistiques();
    }

    if (sectionId === 'livres') {
      chargerAuteurs();
      chargerLivres();
    }

    if (sectionId === 'auteurs') {
    afficherAuteurs();
    }

    if (sectionId === 'adherents') {
      chargerAdherents();
    }

    if (sectionId === 'emprunts') {
      chargerEmprunts();
      chargerFormulaireEmprunt();
    }
  });
});

/* =========================
   DASHBOARD
========================= */

async function chargerStatistiques() {
  try {
    const data = await requete(`${API}/statistiques`);

    document.getElementById('totalLivres').textContent =
      data.total_livres;

    document.getElementById('totalAdherents').textContent =
      data.total_adherents;

    document.getElementById('empruntsEnCours').textContent =
      data.emprunts_en_cours;

    document.getElementById('empruntsEnRetard').textContent =
      data.emprunts_en_retard;

    document.getElementById('livrePlusEmprunte').textContent =
      data.livre_plus_emprunte
        ? `${data.livre_plus_emprunte.titre} (${data.livre_plus_emprunte.nombre_emprunts} emprunt(s))`
        : 'Aucun';

    document.getElementById('adherentPlusActif').textContent =
      data.adherent_plus_actif
        ? `${data.adherent_plus_actif.nom} (${data.adherent_plus_actif.nombre_emprunts} emprunt(s))`
        : 'Aucun';

  } catch (error) {
    afficherMessage(error.message);
  }
}

/* =========================
   AUTEURS
========================= */

async function chargerAuteurs() {
  try {
    const auteurs = await requete(`${API}/auteurs`);

    const select = document.getElementById('auteurId');

    select.innerHTML =
      '<option value="">Sélectionner un auteur</option>';

    auteurs.forEach((auteur) => {
      select.innerHTML += `
        <option value="${auteur.id}">
          ${auteur.nom}
        </option>
      `;
    });
  } catch (error) {
    afficherMessage(error.message);
  }
}

async function afficherAuteurs() {
  try {
    const auteurs = await requete(`${API}/auteurs`);

    const tbody = document.getElementById('auteursTable');

    tbody.innerHTML = '';

    auteurs.forEach((auteur) => {
      tbody.innerHTML += `
        <tr>
          <td>${auteur.id}</td>
          <td>${auteur.nom}</td>
          <td>${auteur.nationalite || '-'}</td>
          <td class="actions">
            <button onclick="modifierAuteur(${auteur.id})">
              Modifier
            </button>

            <button
              class="danger"
              onclick="supprimerAuteur(${auteur.id})"
            >
              Supprimer
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('auteurForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('auteurIdForm').value;

  const auteur = {
    nom: document.getElementById('nomAuteur').value,
    nationalite: document.getElementById('nationaliteAuteur').value
  };

  try {
    if (id) {
      await requete(`${API}/auteurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auteur)
      });

      afficherMessage('Auteur modifié avec succès');
    } else {
      await requete(`${API}/auteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auteur)
      });

      afficherMessage('Auteur ajouté avec succès');
    }

    document.getElementById('auteurForm').reset();
    document.getElementById('auteurIdForm').value = '';

    afficherAuteurs();
    chargerAuteurs();

  } catch (error) {
    afficherMessage(error.message);
  }
});

async function modifierAuteur(id) {
  try {
    const auteurs = await requete(`${API}/auteurs`);

    const auteur = auteurs.find((item) => item.id === id);

    if (!auteur) {
      afficherMessage('Auteur introuvable');
      return;
    }

    document.getElementById('auteurIdForm').value = auteur.id;
    document.getElementById('nomAuteur').value = auteur.nom;
    document.getElementById('nationaliteAuteur').value =
      auteur.nationalite || '';

  } catch (error) {
    afficherMessage(error.message);
  }
}

async function supprimerAuteur(id) {
  if (!confirm('Voulez-vous vraiment supprimer cet auteur ?')) {
    return;
  }

  try {
    await requete(`${API}/auteurs/${id}`, {
      method: 'DELETE'
    });

    afficherMessage('Auteur supprimé avec succès');

    afficherAuteurs();
    chargerAuteurs();

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('annulerAuteur').addEventListener('click', () => {
  document.getElementById('auteurForm').reset();
  document.getElementById('auteurIdForm').value = '';
});

/* =========================
   LIVRES
========================= */

async function chargerLivres() {
  try {
    const url =
      `${API}/livres?search=${encodeURIComponent(rechercheLivre)}&page=${pageLivre}&limit=10`;

    const result = await requete(url);

    const tbody = document.getElementById('livresTable');

    tbody.innerHTML = '';

    result.data.forEach((livre) => {
      tbody.innerHTML += `
        <tr>
          <td>${livre.id}</td>
          <td>${livre.titre}</td>
          <td>${livre.auteur}</td>
          <td>${livre.annee_publication || '-'}</td>
          <td class="${
            livre.statut === 'emprunte'
              ? 'status-emprunte'
              : 'status-disponible'
          }">
            ${livre.statut}
          </td>
          <td class="actions">
            <button onclick="modifierLivre(${livre.id})">
              Modifier
            </button>

            <button
              class="danger"
              onclick="supprimerLivre(${livre.id})"
            >
              Supprimer
            </button>
          </td>
        </tr>
      `;
    });

    afficherPagination(result);
  } catch (error) {
    afficherMessage(error.message);
  }
}

function afficherPagination(result) {
  const pagination = document.getElementById('pagination');

  pagination.innerHTML = '';

  const totalPages = Math.ceil(result.total / result.limit);

  if (result.page > 1) {
    pagination.innerHTML += `
      <button onclick="changerPageLivre(${result.page - 1})">
        Précédent
      </button>
    `;
  }

  pagination.innerHTML += `
    <span>Page ${result.page} / ${totalPages || 1}</span>
  `;

  if (result.page < totalPages) {
    pagination.innerHTML += `
      <button onclick="changerPageLivre(${result.page + 1})">
        Suivant
      </button>
    `;
  }
}

function changerPageLivre(page) {
  pageLivre = page;
  chargerLivres();
}

document.getElementById('btnRecherche').addEventListener('click', () => {
  rechercheLivre =
    document.getElementById('rechercheLivre').value;

  pageLivre = 1;

  chargerLivres();
});

document.getElementById('livreForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('livreId').value;

  const livre = {
    titre: document.getElementById('titre').value,
    auteur_id: Number(document.getElementById('auteurId').value),
    annee_publication:
      document.getElementById('anneePublication').value
        ? Number(document.getElementById('anneePublication').value)
        : null
  };

  try {
    if (id) {
      await requete(`${API}/livres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(livre)
      });

      afficherMessage('Livre modifié avec succès');
    } else {
      await requete(`${API}/livres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(livre)
      });

      afficherMessage('Livre ajouté avec succès');
    }

    document.getElementById('livreForm').reset();
    document.getElementById('livreId').value = '';

    chargerLivres();

  } catch (error) {
    afficherMessage(error.message);
  }
});

async function modifierLivre(id) {
  try {
    const result = await requete(`${API}/livres?limit=1000`);

    const livre = result.data.find((item) => item.id === id);

    if (!livre) {
      afficherMessage('Livre introuvable');
      return;
    }

    document.getElementById('livreId').value = livre.id;
    document.getElementById('titre').value = livre.titre;
    document.getElementById('anneePublication').value =
      livre.annee_publication || '';

    await chargerAuteurs();

    const auteurs = await requete(`${API}/auteurs`);
    const auteur = auteurs.find(
      (item) => item.nom === livre.auteur
    );

    if (auteur) {
      document.getElementById('auteurId').value = auteur.id;
    }

  } catch (error) {
    afficherMessage(error.message);
  }
}

async function supprimerLivre(id) {
  if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) {
    return;
  }

  try {
    await requete(`${API}/livres/${id}`, {
      method: 'DELETE'
    });

    afficherMessage('Livre supprimé avec succès');
    chargerLivres();

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('annulerLivre').addEventListener('click', () => {
  document.getElementById('livreForm').reset();
  document.getElementById('livreId').value = '';
});

/* =========================
   ADHERENTS
========================= */

async function chargerAdherents() {
  try {
    const adherents = await requete(`${API}/adherents`);

    const tbody = document.getElementById('adherentsTable');

    tbody.innerHTML = '';

    adherents.forEach((adherent) => {
      tbody.innerHTML += `
        <tr>
          <td>${adherent.id}</td>
          <td>${adherent.nom}</td>
          <td>${adherent.contact}</td>
          <td class="actions">
            <button onclick="modifierAdherent(${adherent.id})">
              Modifier
            </button>

            <button
              class="danger"
              onclick="supprimerAdherent(${adherent.id})"
            >
              Supprimer
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('adherentForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('adherentId').value;

  const adherent = {
    nom: document.getElementById('nomAdherent').value,
    contact: document.getElementById('contactAdherent').value
  };

  try {
    if (id) {
      await requete(`${API}/adherents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adherent)
      });

      afficherMessage('Adhérent modifié avec succès');
    } else {
      await requete(`${API}/adherents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adherent)
      });

      afficherMessage('Adhérent ajouté avec succès');
    }

    document.getElementById('adherentForm').reset();
    document.getElementById('adherentId').value = '';

    chargerAdherents();

  } catch (error) {
    afficherMessage(error.message);
  }
});

async function modifierAdherent(id) {
  try {
    const adherents = await requete(`${API}/adherents`);

    const adherent = adherents.find(
      (item) => item.id === id
    );

    if (!adherent) {
      afficherMessage('Adhérent introuvable');
      return;
    }

    document.getElementById('adherentId').value = adherent.id;
    document.getElementById('nomAdherent').value = adherent.nom;
    document.getElementById('contactAdherent').value =
      adherent.contact;

  } catch (error) {
    afficherMessage(error.message);
  }
}

async function supprimerAdherent(id) {
  if (!confirm('Voulez-vous vraiment supprimer cet adhérent ?')) {
    return;
  }

  try {
    await requete(`${API}/adherents/${id}`, {
      method: 'DELETE'
    });

    afficherMessage('Adhérent supprimé avec succès');
    chargerAdherents();

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('annulerAdherent').addEventListener('click', () => {
  document.getElementById('adherentForm').reset();
  document.getElementById('adherentId').value = '';
});

/* =========================
   EMPRUNTS
========================= */

async function chargerFormulaireEmprunt() {
  try {
    const adherents = await requete(`${API}/adherents`);
    const livresResult = await requete(`${API}/livres?limit=1000`);

    const adherentSelect =
      document.getElementById('empruntAdherent');

    const livreSelect =
      document.getElementById('empruntLivre');

    adherentSelect.innerHTML =
      '<option value="">Sélectionner un adhérent</option>';

    livreSelect.innerHTML =
      '<option value="">Sélectionner un livre</option>';

    adherents.forEach((adherent) => {
      adherentSelect.innerHTML += `
        <option value="${adherent.id}">
          ${adherent.nom}
        </option>
      `;
    });

    livresResult.data
      .filter((livre) => livre.statut === 'disponible')
      .forEach((livre) => {
        livreSelect.innerHTML += `
          <option value="${livre.id}">
            ${livre.titre}
          </option>
        `;
      });

  } catch (error) {
    afficherMessage(error.message);
  }
}

document.getElementById('empruntForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const emprunt = {
    adherent_id: Number(
      document.getElementById('empruntAdherent').value
    ),
    livre_id: Number(
      document.getElementById('empruntLivre').value
    ),
    date_retour_prevue:
      document.getElementById('dateRetourPrevue').value
  };

  try {
    await requete(`${API}/emprunts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emprunt)
    });

    afficherMessage('Emprunt créé avec succès');

    document.getElementById('empruntForm').reset();

    chargerEmprunts();
    chargerFormulaireEmprunt();
    chargerStatistiques();

  } catch (error) {
    afficherMessage(error.message);
  }
});

async function chargerEmprunts() {
  try {
    const emprunts = await requete(
      `${API}/emprunts/en-cours`
    );

    const retards = await requete(
      `${API}/emprunts/en-retard`
    );

    const tbody = document.getElementById('empruntsTable');

    tbody.innerHTML = '';

    emprunts.forEach((emprunt) => {
      tbody.innerHTML += `
        <tr>
          <td>${emprunt.adherent}</td>
          <td>${emprunt.livre}</td>
          <td>${formaterDate(emprunt.date_emprunt)}</td>
          <td>${formaterDate(emprunt.date_retour_prevue)}</td>
          <td>
            <button
              class="warning"
              onclick="retournerLivre(${emprunt.id})"
            >
              Retourner
            </button>
          </td>
        </tr>
      `;
    });

    const retardTbody =
      document.getElementById('retardsTable');

    retardTbody.innerHTML = '';

    retards.forEach((emprunt) => {
      retardTbody.innerHTML += `
        <tr class="retard">
          <td>${emprunt.adherent}</td>
          <td>${emprunt.livre}</td>
          <td>${formaterDate(emprunt.date_retour_prevue)}</td>
        </tr>
      `;
    });

  } catch (error) {
    afficherMessage(error.message);
  }
}

async function retournerLivre(id) {
  try {
    await requete(`${API}/emprunts/${id}/retour`, {
      method: 'PUT'
    });

    afficherMessage('Livre retourné avec succès');

    chargerEmprunts();
    chargerFormulaireEmprunt();
    chargerStatistiques();

  } catch (error) {
    afficherMessage(error.message);
  }
}

function formaterDate(date) {
  return new Date(date).toLocaleDateString('fr-FR');
}

/* =========================
   CHARGEMENT INITIAL
========================= */

chargerStatistiques();


// const API = '/api'; // 

// async function chargerStatistiques() {
//   const response = await fetch(`${API}/statistiques`);

//   const data = await response.json();

//   document.getElementById('totalLivres').textContent =
//     data.total_livres;

//   document.getElementById('totalAdherents').textContent =
//     data.total_adherents;

//   document.getElementById('empruntsEnCours').textContent =
//     data.emprunts_en_cours;

//   document.getElementById('empruntsEnRetard').textContent =
//     data.emprunts_en_retard;
// }

// chargerStatistiques();

// // NAVIGATION
// document.querySelectorAll('nav button').forEach((button) => {
//   button.addEventListener('click', () => {
//     const sectionId = button.dataset.section;

//     document.querySelectorAll('.section').forEach((section) => {
//       section.classList.remove('active');
//     });

//     document.getElementById(sectionId).classList.add('active');

//      if (sectionId === 'livres') {
//       chargerAuteurs();
//       chargerLivres();

//     }
//   });
// });

// async function chargerLivres() {
//   const response = await fetch('/api/livres');

//   const result = await response.json();

//   const tbody = document.getElementById('livresTable');

//   tbody.innerHTML = '';

//   result.data.forEach((livre) => {
//     tbody.innerHTML += `
//       <tr>
//         <td>${livre.id}</td>
//         <td>${livre.titre}</td>
//         <td>${livre.auteur}</td>
//         <td>${livre.annee_publication || '-'}</td>
//         <td>${livre.statut}</td>
//         <td>
//         <button onclick="modifierLivre(${livre.id})">
//             Modifier
//         </button>

//         <button onclick="supprimerLivre(${livre.id})">
//             Supprimer
//         </button>
//         </td>
//       </tr>
//     `;
//   });
// }

// async function supprimerLivre(id) {
//   if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) {
//     return;
//   }

//   const response = await fetch(`/api/livres/${id}`, {
//     method: 'DELETE'
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     alert(data.message);
//     return;
//   }

//   alert('Livre supprimé avec succès');

//   chargerLivres();
// }

// async function modifierLivre(id) {
//   const response = await fetch(`/api/livres?limit=1000`);
//   const result = await response.json();

//   const livre = result.data.find((item) => item.id === id);

//   if (!livre) {
//     alert('Livre introuvable');
//     return;
//   }

//   document.getElementById('livreId').value = livre.id;
//   document.getElementById('titre').value = livre.titre;
//   document.getElementById('anneePublication').value =
//     livre.annee_publication || '';

//   await chargerAuteurs();

//   const auteursResponse = await fetch('/api/auteurs');
//   const auteurs = await auteursResponse.json();

//   const auteur = auteurs.find(
//     (item) => item.nom === livre.auteur
//   );

//   if (auteur) {
//     document.getElementById('auteurId').value = auteur.id;
//   }
// }


// document.getElementById('livreForm').addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const livre = {
//     titre: document.getElementById('titre').value,
//     auteur_id: Number(document.getElementById('auteurId').value),
//     annee_publication: document.getElementById('anneePublication').value
//       ? Number(document.getElementById('anneePublication').value)
//       : null
//   };

//   const response = await fetch('/api/livres', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(livre)
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     alert(data.message);
//     return;
//   }

//   alert('Livre ajouté avec succès');

//   document.getElementById('livreForm').reset();

//   chargerLivres();
// });

// // charger les auteurs pour le formulaire de création de livre
// async function chargerAuteurs() {
//   const response = await fetch('/api/auteurs');

//   const auteurs = await response.json();

//   const select = document.getElementById('auteurId');

//   select.innerHTML = '<option value="">Sélectionner un auteur</option>';

//   auteurs.forEach((auteur) => {
//     select.innerHTML += `
//       <option value="${auteur.id}">
//         ${auteur.nom}
//       </option>
//     `;
//   });
// }