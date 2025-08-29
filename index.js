const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const userDetails = {
    fullName: "Rithwik",
    dob: "12102004",
    email: "rithwik.22bce7548@vitstudent.ac.in",
    rollNumber: "22BCE7548"
};

const processArrayData = (dataArray) => {
    const response = {
        oddNumbers: [],
        evenNumbers: [],
        alphabets: [],
        specialCharacters: [],
        sum: 0,
        allAlphabeticalChars: ""
    };

    for (const item of dataArray) {
        const strItem = String(item);

        if (!isNaN(parseFloat(strItem)) && isFinite(strItem)) {
            const num = Number(strItem);
            response.sum += num;
            if (num % 2 === 0) {
                response.evenNumbers.push(String(num));
            } else {
                response.oddNumbers.push(String(num));
            }
        } 
        else if (/^[a-zA-Z]+$/.test(strItem)) {
            response.alphabets.push(strItem.toUpperCase());
            response.allAlphabeticalChars += strItem;
        } 
        else {
            response.specialCharacters.push(strItem);
        }
    }
    return response;
};

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

// New GET route for the welcome page
app.get('/', (req, res) => {
    const apiPostCode = `
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: \`\${userDetails.fullName}_\${userDetails.dob}\`,
                error_message: "Invalid input: 'data' field is required and must be an array."
            });
        }
        const processed = processArrayData(data);
        const concatString = generateAlternatingCapsString(processed.allAlphabeticalChars);
        const finalResponse = {
            is_success: true,
            user_id: \`\${userDetails.fullName}_\${userDetails.dob}\`,
            email: userDetails.email,
            roll_number: userDetails.rollNumber,
            odd_numbers: processed.oddNumbers,
            even_numbers: processed.evenNumbers,
            alphabets: processed.alphabets,
            special_characters: processed.specialCharacters,
            sum: String(processed.sum),
            concat_string: concatString
        };
        return res.status(200).json(finalResponse);
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({
            is_success: false,
            user_id: \`\${userDetails.fullName}_\${userDetails.dob}\`,
            error_message: \`An internal server error occurred: \${error.message}\`
        });
    }
});`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VIT BFHL API</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f9; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 800px; width: 100%; }
            h1 { color: #007BFF; }
            p { line-height: 1.6; }
            code { background: #e9e9e9; padding: 2px 5px; border-radius: 4px; }
            button { background-color: #007BFF; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px; transition: background-color 0.3s; }
            button:hover { background-color: #0056b3; }
            #apiCode { display: none; margin-top: 20px; text-align: left; background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 400px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the VIT BFHL API</h1>
            <p>This is the landing page. The main logic is at the <code>/bfhl</code> POST endpoint.</p>
            <button id="showCodeBtn">Show /bfhl Endpoint Code</button>
            <pre id="apiCode"><code></code></pre>
        </div>
        <script>
            document.getElementById('showCodeBtn').addEventListener('click', () => {
                const codeBlock = document.getElementById('apiCode');
                const codeContent = ${JSON.stringify(apiPostCode, null, 2)};
                codeBlock.querySelector('code').textContent = codeContent.trim();
                codeBlock.style.display = 'block';
            });
        </script>
    </body>
    </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
});


app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: `${userDetails.fullName}_${userDetails.dob}`,
                error_message: "Invalid input: 'data' field is required and must be an array."
            });
        }

        const processed = processArrayData(data);
        const concatString = generateAlternatingCapsString(processed.allAlphabeticalChars);

        const finalResponse = {
            is_success: true,
            user_id: `${userDetails.fullName}_${userDetails.dob}`,
            email: userDetails.email,
            roll_number: userDetails.rollNumber,
            odd_numbers: processed.oddNumbers,
            even_numbers: processed.evenNumbers,
            alphabets: processed.alphabets,
            special_characters: processed.specialCharacters,
            sum: String(processed.sum),
            concat_string: concatString
        };

        return res.status(200).json(finalResponse);

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({
            is_success: false,
            user_id: `${userDetails.fullName}_${userDetails.dob}`,
            error_message: `An internal server error occurred: ${error.message}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running and listening on port ${PORT}`);
});
