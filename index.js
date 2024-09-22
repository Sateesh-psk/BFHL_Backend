const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Helper function to get file details from Base64
function getFileDetails(base64String) {
  if (!base64String) return { file_valid: false };

  try {
    const buffer = Buffer.from(base64String, 'base64');
    const sizeInKB = buffer.length / 1024;
    const mimeTypeMatch = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;

    return {
      file_valid: !!mimeType,
      file_mime_type: mimeType,
      file_size_kb: sizeInKB.toFixed(2),
    };
  } catch (error) {
    return { file_valid: false };
  }
}

// POST endpoint
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: 'Invalid input data format' });
  }

  // Extract numbers and alphabets
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));

  // Get the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
    ? [lowercaseAlphabets.sort().reverse()[0]]
    : [];

  // Extract file details
  const fileDetails = getFileDetails(file_b64);

  // Response data
  const responseData = {
    is_success: true,
    user_id: 'Sateesh_Kumar_Palla_03112003', 
    email: 'sateeshkumar_palla@srmap.edu.in',        
    roll_number: 'AP21110011343',       
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    ...fileDetails,
  };

  return res.json(responseData);
});

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
