/**
 * Voice and Audio Utilities for Speech-to-Text and Text-to-Speech
 */

export async function playGeminiAudio(base64Data: string, mimeType = 'audio/wav'): Promise<void> {
  try {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
  } catch (err) {
    console.warn('Failed to play base64 audio, trying fallback:', err);
    throw err;
  }
}

export function speakWithBrowser(text: string, lang: 'en' | 'hi' = 'en') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  lang: 'en' | 'hi' = 'en'
): { stop: () => void } | null {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  try {
    recognition.start();
  } catch (e) {
    onError(e);
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (_) {}
    },
  };
}
