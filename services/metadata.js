const fs = require("fs");


const compileMetadata = async (characters) => {
    try {
        let metadataList = [];

        for (let i = 0; i < characters.length; i++) {

            let filename = (i+1).toString() + ".json";
            let characterMetadata = generateMetadata(
                characters[i]?.newDna,
                characters[i]?.editionCount,
                characters[i]?.attributesList,
            );
            metadataList.push(characterMetadata);

            let data = JSON.stringify(characterMetadata);
            console.log('data:', data)
            fs.writeFileSync(`./output/${filename}`, data)
        }
    } catch (error) {
        console.log(error)
    }
};

const generateMetadata = (dna, edition, attributesList) => {
    try {
        let dateTime = Date.now();
        let tempMetadata = {
            dna: dna.join(""),
            name: `#${edition}`,
            edition: edition,
            date: dateTime,
            attributes: attributesList
        };
        return tempMetadata;
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    compileMetadata
};