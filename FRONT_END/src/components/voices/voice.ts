import { useEffect, useState } from "react";

export function useSpeech() {
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window) || !window.speechSynthesis) {
            return;
        }

        const loadVoices = () => {
            try {
                const voices = window.speechSynthesis.getVoices() || [];
                const preferred =
                    voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
                    voices.find(v => v.lang === "en-US") ||
                    voices[0];

                if (preferred) {
                    setVoice(preferred);
                    setReady(true);
                }
            } catch (e) {
                console.warn("SpeechSynthesis error:", e);
            }
        };

        loadVoices();

        try {
            if (window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        } catch (e) {
            console.warn("SpeechSynthesis onvoiceschanged error:", e);
        }

        return () => {
            try {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
                    window.speechSynthesis.onvoiceschanged = null;
                }
            } catch (e) {
            
            }
        };
    }, []);

    const speak = (text: string) => {
        if (!text || typeof window === 'undefined') return;

       
        const isSpeechSupported = 'speechSynthesis' in window && !!window.speechSynthesis;

        if (isSpeechSupported) {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                if (voice) utterance.voice = voice;
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.lang = "en-US";

                window.speechSynthesis.speak(utterance);
                return;
            } catch (e) {
                console.warn("speechSynthesis failed, falling back to Audio:", e);
            }
        }

    
        try {
            const cleanText = encodeURIComponent(text.trim());
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=en&client=tw-ob`;
            const audio = new Audio(audioUrl);
            audio.play().catch((err) => {
                console.warn("Audio play blocked by browser policy:", err);
            });
        } catch (err) {
            console.error("Audio TTS error:", err);
        }
    }

    return {
        speak,
        ready
    }
}