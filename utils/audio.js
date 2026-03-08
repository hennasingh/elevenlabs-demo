import fs from "fs";
import player from 'play-sound'

const audioPlayer = player({});

export function saveAudio(buffer, path){
    fs.writeFileSync(path, buffer);
}

export function playAudio(path){
    audioPlayer.play(path, function (err) {
        if (err) {
            console.error("Error playing audio:", err);
        }
    });
}