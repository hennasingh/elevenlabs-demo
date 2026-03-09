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

export async function chooseCloneSource() {
    return await select ( {
        message: 'Choose an audio source for cloning',
        choices: [
            {
                name: "Use sample audio within this project",
                value: "sample"
            },
            {
                name: 'Provide custom audio path',
                value: 'custom'
            }
        ]
    });
}

export async function askAudioPath() {
    return await input({
        message: 'Enter path to audio file'
    });
}

export async function chooseLongTextStrategy() {
    return await select({
        message: 'Choose a strategy for handling long text',
        choices: [
            {
                name: 'Chunk text automatically',
                value: 'chunk'
            },
            {
                name: 'Use Elevenlabs long-form endpoint',
                value: 'longform'
            }
        ]
    });
}