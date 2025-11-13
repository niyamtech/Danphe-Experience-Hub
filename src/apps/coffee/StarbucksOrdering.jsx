import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

const drinks = ['Latte', 'Cappuccino', 'Espresso', 'Flat White', 'Mocha'];
const sizes = ['Tall', 'Grande', 'Venti'];
const milks = ['Whole', 'Skim', 'Oat', 'Almond'];
const syrups = ['Vanilla', 'Caramel', 'Hazelnut', 'Sugar-free'];

const StarbucksOrdering = ({ onBack }) => {
  const [name, setName] = useState('');
  const [drink, setDrink] = useState(drinks[0]);
  const [size, setSize] = useState(sizes[1]);
  const [milk, setMilk] = useState(milks[0]);
  const [syrup, setSyrup] = useState(syrups[0]);
  const [note, setNote] = useState('');
  const [orders, setOrders] = useState([
    { id: 1, ticket: 'A102', name: 'Maya', drink: 'Flat White', size: 'Grande', status: 'preparing' },
    { id: 2, ticket: 'A103', name: 'Leo', drink: 'Latte', size: 'Venti', status: 'waiting' }
  ]);
  const [notification, setNotification] = useState(null);

  const { isSupported, isListening, start, stop, transcript } = useSpeechRecognition({
    keywords: drinks.map((d) => d.toLowerCase()),
    onMatch: (word, phrase) => handleVoiceOrder(word, phrase)
  });

  const createTicket = () => `A${Math.floor(Math.random() * 900 + 100)}`;

  const addOrder = (payload) => {
    const order = {
      id: Date.now(),
      ticket: createTicket(),
      status: 'waiting',
      ...payload
    };
    setOrders((prev) => [...prev, order]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addOrder({ name, drink, size, milk, syrup, note });
    setName('');
    setNote('');
  };

  const handleVoiceOrder = (word, phrase) => {
    addOrder({ name: 'Voice Guest', drink: word, size: 'Grande', milk: 'Oat', syrup: 'Vanilla', note: phrase });
  };

  const updateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    if (status === 'ready') {
      const order = orders.find((o) => o.id === id);
      if (order) {
        setNotification(`Hey ${order.name}, your ${order.drink} is ready!`);
        setTimeout(() => setNotification(null), 4000);
      }
    }
  };

  const removeOrder = (id) => setOrders((prev) => prev.filter((order) => order.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-5xl mx-auto space-y-6">
        {notification && (
          <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold">
            {notification}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Starbucks Live Queue</h1>
              <p className="text-gray-500">Customize drinks, capture voice orders & push tickets to baristas.</p>
            </div>
            <button
              onClick={() => (isListening ? stop() : start())}
              disabled={!isSupported}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
                isListening ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? 'Stop Voice' : 'Voice Order'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <select value={drink} onChange={(e) => setDrink(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg">
              {drinks.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg">
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select value={milk} onChange={(e) => setMilk(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg">
              {milks.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select value={syrup} onChange={(e) => setSyrup(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-lg">
              {syrups.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions"
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold">
              Add to Queue
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Live Queue</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border border-amber-100 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    Ticket {order.ticket} · {order.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.size} {order.drink} · {order.milk} milk · {order.syrup} syrup {order.note && `· ${order.note}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {['waiting', 'preparing', 'ready'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === status ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button onClick={() => removeOrder(order.id)} className="px-3 py-1 rounded-full bg-red-100 text-red-600">
                    Clear
                  </button>
                </div>
              </div>
            ))}
            {!orders.length && <p className="text-gray-500">Queue is empty.</p>}
          </div>
        </div>

        {transcript && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice transcript</h3>
            <p className="text-gray-600 whitespace-pre-line">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarbucksOrdering;
