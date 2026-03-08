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
