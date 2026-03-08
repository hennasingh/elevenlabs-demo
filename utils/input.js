import { select, input } from '@inquirer/prompts';

export async function askText() {
    return await input({
        message: 'Enter text to convert to speech'
    });
}

export async function chooseVoice(voices) {
    return await select({
        message: 'Choose a voice',
        choices: voices.map((voice) => ({
            name: voice.name,
            value: voice.voiceId
        }))
    });
}