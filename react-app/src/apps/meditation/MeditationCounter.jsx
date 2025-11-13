import React, { useMemo, useState } from 'react';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

const keywords = ['om', 'ram', 'shreem'];

const MeditationCounter = ({ onBack }) => {
  const [goal, setGoal] = useState(108);
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [sessionStart, setSessionStart] = useState(null);

  const { isSupported, isListening, start, stop, transcript } = useSpeechRecognition({
    keywords,
    onMatch: (word) => handleChant(word)
  });

  const handleChant = (word) => {
    setCount((prev) => Math.min(goal, prev + 1));
    if (!sessionStart) setSessionStart(Date.now());
    if (count + 1 === goal) {
      finalizeSession(goal);
      stop();
    }
  };

  const finalizeSession = (total) => {
    if (!sessionStart) return;
    const duration = (Date.now() - sessionStart) / 60000;
    setLogs((prev) => [{ date: new Date().toLocaleString(), total, duration: duration.toFixed(1) }, ...prev]);
    setSessionStart(null);
    setCount(0);
  };

  const pace = useMemo(() => {
    if (!sessionStart || !count) return 0;
    const minutes = (Date.now() - sessionStart) / 60000;
    return minutes ? Math.round(count / minutes) : 0;
  }, [count, sessionStart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-8">
          <div className="space-y-2">
            <p className="uppercase text-xs tracking-[0.3em] text-teal-500">Voice mantra counter</p>
            <h1 className="text-3xl font-bold text-gray-800">Meditation & Mindfulness</h1>
            <p className="text-gray-500">Detect "Om / Ram / Shreem" in real-time and track streaks.</p>
          </div>

          <div className="relative inline-flex flex-col items-center justify-center bg-gradient-to-br from-teal-400 to-cyan-500 text-white rounded-full h-64 w-64 shadow-2xl animate-pulseGlow">
            <span className="text-sm uppercase tracking-[0.3em]">Chants</span>
            <span className="text-7xl font-bold">{count}</span>
            <span className="text-white/70 text-sm">of {goal}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-sm text-gray-500">Pace</p>
              <p className="text-3xl font-semibold text-gray-800">{pace} / min</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-sm text-gray-500">Streak</p>
              <p className="text-3xl font-semibold text-gray-800">{logs.length} days</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50">
              <p className="text-sm text-gray-500">Voice</p>
              <p className="text-3xl font-semibold text-gray-800">{isSupported ? (isListening ? 'Live' : 'Idle') : 'N/A'}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => (isListening ? stop() : start())}
              disabled={!isSupported}
              className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
                isListening ? 'bg-red-500 text-white' : 'bg-teal-500 text-white'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? 'Stop Voice' : 'Start Voice'}
            </button>
            <button
              onClick={() => handleChant('manual')}
              className="px-6 py-3 rounded-full font-semibold bg-gray-900 text-white"
            >
              Tap +1
            </button>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value) || 108)}
              className="px-4 py-3 border border-gray-200 rounded-lg w-32"
            />
          </div>

          {transcript && (
            <div className="bg-gray-50 rounded-2xl p-4 text-left">
              <p className="text-xs text-gray-500 uppercase mb-2">Live transcript</p>
              <p className="text-gray-700 whitespace-pre-line">{transcript}</p>
            </div>
          )}

          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Daily Logs</h2>
            {logs.length === 0 ? (
              <p className="text-gray-500">Complete a session to start your streak.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-white border border-teal-100">
                    <p className="text-sm text-gray-500">{log.date}</p>
                    <p className="text-gray-800 font-semibold">{log.total} chants · {log.duration} mins</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationCounter;
