import path from 'path';
import { eleven } from './client.js';
import { askText, chooseVoice } from '../utils/input.js';
import { saveAudio, playAudio } from '../utils/audio.js';


export async function runTTS() {
  console.log("Fetching available voices...");

  try {

    const voicesResponse = await eleven.voices.getAll();
    const voices = voicesResponse.voices;

    const selectedVoice = await chooseVoice(voices);

    const text = await askText();

    console.log("\nGenerating speech...\n");

    const audio = await eleven.textToSpeech.convert(selectedVoice, {
      text,
      modelId: "eleven_multilingual_v2"
    });

    // Save the audio to a file
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    const outputPath = path.resolve(process.cwd(), 'output', 'tts.mp3');

    saveAudio(audioBuffer, outputPath);
    console.log(`Audio saved to ${outputPath}`);

    playAudio(outputPath);

  } catch (error) {
    console.error("Error in TTS:", error.message);
  }
}