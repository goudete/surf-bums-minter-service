
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
const { createCharacter } = require("../services/filesystem");


module.exports = async (req, res) => {
    try {

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        console.log("##################");
        console.log("# - Surf Bums coming out of the tube");
        console.log("##################");

        let characters = [];
        let editionCount = startEditionFrom;

        while (editionCount <= editionSize) {
            console.log("-----------------");
            console.log("Creating %d of %d", editionCount, editionSize);

            const giveBirth = async () => {
                const character = await createCharacter(
                    canvas,
                    ctx,
                    layers,
                    width,
                    height,
                    editionCount,
                    editionSize,
                    rarityWeights,
                );
                characters.push(character);
            };

            await giveBirth();
            editionCount++;
        }

        await compileMetadata(editionSize, characters);

        console.log();
        console.log("#########################################");
        console.log("Welcome to Hacienda Cerritos - Meet the Resident Surf Bums");
        console.log("#########################################");
        console.log();

        return res.json({
            message: 'success',
            characters
        })

    } catch (error) {
        console.log(error)
    }
}