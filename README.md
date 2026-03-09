## Eleven Labs CLI Demo

This is a minimal CLI demo of Eleven Labs API features:

1. Streaming Audio
2. Text To Speech
3. Long Text Handling
4. Voice Cloning

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` and add your Eleven Labs API key `${ELEVENLABS_API_KEY}`
3. Create an empty `output` folder in the root path.
3. For `clone.js`, you will need to provide a voice sample audio file in the samples folder. Please create that folder in the root path. The app will give 401 error if the API key does not have voice cloning permissions. Voice cloning requires a paid starter plan.
4. Run the demo: `node index.js`

## Technology Stack

- @elevenlabs/elevenlabs-js 
- Eleven API
- [Inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) for CLI interface
- [play-sound](https://www.npmjs.com/package/play-sound) for playing audio

## App Features

The app uses `inquirer/prompts` to create an interactive CLI interface. It gives 4 options to choose from:

1. Streaming Audio - runs the `streaming.js` file
2. Text To Speech - runs the `tts.js` file
3. Long Text Handling - runs the `longText.js` file
4. Voice Cloning - runs the `clone.js` file

I am using Model [Eleven Multilingual v2](https://elevenlabs.io/docs/overview/models#multilingual-v2) for all the features.

Voice Clone is not tested as it requires a paid plan. Clicking on this choice further gives 2 choices, either to use sample audio within the repo or provide an external path. The external path option is not implemented atm. 
If you have a paid plan, you can test it by providing a voice sample audio file in the samples folder.

## Eleven API 

### Text To Speech

For text to speech, I am using [getAll()](https://elevenlabs.io/docs/api-reference/legacy/voices/get-all) to get all the available voices. There are 21 voices available to choose. The app workflow will give you a choice  to use one of many voices. Then it will ask you to enter a text to speak. 

The voices can be filtered by category. As per the docs, there should be 4 categories: `premade`, `high_quality`, `generated`, `official`. However, obly `premade` results are returned.

The basic text to speech uses `textToSpeech.convert()` method of the SDK to generate the audio. The output is then saved in the output folder and played automatically.

This is legacy v1 "List voices" endpoint. v1 is still there but Eleven recommends using the v2 endpoint, which I have implemented in the `streaming.js` file. v2 handles pagination well and has advanced filtering available.


### Streaming Audio Generation

Streaming Audio generation uses `textToSpeech.stream()` API to generate the audio. The main difference between `stream()` and `convert()` is how the data is delivered to the application.

1. `eleven.textToSpeech.stream()` returns the audio back as soon as the first few frames are generated. This is the 'low latency' way to do it as the code can start processing or playing the beginning audio while the rest is still being generated..

2. `eleven.textToSpeech.convert()` returns the audio only after the entire audio is generated. This is the 'high latency' way to do it as the code has to wait for the entire audio to be generated before it can start processing or playing the audio.

> Please note that for the large amount of of text, the limits are the same for both stream and convert method because they use the same underline model. The character limit depends on the model used. **Multilingual v2** (the model in this demo): Up to 10,000 characters (roughly 10 minutes of audio). But on the free plan, like mine is capped at 2500 characters per request, regardless of the model.

#### Saving/Playing the Audio
There are different ways to play the generated audio

1. The audio chunks are saved to a file and then played automatically using play-sound package. This is how this demo has implemented it.

2. Streaming the audio to a speaker. This requires additional package installations: speaker, decoder (like mpg123-decoder, minimp3, or lame) and may be other tools. I have not tested this approach.

3. Playing it locally using stream, as its done in [streaming](https://elevenlabs.io/docs/api-reference/streaming) docs. This  relies on a utility called ffplay, that handles the playback on the machine.

4. Elevenlabs also descrbes a way to [upload the audio to AWS S3](https://elevenlabs.io/docs/eleven-api/guides/cookbooks/text-to-speech/streaming) and getting a shared link.


### Voice Cloning

I have implemented [Instant Voice Clone](https://elevenlabs.io/docs/eleven-api/guides/cookbooks/voices/instant-voice-cloning) option in this demo, but at this moment this does not work as voice cloning requires paid plan. The app flows provides two options:

- to use an audio file within the repo (please upload 1-2 min audio file in samples folder in the root directory with the name `voice_demo.m4a` or change this code if different format or naming. This is hard-coded) 

- or provide a path to a file on your local machine 

I have added [voice_settings](https://elevenlabs.io/docs/api-reference/voices/settings/get) object in the convert method to improve the quality of the cloned voice. This is not tested yet.






