import { select } from '@inquirer/prompts';

export async function showMenu() {
    const action = await select({
        message: "Choose an option",
        choices: [
            {
                name: "Streaming Audio Generation",
                value: "stream"
            },
            {
                name: "Voice Cloning Workflow",
                value: "clone"
            },
            {
                name: "Handling long Text Inputs",
                value: "longtext"
            },
            {
                name: "Text To Speech",
                value: "tts"
            },
            {
                name: "Exit",
                value: "exit"
            }
        ],
    });
    return action;
}