"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// Web Speech API types
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  speechSynthesis: SpeechSynthesis;
  SpeechSynthesisUtterance: {
    new (text?: string): SpeechSynthesisUtterance;
    prototype: SpeechSynthesisUtterance;
  };
}

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  feedback: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  supportedCommands: string[];
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const supportedCommands = [
    "go to dashboard",
    "go home",
    "scan qr",
    "find bins",
    "open rewards",
    "read page",
    "stop",
    "dark mode",
    "light mode",
    "go back",
    "help",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const command = event.results[0][0].transcript.toLowerCase();
          setTranscript(command);
          processCommandRef.current(command); // Use ref to access latest closure
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setFeedback("Didn't catch that");
          setTimeout(() => setFeedback(""), 2000);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      if (win.speechSynthesis) {
        synthRef.current = win.speechSynthesis;
      }
    }
  }, [router]);

  const processCommand = (command: string) => {
    console.log("Processing command:", command);
    const cleanCommand = command.trim();
    
    // Command Processing Logic
    if (cleanCommand.includes("dashboard")) {
        speak("Navigating to Dashboard");
        setFeedback("Navigating to Dashboard...");
        router.push("/dashboard");
    } else if (cleanCommand.includes("home")) {
        speak("Going Home");
        setFeedback("Going Home...");
        router.push("/");
    } else if (cleanCommand.includes("scan") || cleanCommand.includes("camera")) {
        speak("Opening Scanner");
        setFeedback("Opening Scanner...");
        router.push("/scan");
    } else if (cleanCommand.includes("map") || cleanCommand.includes("bin") || cleanCommand.includes("find")) {
        speak("Finding Bins");
        setFeedback("Finding Bins...");
        router.push("/smart-bin");
    } else if (cleanCommand.includes("reward") || cleanCommand.includes("point")) {
        speak("Opening Rewards");
        setFeedback("Opening Rewards...");
        router.push("/rewards");
    } else if (cleanCommand.includes("read") || cleanCommand.includes("speak") || cleanCommand.includes("narrate")) {
        setFeedback("Reading page content...");
        const mainContent = document.querySelector("main")?.innerText;
        if (mainContent) {
            speak(mainContent.slice(0, 500)); 
        } else {
            speak("No main content found to read.");
        }
    } else if (cleanCommand.includes("stop") || cleanCommand.includes("silence") || cleanCommand.includes("quiet")) {
        setFeedback("Stopping playback");
        if (synthRef.current) {
            synthRef.current.cancel();
        }
    } else if (cleanCommand.includes("dark mode") || cleanCommand.includes("night mode")) {
        speak("Switching to dark mode");
        setFeedback("Dark Mode On");
        setTheme("dark");
    } else if (cleanCommand.includes("light mode") || cleanCommand.includes("day mode")) {
        speak("Switching to light mode");
        setFeedback("Light Mode On");
        setTheme("light");
    } else if (cleanCommand.includes("go back") || cleanCommand.includes("back") && !cleanCommand.includes("go to")) { // Avoid "go to" triggering back
        speak("Going back");
        setFeedback("Going Back...");
        router.back();
    } else if (cleanCommand.includes("help") || cleanCommand.includes("what can you do")) {
        const helpText = "You can say: " + supportedCommands.join(", ");
        setFeedback("Showing commands...");
        speak(helpText);
    } else {
        setFeedback(`Unknown: "${cleanCommand}"`);
    }

    setTimeout(() => {
        setFeedback("");
        setTranscript("");
    }, 3000);
  };

  // Ref to always access the latest processCommand function
  const processCommandRef = useRef(processCommand);
  useEffect(() => {
    processCommandRef.current = processCommand;
  });

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1; 
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  const playBeep = (type: 'start' | 'end' = 'start') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'start') {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } else {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime); 
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        playBeep('start');
        recognitionRef.current.start();
        setIsListening(true);
        setFeedback("Listening...");
      } catch (e) {
        console.error("Error starting recognition:", e);
      }
    } else {
      alert("Voice recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      playBeep('end');
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        feedback,
        startListening,
        stopListening,
        speak,
        supportedCommands,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}
