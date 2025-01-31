// Import required modules
const fs = require('fs');

// Read JSON data from a file
const filePath = 'input.json'; // Replace with your JSON file path

// Function to fix anchor tags
function fixAnchorTags(jsonArray) {
    return jsonArray.map(item => {
        item.Answer_hi = item.Answer_hi.replace(/<a href=([^\s>]+)\s+target=_blank>([^<]+)<\/a>/g, '<a href="$1" target="_blank">$2</a>');
        return item;
    });
}

// Read and process the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const fixedData = fixAnchorTags(jsonData);

        // Write the fixed JSON back to the file
        fs.writeFile(filePath, JSON.stringify(fixedData, null, 2), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Error writing to the file:', writeErr);
            } else {
                console.log('Anchor tags have been fixed and the file has been updated.');
            }
        });
    } catch (parseErr) {
        console.error('Error parsing the JSON:', parseErr);
    }
});