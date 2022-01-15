const fs = require("fs");


const compileMetadata = async (editionCount, imageDataArray) => {
    ipfsArray = [];
    promiseArray = [];

    for (let i = 1; i < editionCount; i++) {
        let id = i.toString();
        let paddedHex = (
            "0000000000000000000000000000000000000000000000000000000000000000" + id
        ).slice(-64);

        // reads output folder for images and adds to IPFS object metadata array (within promise array)
        promiseArray.push(
            new Promise((res, rej) => {
                fs.readFile(`../output/${id}.png`, (err, data) => {
                    if (err) rej();
                    ipfsArray.push({
                        path: `images/${paddedHex}.png`,
                        content: data.toString("base64")
                    });
                    res();
                });
            })
        );
    }

    await uploadMetadata(editionSize, imageDataArray);

};

const uploadMetadata = async (
    editionSize,
    imageDataArray
) => {
    const ipfsArray = []; // holds all IPFS data
    const metadataList = []; // holds metadata for all NFTs (could be a session store of data)
    const promiseArray = []; // array of promises so that only if finished, will next promise be initiated

    for (let i = 1; i < editionSize + 1; i++) {
        let id = i.toString();

        // do something else here after firstFunction completes
        let nftMetadata = generateMetadata(
            imageDataArray[i].newDna,
            imageDataArray[i].editionCount,
            imageDataArray[i].attributesList,
            imageDataArray[i].filePath
        );
        metadataList.push(nftMetadata);

        // save locally as file
        fs.writeFileSync(
            `../output/${filename}`,
            JSON.stringify(metadataList.find(meta => meta.edition == i))
        );

        // reads output folder for json files and then adds to IPFS object array
        promiseArray.push(
            new Promise((res, rej) => {
                fs.readFile(`../output/${id}.json`, (err, data) => {
                    if (err) rej();
                    ipfsArray.push({
                        path: `metadata/${paddedHex}.json`,
                        content: data.toString("base64")
                    });
                    res();
                });
            })
        );
    }

    writeMetaData(metadataList);
};

const writeMetaData = metadataList => {
    fs.writeFileSync("../output/_metadata.json", JSON.stringify(metadataList));
};

const generateMetadata = (dna, edition, attributesList, path) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: dna.join(""),
        name: `#${edition}`,
        description: description,
        image: path || baseImageUri,
        edition: edition,
        date: dateTime,
        attributes: attributesList
    };
    return tempMetadata;
};


module.exports = {
    compileMetadata
};