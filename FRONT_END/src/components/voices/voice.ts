import { useEffect, useState } from "react";

export function useSpeech () {
    const [voice, setVoice] = useState<SpeechSynthesisVoice |null >(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();

      const preferred =
        voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find(v => v.lang === "en-US");

      if (preferred) {
        setVoice(preferred);
        setReady(true);
      }
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

    const speak = (text : string) => {
        if (!ready || !voice) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = "en-US";

        speechSynthesis.speak(utterance);
    }
    return {
        speak, 
        ready
    }
}