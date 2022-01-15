
const { createCanvas } = require("canvas");

const {
    layers,
    width,
    height,
    editionSize,
    startEditionFrom,
    rarityWeights
} = require("../input/config");


const { compileMetadata } = require("../services/metadata");

const { createFile } = require("../services/filesystem");


module.exports = async (req, res) => {
    try {

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        console.log("##################");
        console.log("# - Surf Bums coming out of the tube");
        console.log("##################");

        // image data collection
        let imageDataArray = [];

        // create NFTs from startEditionFrom to editionSize
        let editionCount = startEditionFrom;

        while (editionCount <= editionSize) {
            console.log("-----------------");
            console.log("Creating %d of %d", editionCount, editionSize);

            const handleFinal = async () => {
                // create image files and return object array of created images
                [...imageDataArray] = await createFile(
                    canvas,
                    ctx,
                    layers,
                    width,
                    height,
                    editionCount,
                    editionSize,
                    rarityWeights,
                    imageDataArray
                );
            };

            await handleFinal();
            editionCount++;
        }

        await compileMetadata(editionCount, imageDataArray);

        console.log();
        console.log("#########################################");
        console.log("Welcome to Hacienda Cerritos - Meet the Resident Surf Bums");
        console.log("#########################################");
        console.log();

        return res.json({ message: 'success' })

    } catch (error) {
        return res.json({ error })
    }
}