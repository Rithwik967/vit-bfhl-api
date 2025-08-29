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
