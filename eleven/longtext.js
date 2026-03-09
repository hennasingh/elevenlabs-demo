import fs from "fs";
import path from "path";
import { eleven } from "./client.js";
import { chooseVoice, askText, chooseLongTextStrategy } from "../utils/input.js";
import { playAudio } from "../utils/audio.js";

async function writeAudioToStream(audio, writeStream) {
  for await (const chunk of audio) {
    writeStream.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
}
/**
 * 
 *  The client side chunking to stay within the per *request text limits
 */
function splitTextIntoChunks(text, maxLength = 500) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];

  let currentChunk = "";

  for (const sentence of sentences) {
    const nextChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;

    if (nextChunk.length > maxLength && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = nextChunk;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}


export async function runLongText() {
  console.log("\nLong text processing.. \n");

  try {

    const strategy = await chooseLongTextStrategy();

    const response = await eleven.voices.search();

    const voiceId = await chooseVoice(response.voices);

    const text = await askText();

    const outputPath = path.resolve('output/longtext.mp3');
    const writeStream = fs.createWriteStream(outputPath);

    writeStream.on('error', (err) => {
      console.error("Error writing to file:", err.message);
    });

    if (strategy == 'chunk') {
      console.log('\nChunking text...\n');

      const chunks = splitTextIntoChunks(text);
      console.log(`Text split into ${chunks.length} chunks`);

      let index = 1;
      for (const chunk of chunks) {
        console.log(`Processing chunk ${index} of ${chunks.length}...`);

        const audio = await eleven.textToSpeech.convert(voiceId, {
          text: chunk,
          modelId: 'eleven_multilingual_v2'
        });

        index++;
        await writeAudioToStream(audio, writeStream);
      }
    } else {
      console.log('\n Using long-form generation..\n');

      const audio = await eleven.textToSpeech.convert(voiceId, {
        text,
        modelId: 'eleven_turbo_v2_5'
      });

      await writeAudioToStream(audio, writeStream);
    }

    writeStream.end(() => {
      console.log(`\nAudio saved to ${outputPath}\n`);
      playAudio(outputPath);
    });

  } catch (error) {
    console.error("Error in long text processing:", error.message);
  }
}