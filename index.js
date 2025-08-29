const express = require('express');

// Create an instance of the Express application.
const app = express();

// Middleware to parse incoming JSON payloads in request bodies.
// This is crucial for a POST API that receives JSON data.
app.use(express.json());

// -----------------------------------------------------------------------------
// ## CONFIGURATION
// -----------------------------------------------------------------------------

// Set the port. It will use the host's designated port (for Vercel/Railway)
// or default to 3000 for local development.
const PORT = process.env.PORT || 3000;
// !! IMPORTANT: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL DETAILS !!
// Storing these in a central config object is good practice.
const userDetails = {
    fullName: "Rithwik", // e.g., "john_doe"
    dob: "12102004",             // e.g., "17091999"
    email: "rithwik.22bce7548@vitstudent.ac.in",
    rollNumber: "22BCE7548"
};
/**
 * Processes an array of data to categorize its elements.
 * @param {Array<string>} dataArray - The input array from the request.
 * @returns {object} An object containing the processed data.
 */
const processArrayData = (dataArray) => {
    // Initialize the structure to hold the processed data.
    const response = {
        oddNumbers: [],
        evenNumbers: [],
        alphabets: [],
        specialCharacters: [],
        sum: 0,
        allAlphabeticalChars: ""
    };

    // Use for...of loop for clean and readable iteration over the input array.
    for (const item of dataArray) {
        const strItem = String(item); // Ensure item is a string for consistent checks.

        // Check if the item is a valid number (handles integers and numeric strings).
        if (!isNaN(parseFloat(strItem)) && isFinite(strItem)) {
            const num = Number(strItem);
            response.sum += num;
            if (num % 2 === 0) {
                response.evenNumbers.push(String(num));
            } else {
                response.oddNumbers.push(String(num));
            }
        } 
        // Check if the item consists solely of one or more alphabetic characters.
        else if (/^[a-zA-Z]+$/.test(strItem)) {
            response.alphabets.push(strItem.toUpperCase());
            // Collect all alphabetical characters for the final string concatenation.
            response.allAlphabeticalChars += strItem;
        } 
        // If it's neither a number nor a pure alphabet string, classify it as a special character.
        else {
            response.specialCharacters.push(strItem);
        }
    }

    return response;
};

/**
 * Generates the alternating caps string from a given string of characters.
 * The logic is to reverse the string, then alternate capitalization.
 * Example: "ayb" -> reverse -> "bya" -> "ByA"
 * @param {string} chars - The string of concatenated alphabetic characters.
 * @returns {string} The final string in reversed, alternating caps format.
 */
const generateAlternatingCapsString = (chars) => {
    const reversedChars = chars.split('').reverse().join('');
    let finalString = '';
    for (let i = 0; i < reversedChars.length; i++) {
        finalString += (i % 2 === 0) 
            ? reversedChars[i].toUpperCase() 
            : reversedChars[i].toLowerCase();
    }
    return finalString;
};


// -----------------------------------------------------------------------------
// ## API ENDPOINT
// -----------------------------------------------------------------------------

app.post('/bfhl', (req, res) => {
    try {
        // --- 1. Input Validation ---
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            // If 'data' is missing or not an array, return a 400 Bad Request error.
            // This is a crucial step for building a robust API.
            return res.status(400).json({
                is_success: false,
                user_id: `${userDetails.fullName}_${userDetails.dob}`,
                error_message: "Invalid input: 'data' field is required and must be an array."
            });
        }

        // --- 2. Process Data using Helper Functions ---
        const processed = processArrayData(data);
        const concatString = generateAlternatingCapsString(processed.allAlphabeticalChars);

        // --- 3. Construct Final Response Payload ---
        // This object strictly follows the format required by the assessment.
        const finalResponse = {
            is_success: true,
            user_id: `${userDetails.fullName}_${userDetails.dob}`,
            email: userDetails.email,
            roll_number: userDetails.rollNumber,
            odd_numbers: processed.oddNumbers,
            even_numbers: processed.evenNumbers,
            alphabets: processed.alphabets,
            special_characters: processed.specialCharacters,
            sum: String(processed.sum), // Ensure sum is returned as a string.
            concat_string: concatString
        };

        // --- 4. Send Success Response ---
        return res.status(200).json(finalResponse);

    } catch (error) {
        // Graceful catch-all for any unexpected server errors.
        console.error("An unexpected error occurred:", error); // Log the full error for debugging.
        return res.status(500).json({
            is_success: false,
            user_id: `${userDetails.fullName}_${userDetails.dob}`,
            error_message: `An internal server error occurred: ${error.message}`
        });
    }
});

// -----------------------------------------------------------------------------
// ## SERVER STARTUP
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
    // This message will be printed to the console when the server starts successfully.
    console.log(`🚀 Server is running and listening on port ${PORT}`);
});
