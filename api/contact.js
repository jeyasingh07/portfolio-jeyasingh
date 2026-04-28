// SETUP STEPS:
// 1. Go to https://console.firebase.google.com
// 2. Create project -> Enable Firestore Database
// 3. Go to Project Settings -> Service Accounts
// 4. Generate new private key -> download JSON
// 5. Add these to Vercel Environment Variables:
//    FIREBASE_PROJECT_ID = your-project-id
//    FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxx@...
//    FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n..."
// 6. In Firestore: create collection "contacts"
// 7. Deploy to Vercel: vercel --prod

const { db } = require('../lib/firestore');

module.exports = async (req, res) => {
  // Set CORS headers for API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to Firestore
    const docRef = db.collection('contacts').doc();
    await docRef.set({
      name,
      email,
      phone: phone || '',
      message,
      timestamp: timestamp || new Date().toISOString(),
      read: false
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
