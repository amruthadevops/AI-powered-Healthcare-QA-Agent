'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import jsPDF from 'jspdf'

export default function Home() {
  const [formText, setFormText] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [streamedAnswer, setStreamedAnswer] = useState('')
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const { theme, setTheme } = useTheme()

  interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setFormText("")

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setFormText(data.text || "")
    } catch (err: any) {
      setError(err.message || "Upload error")
    }
  }

  const handleAsk = async () => {
    setError('');
    setAnswer('');
    setStreamedAnswer('');
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formText, question }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Streaming failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'));

        for (const line of lines) {
          const jsonStr = line.replace(/^data: /, '');
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.choices?.[0]?.delta?.content || parsed?.message?.content;
            if (content) {
              result += content;
              setStreamedAnswer(result);
            }
          } catch (err) {
            console.warn('Failed to parse chunk:', line, err);
          }
        }
      }

      setHistory((prev) => [...prev, { question, answer: result }]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setQuestion("Listening...");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.onerror = (event: any) => {
      setError("Speech recognition error: " + event.error);
    };

    recognition.start();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("AI Healthcare QA Answers", 10, 10);

    let y = 20;

    history.forEach((item, idx) => {
      const q = `Q${idx + 1}: ${item.question}`;
      const a = `A${idx + 1}: ${item.answer}`;
      doc.text(q, 10, y);
      y += 10;
      doc.text(a, 10, y);
      y += 15;
    });

    doc.save("chat-answers.pdf");
  };


  return (
    <main className="min-h-screen bg-background text-foreground p-2 md:p-4 flex flex-col md:flex-row">
      {showHistory && (
        <div className="w-full md:w-80 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-xl p-4 mr-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg mb-2">Chat History</h2>
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
              {history.map((item, idx) => (
                <div key={idx} className="border-t pt-2 text-sm">
                  <p className="font-semibold">Q: {item.question}</p>
                  <p>A: {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => setHistory([])} variant="outline" className="mt-4 w-full">
            Clear History
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="mt-2 w-full" >
            📄 Download PDF
          </Button>
        </div>
      )}

      <div className="flex-1 max-w-2xl space-y-6 mx-auto">
        <h1 className="text-3xl font-bold text-center mt-6">
          🩺 AI Healthcare Form QA Agent
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <form onSubmit={handleUpload} className="flex gap-2 items-center">
            <Input name="file" type="file" accept="application/pdf" required />
            <Button type="submit">Upload PDF</Button>
          </form>
          <div className="flex gap-2 justify-center w-full sm:w-auto">
            <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? 'Hide History' : 'Show History'}
            </Button>
            <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Button>
          </div>
        </div>

        {formText && (
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-4 whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
              {formText}
            </CardContent>
          </Card>
        )}

        <Textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder="Paste or edit the form content here..."
          className="min-h-[150px]"
        />

        <div className="flex gap-2">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question like: What is the deductible?"
            className="flex-1"
          />
          <Button type="button" onClick={handleVoiceInput}>🎤</Button>
        </div>


        <Button onClick={handleAsk} disabled={loading} className="w-full">
          {loading ? 'Asking...' : 'Ask AI'}
        </Button>

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 text-center text-gray-500">
            <span className="animate-pulse">Thinking...</span>
          </div>
        ) : streamedAnswer ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
            <h2 className="font-bold mb-2 text-lg">Answer:</h2>
            <p className="whitespace-pre-wrap">{streamedAnswer}</p>
          </div>
        ) : null}
      </div>
    </main>
  )
}
