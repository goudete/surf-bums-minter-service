const fs = require("fs");

const {
    signImage,
    drawBackground,
    loadLayerImg,
    drawElement
} = require("./canvas");

const { constructLayerToDna, createUniqueDna } = require("./dna");
const { createDnaListByRarity, getRarity } = require("./rarity");


const createCharacter = async (
    canvas,
    ctx,
    layers,
    width,
    height,
    editionCount,
    editionSize,
    rarityWeights,
) => {
    try {
        const dna = createDna(
            layers,
            editionCount,
            editionSize,
            rarityWeights
        );

        let attributesList = [];

        await Promise.all(dna.loadedElements).then(loadedElements => {
            // create empty image
            ctx.clearRect(0, 0, width, height);
            // draw a random background color
            drawBackground(ctx, width, height);

            // draw each layer
            loadedElements.forEach(element => {
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

        let filename = editionCount.toString() + ".png";
        let filetype = "image/png";

        // save locally as file
        fs.writeFileSync(`./output/${filename}`, canvas.toBuffer(filetype));

        console.log(`Created #${editionCount.toString()}`);

        const character = {
            editionCount,
            newDna: dna.newDna,
            attributesList: attributesList
        }

        return character;

    } catch (error) {
        console.log('error in createFile', error)
    }
};

const createDna = (
    layers,
    editionCount,
    editionSize,
    rarityWeights
) => {
    try {

        let dna = {
            loadedElements: [],
            newDna: null
        };

        // holds which dna has already been used during generation and prepares dnaList object
        const dnaListByRarity = createDnaListByRarity(rarityWeights);

        // get rarity from to config to create NFT as
        let rarity = getRarity(editionCount, editionSize);

        // create unique Dna
        dna = {
            ...dna,
            newDna: createUniqueDna(layers, rarity, rarityWeights, dnaListByRarity)
        }
        dnaListByRarity[rarity].push(dna.newDna);

        // propagate information about required layer contained within config into a mapping object
        // = prepare for drawing
        let layersResults = constructLayerToDna(dna.newDna, layers, rarity);

        // load all images to be used by canvas
        layersResults.forEach(layer => {
            dna.loadedElements.push(loadLayerImg(layer));
        });

        return dna;

    } catch (error) {
        console.log('error in constructLoadedElements:', error)
    }
};


module.exports = {
    createCharacter,
};