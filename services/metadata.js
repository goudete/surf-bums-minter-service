const fs = require("fs");


const compileMetadata = async (editionSize, characters) => {

    let metadataList = [];

    for (let i = 1; i < editionSize + 1; i++) {
        
        let filename = i.toString() + ".json";
        let characterMetadata = generateMetadata(
            characters[i].newDna,
            characters[i].editionCount,
            characters[i].attributesList,
        );
        metadataList.push(characterMetadata);

        let data = JSON.stringify(characterMetadata);
        fs.writeFileSync(`../output/${filename}`, data);
    }

};

const generateMetadata = (dna, edition, attributesList) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: dna.join(""),
        name: `#${edition}`,
        edition: edition,
        date: dateTime,
        attributes: attributesList
    };
    return tempMetadata;
};


module.exports = {
    compileMetadata
};