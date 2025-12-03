

// get data from file in options
const filePath = process.argv[2];
if (!filePath) {
    throw new Error("You must provide a file path");
}   

const indexSize = require(filePath);


["nbRecords", "totalSize", "averageRecordSize", "userDataSize", "facets", "exactForm", "numerics","geoloc","distinct","synonyms","rules","hashVectors"].forEach(key => {
    if (indexSize[key] !== undefined) {
        console.log(`"${key}","${indexSize[key]}"`);
    } else {
        console.log(`"${key}","N/A"`);
    }
});

// Log searchable attributes
console.log('"== searchableAttributes =="');
Object.entries(indexSize.searchableAttributes).forEach(entry => {
    const [key, value] = entry;
    console.log(`"${key} -- size","${value.size}"`);
    console.log(`"${key} -- sizeOfPrefix","${value.sizeOfPrefix}"`);
});

    
