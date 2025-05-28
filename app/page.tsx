"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Square, Volume2, Settings, Download } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState<string>("Welcome to SpeakEasy, your text to speech companion. Type something to get started!");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [pitch, setPitch] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("text");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis;
      
      // Get available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);
        
        // Set default voice
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
      
      // Clean up on unmount
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel();
        }
      };
    }
  }, []);

  // Handle speech events
  useEffect(() => {
    if (!utterance.current) return;
    
    const handleEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.current.onend = handleEnd;
    utterance.current.onerror = handleEnd;
    
    return () => {
      if (utterance.current) {
        utterance.current.onend = null;
        utterance.current.onerror = null;
      }
    };
  }, [utterance.current]);

  const speak = () => {
    if (!synth.current) return;
    
    // Cancel any ongoing speech
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    
    // Create new utterance
    utterance.current = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.current.voice = voice;
    }
    
    // Set pitch and rate
    utterance.current.pitch = pitch;
    utterance.current.rate = rate;
    
    // Handle speech end
    utterance.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      
      // Stop recording if it was started
      if (isRecording) {
        setTimeout(() => {
          stopRecording();
        }, 500); // Small delay to capture the end of speech
      }
    };
    
    // Start speaking
    synth.current.speak(utterance.current);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pause = () => {
    if (!synth.current) return;
    
    if (isSpeaking && !isPaused) {
      synth.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (!synth.current) return;
    
    synth.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const startRecording = async () => {
    try {
      // Get audio stream from the system
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const downloadAudio = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speakeasy-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const speakAndRecord = async () => {
    if (!synth.current) return;
    
    // Start recording first
    await startRecording();
    
    // Small delay to ensure recording is started
    setTimeout(() => {
      speak();
    }, 100);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">SpeakEasy</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300">
            Convert your text to natural-sounding speech
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Text to Speech</CardTitle>
            <CardDescription>
              Enter text, customize voice settings, and listen to the result
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="settings">Voice Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <Button 
                    onClick={speak} 
                    disabled={!text || (isSpeaking && !isPaused) || isRecording}
                    className="flex items-center gap-2"
                  >
                    <Play size={16} />
                    {isSpeaking && !isPaused ? "Speaking..." : "Speak"}
                  </Button>
                  
                  <Button 
                    onClick={speakAndRecord} 
                    disabled={!text || isSpeaking || isRecording}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    {isRecording ? "Recording..." : "Speak & Record"}
                  </Button>
                  
                  <Button 
                    onClick={pause} 
                    disabled={!isSpeaking || isRecording}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Pause size={16} />
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  
                  <Button 
                    onClick={stop} 
                    disabled={!isSpeaking}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Square size={16} />
                    Stop
                  </Button>
                  
                  {audioBlob && (
                    <Button 
                      onClick={downloadAudio}
                      variant="outline"
                      className="flex items-center gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                    >
                      <Download size={16} />
                      Download Audio
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="flex items-center justify-center mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording audio...</span>
                    </div>
                  </div>
                )}

                {audioBlob && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 text-center">
                      ✅ Audio recorded successfully! Click "Download Audio" to save the file.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Voice</label>
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Volume2 size={16} /> Pitch: {pitch.toFixed(1)}
                      </label>
                    </div>
                    <Slider
                      value={[pitch]}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setPitch(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Settings size={16} /> Rate: {rate.toFixed(1)}
                      </label>
                    </div>
                    <Slider
                      value={[rate]}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setRate(value[0])}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setActiveTab("text")}>
                    Back to Text
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between flex-wrap">
            <p className="text-sm text-gray-500">
              Using Web Speech API
            </p>
            {isSpeaking && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {isPaused ? "Paused" : "Speaking..."}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
