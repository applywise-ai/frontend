const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD6K85fMN0--89HcVBRpsPGocGNiG8P2LY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=applywise-3c885.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=applywise-3c885
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=applywise-3c885.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=540004026700
NEXT_PUBLIC_FIREBASE_APP_ID=1:540004026700:web:REPLACE_WITH_YOUR_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MEASUREMENT_ID # Optional
`;

// Path to .env.local file
const envPath = path.join(__dirname, '.env.local');

// Check if file already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️ .env.local file already exists. Rename or delete it before running this script.');
} else {
  // Write the file
  fs.writeFileSync(envPath, firebaseConfig);
  console.log('✅ .env.local file created successfully!');
  console.log('⚠️ Important: Replace REPLACE_WITH_YOUR_APP_ID with your actual Firebase App ID');
  console.log('   You can find this in your Firebase console under Project Settings > General > Your Apps');
} 