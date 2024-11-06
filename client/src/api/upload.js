// pages/api/upload.js
import { storage } from '../../firebaseAdmin';  // Import Firebase Storage from admin config

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileData } = req.body; // Get file data from request

    // Upload the file to Firebase Storage
    const file = storage.file(fileName);
    await file.save(Buffer.from(fileData, 'base64'));

    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
