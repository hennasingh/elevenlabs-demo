import fs from "fs";
import path from "path";
import { eleven } from "./client.js";
import { askText, chooseCloneSource, askAudioPath } from "../utils/input.js";
import { saveAudio, playAudio } from "../utils/audio.js";

export async function runCloneWorkflow() {
  console.log("\nVoice cloning workflow\n");

  try {

    const source = await chooseCloneSource();

    let audioPath;
    if (source == "sample") {
      audioPath = path.resolve('samples/voice_demo.m4a')
    } else {
      audioPath = await askAudioPath();
    }

    if (!fs.existsSync(audioPath)) {
      console.log("Audio file not found.");
      return;
    }

    console.log("\nUploading voice sample...\n");

    const voice = await eleven.voices.ivc.create({
      name: `CLI Clone ${Date.now()}`,
      files: [fs.createReadStream(audioPath)],
      description: "Created via CLI", // Optional
      labels: '{"origin": "cli"}' // Optional
    });

    const voiceId = voice.voiceId;

    console.log(`Voice created: ${voiceId}`);

    const text = await askText();

    console.log("\nGenerating speech with cloned voice...\n");

    const audio = await eleven.textToSpeech.convert(voiceId, {
      text,
      modelId: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0, // Keep this at 0 for now to avoid distortion
        use_speaker_boost: true // This helps with clarity
      }
    });

    const outputPath = path.resolve('output/clone.mp3');

    const fileStream = fs.createWriteStream(outputPath);
    audio.pipe(fileStream);

    fileStream.on('finish', async () => {
      console.log(`Audio saved to ${outputPath} and ready to play!`);
      // Trigger your play-sound logic here
      playAudio(outputPath);

      // Clean up: Delete the cloned voice from ElevenLabs
      console.log(`\nCleaning up: Deleting voice ${voiceId}...`);
      await eleven.voices.delete(voiceId);
      console.log("Voice deleted successfully.");
    });

  } catch (error) {
    console.error("Error running clone workflow:", error.message);
  }
}