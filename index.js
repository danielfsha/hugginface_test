import dotenv from 'dotenv'
dotenv.config()

import { HfInference } from "@huggingface/inference";
import express from 'express'

const app = express()
const port = 3000

const HF_TOKEN = process.env.HF_TOKEN

if (!HF_TOKEN) {
    throw new Error("HF_TOKEN not set")
}

const inference = new HfInference(HF_TOKEN)

async function generateImageFromText(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

const imagesToText = async () => {
    const model = 'Salesforce/blip-image-captioning-large'
    const imgUrl = 'https://media.istockphoto.com/id/468364850/photo/female-llama-with-babies.jpg?s=1024x1024&w=is&k=20&c=yT2gd5Em50hX3CfJwJduBUYaGekKFiPtBS1gD4QZXCs='

    const response = await fetch(imgUrl)
    const blob = await response.blob()

    const result = await inference.imageToText({
        data: blob,
        model: model,
    })
}

const textToText = async () => {
    const model = "mistralai/Mistral-7B-Instruct-v0.2"
    const messages = [{ role: "user", content: "write me 4000 words story for kids give it title of The great adventure of the jackie" }]

    const output = await inference.chatCompletion({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.1,
        seed: 0,
    });

    return output
}


app.get('/', async (req, res) => {
    const output = await textToText()
    res.status(200).send({ output })
})

app.get('/text-to-image', async (req, res) => {
    generateImageFromText({ "inputs": "Astronaut riding a horse" }).then((response) => {
        // Use image
        console.log(response)
    });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})