const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

//Ініціалізація Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = 3000;

//Маршрут для отримання міст
app.get('/cities', async (req, res) => {
  try {
    const citiesRef = db.collection('cities');
    const snapshot = await citiesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No matching documents.' });
    }

    let citiesList = [];
    snapshot.forEach(doc => {
      // Додаємо ID документа та його дані в масив
      citiesList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(citiesList);

  } catch (error) {
    console.error("Error getting documents: ", error);
    res.status(500).send(error.message);
  }
});

//Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the endpoint at http://localhost:${PORT}/cities`);
});