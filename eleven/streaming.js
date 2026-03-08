import path from "path";
import fs from "fs";
import { eleven } from "./client.js";
import { askText, chooseVoice } from "../utils/input.js";
import { playAudio } from "../utils/audio.js";


export async function runStreaming() {
  console.log("\nFetching voices for streaming....\n");

  try {

    const response = await eleven.voices.search();

    const voices = response.voices

    console.log("Voices fetched:", voices.length);

    const selectedVoice = await chooseVoice(voices);
    console.log(selectedVoice);

    const text = await askText();

    console.log("\nStarting audio stream...\n");

    const audioStream = await eleven.textToSpeech.stream(selectedVoice, {
      text,
      model_id: "eleven_multilingual_v2"
    });

    const outputPath = path.resolve(process.cwd(), 'output', 'stream.mp3');
    const writeStream = fs.createWriteStream(outputPath);

    let chunkCount = 0;
    for await (const chunk of audioStream) {
      writeStream.write(chunk);
      chunkCount++;
      process.stdout.write(`Receiving audio chunk ${chunkCount} ...\r`);
    }
    writeStream.end();
    console.log(`\nStreaming complete. Saved to ${outputPath}`);

    playAudio(outputPath);


  } catch (error) {
    console.error("Error fetching voices:", error.message);
  }
}