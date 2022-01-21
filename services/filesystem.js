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
            ctx.clearRect(0, 0, width, height);
            drawBackground(ctx, width, height);

            loadedElements.forEach(element => {
                drawElement(ctx, element);
                let selectedElement = element.layer.selectedElement;
                attributesList.push({
                    name: selectedElement.name,
                    rarity: selectedElement.rarity
                });
            });
            signImage(ctx, `#${editionCount}`);
        });

        let filename = editionCount.toString() + ".png";
        let filetype = "image/png";

        fs.writeFileSync(`./output/${filename}`, canvas.toBuffer(filetype));

        console.log(`Created #${editionCount.toString()}`);

        const character = {
            editionCount,
            newDna: dna.newDna,
            attributesList
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

        const dnaListByRarity = createDnaListByRarity(rarityWeights);
        const rarity = getRarity(editionCount, editionSize);

        dna = {
            ...dna,
            newDna: createUniqueDna(layers, rarity, rarityWeights, dnaListByRarity)
        }
        dnaListByRarity[rarity].push(dna.newDna);

        const layersResults = constructLayerToDna(dna.newDna, layers, rarity);

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