## Observations in making of the Eleven Labs CLI demo

### Text to speech
1. getAll() is a v1 version to get all voices available in eleven labs. It returned a list of 21 voices.
2. The v2 version is now search()

#### Saving and Playing the audio response
With the fetch API call, the audio response is converted in the following way:
```
const audio = await response.arrayBuffer();
```
The convert() returns stream/iterable or bytes data directly.

From Eleven Agent: 
Actually, the arrayBuffer() approach is what we'd call "buffered." It waits for the entire audio file to be generated and downloaded before you can do anything with it. This is fine for short snippets, but for longer text, the user will be sitting there waiting for the whole thing to finish.
The ReadableStream approach (using getReader()) is for "streaming." This allows you to start playing or processing the audio chunks as soon as they arrive from our servers, which is much better for a snappy, real-time feel.

The TTS snippet works fine after buffering the audio chunks. 

#### Some Improvements
1. Slicing the voice options to 5-10 from 10.
2. Filtering the high quality voices 

```
const voices = response.voices
  .filter(v => v.category === "high_quality")
  .slice(0,5)
```

### Streaming Audio Response

Used getAll() API to fetch the voices but I wanted to try category filtering as explained in the docs here https://elevenlabs.io/docs/api-reference/voices/search but it didn't work as expected.

> category:string (Optional)
Category of the voice to filter by. One of 'premade', 'cloned', 'generated', 'professional'

```
Voices fetched: 21
[
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade',
  'premade', 'premade', 'premade'
]
```

The v2 search API returned 10 voices and all premade category as well. Since I used getAll() in TTS, I decided to use v2 search for streaming.

#### Saving and Playing the audio response

At this moment, there is no difference the way the audio is saved and played for TTS and Streaming. I will explore the streaming approach, where audio plays as it is typed.

### Voice Cloning
This was quite interesting implementation and a lot of learning. You can create a sample audio from your iphone and can use .m4a formats. There are other formats that are supported as well. 

Although I am using 2.36.0 version of elevenlabs-js, but the add method was not supported:
```
    const voice = await eleven.voices.add({
      name: `CLI Clone ${Date.now()}`,
      files: [fs.createReadStream(audioPath)]
    });
```
So I switched to below:
```
    const voice = await eleven.voices.ivc.create({
      name: `CLI Clone ${Date.now()}`,
      files: [fs.createReadStream(audioPath)],
      description: "Created via CLI",
      labels: '{"origin": "cli"}' 
    });
```
When I ran the app, I discovered voice clone is not available in free plan. I need to have atleast a starter plan to use this feature.

I learned about the voice_settings object from the Eleven Agent, passed in convert call.

Here’s the breakdown of the two most important sliders:

1. Stability (0.0 to 1.0)

What it does: Controls how much the AI "sticks to the script" versus being more expressive.
Pro Tip: For a clone, a value around 0.5 is usually the sweet spot. If the voice sounds too monotone, drop it to 0.4. If it starts sounding "glitchy" or inconsistent, bump it up to 0.6.
2. Similarity Boost (0.0 to 1.0)

What it does: This tells the AI how hard it should try to sound exactly like your original sample.
Pro Tip: Since iPhone recordings can sometimes have a bit of "room noise," don't set this to 1.0 or it might try to replicate the background hiss! Try 0.75 first. If it doesn't sound enough like you, move it toward 0.85.
Here is how you'd update that specific part of your code:

#### Saving and playing the audio

This was another interesting learning point. There are 2-3 ways I discovered for saving the audio to a file. Either using arraybuffer or piping the response to a file stream. 
Collecting the chunks into an array and then using Buffer.concat  keeps the entire buffer in memory before saving or playing it.
For long blocks of text, piping directly to a file can be a bit more memory-efficient since it doesn't hold the whole audio in RAM.

