const fs = require("fs");

const {
    signImage,
    drawBackground,
    loadLayerImg,
    drawElement
} = require("./canvas");

const { constructLayerToDna, createUniqueDna } = require("./dna");

const { createDnaListByRarity, getRarity } = require("./rarity");


const createFile = async (
    canvas,
    ctx,
    layers,
    width,
    height,
    editionCount,
    editionSize,
    rarityWeights,
    imageDataArray
) => {
    const dna = constructLoadedElements(
        layers,
        editionCount,
        editionSize,
        rarityWeights
    );

    let attributesList = [];

    await Promise.all(dna.loadedElements).then(elementArray => {
        // create empty image
        ctx.clearRect(0, 0, width, height);
        // draw a random background color
        drawBackground(ctx, width, height);
        // store information about each layer to add it as meta information
        attributesList = [];
        // draw each layer
        elementArray.forEach(element => {
            drawElement(ctx, element);
            let selectedElement = element.layer.selectedElement;
            attributesList.push({
                name: selectedElement.name,
                rarity: selectedElement.rarity
            });
        });
        // add an image signature as the edition count to the top left of the image
        signImage(ctx, `#${editionCount}`);
        // write the image to the output directory
    });

    const base64ImgData = canvas.toBuffer();
    const base64 = base64ImgData.toString("base64");

    let filename = editionCount.toString() + ".png";
    let filetype = "image/png";

    // save locally as file
    fs.writeFileSync(`./output/${filename}`, canvas.toBuffer(filetype));

    console.log(`Created #${editionCount.toString()}`);

    imageDataArray[editionCount] = {
        editionCount: editionCount,
        newDna: dna.newDna,
        attributesList: attributesList
    };

    return imageDataArray;
};

const constructLoadedElements = (
    layers,
    editionCount,
    editionSize,
    rarityWeights
) => {
    let dna = {
        loadedElements: [],
        newDna: null
    };

    // holds which dna has already been used during generation and prepares dnaList object
    const dnaListByRarity = createDnaListByRarity(rarityWeights);

    // get rarity from to config to create NFT as
    let rarity = getRarity(editionCount, editionSize);

    // create unique Dna
    dna.newDna = createUniqueDna(layers, rarity, rarityWeights, dnaListByRarity);
    dnaListByRarity[rarity].push(dna.newDna);

    // propagate information about required layer contained within config into a mapping object
    // = prepare for drawing
    let results = constructLayerToDna(dna.newDna, layers, rarity);

    // load all images to be used by canvas
    results.forEach(layer => {
        dna.loadedElements.push(loadLayerImg(layer));
    });

    return dna;
};


module.exports = {
    createFile,
};