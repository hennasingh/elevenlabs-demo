import { showMenu} from './menu.js';
import { runTTS } from './eleven/tts.js';
import { runCloneWorkflow } from './eleven/clone.js';
import { runLongText } from './eleven/longtext.js';
import { runStreaming } from './eleven/streaming.js';

async function main() {

    while(true) {
      const action = await showMenu();

      switch(action) {
        case "tts":
          await runTTS();
        break;

        case "stream":
          await runStreaming();
        break;

        case "clone":
          await runCloneWorkflow();
        break;

        case "longtext":
          await runLongText();
        break;

        case "exit":
          console.log("Thanks for using the ElevenLabs Voice Demo! 👋 ");
          process.exit(0);
      }
    }
}

main();