import React, { useMemo, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { initialShifts, regions, statuses } from '../../data/shifts.js';

const defaultShift = {
  driver: '',
  trainNo: '',
  region: 'East',
  startTime: '',
  endTime: '',
  status: 'On Time',
  delayMinutes: 0
};

const ProductivityTracker = ({ onBack }) => {
  const [shifts, setShifts] = useState(initialShifts);
  const [form, setForm] = useState(defaultShift);
  const [filterDate, setFilterDate] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.driver || !form.trainNo || !form.startTime || !form.endTime) return;
    const newShift = {
      ...form,
      id: `SFT-${Date.now()}`,
      delayMinutes: Number(form.delayMinutes || 0)
    };
    setShifts((prev) => [newShift, ...prev]);
    setForm(defaultShift);
  };

  const filteredShifts = useMemo(() => {
    if (!filterDate) return shifts;
    return shifts.filter((shift) => shift.startTime.slice(0, 10) === filterDate);
  }, [filterDate, shifts]);

  const totals = useMemo(() => {
    const totalDelay = filteredShifts.reduce((acc, shift) => acc + shift.delayMinutes, 0);
    const delayedCount = filteredShifts.filter((shift) => shift.status !== 'On Time').length;
    const onTime = filteredShifts.length - delayedCount;
    return {
      totalDelay,
      avgDelay: filteredShifts.length ? Math.round(totalDelay / filteredShifts.length) : 0,
      onTimeRate: filteredShifts.length ? Math.round((onTime / filteredShifts.length) * 100) : 0
    };
  }, [filteredShifts]);

  const regionTotals = useMemo(() => {
    return regions.map((region) => {
      const total = filteredShifts
        .filter((shift) => shift.region === region)
        .reduce((acc, shift) => acc + shift.delayMinutes, 0);
      return { region, total };
    });
  }, [filteredShifts]);

  const dailyLoss = useMemo(() => {
    return filteredShifts.reduce((acc, shift) => {
      const day = shift.startTime.slice(0, 10);
      acc[day] = (acc[day] || 0) + shift.delayMinutes;
      return acc;
    }, {});
  }, [filteredShifts]);

  const exportCsv = () => {
    const header = 'Shift Id,Driver,Train,Region,Start,End,Status,Delay Minutes';
    const rows = filteredShifts.map(
      (shift) =>
        [
          shift.id,
          shift.driver,
          shift.trainNo,
          shift.region,
          shift.startTime,
          shift.endTime,
          shift.status,
          shift.delayMinutes
        ].join(',')
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productivity-shifts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-indigo-500 font-semibold">
                Logistics Command Center
              </p>
              <h1 className="text-3xl font-bold text-gray-800">Train Driver Productivity Tracker</h1>
              <p className="text-gray-600 mt-2">
                Monitor shift health, detect delays and export actionable CSV reports.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <label className="text-sm font-medium text-gray-600">Filter by Day</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <p className="text-sm uppercase tracking-wide opacity-80">Total Delay</p>
              <p className="text-4xl font-bold">{totals.totalDelay}m</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-blue-100">
              <p className="text-sm uppercase tracking-wide text-blue-500">Average Delay</p>
              <p className="text-4xl font-bold text-gray-800">{totals.avgDelay}m</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-indigo-100">
              <p className="text-sm uppercase tracking-wide text-indigo-500">On-Time Rate</p>
              <p className="text-4xl font-bold text-gray-800">{totals.onTimeRate}%</p>
            </div>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add Shift</h2>
              <p className="text-gray-600">Capture every driver shift and delay event</p>
            </div>
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="driver"
              value={form.driver}
              onChange={handleChange}
              placeholder="Driver name"
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <input
              name="trainNo"
              value={form.trainNo}
              onChange={handleChange}
              placeholder="Train number"
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <select name="region" value={form.region} onChange={handleChange} className="px-4 py-3 border border-gray-200 rounded-lg">
              {regions.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="px-4 py-3 border border-gray-200 rounded-lg">
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <input
              type="number"
              min="0"
              name="delayMinutes"
              value={form.delayMinutes}
              onChange={handleChange}
              placeholder="Delay minutes"
              className="px-4 py-3 border border-gray-200 rounded-lg"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Log Shift
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Regional Productivity Heatmap</h3>
            <div className="grid grid-cols-2 gap-4">
              {regionTotals.map((region) => (
                <div
                  key={region.region}
                  className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50"
                >
                  <p className="text-gray-500 text-sm">{region.region} Corridor</p>
                  <p className="text-3xl font-bold text-gray-800">{region.total}m</p>
                  <p className="text-xs text-gray-500">productivity loss today</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Total Loss</h3>
            <div className="space-y-3">
              {Object.entries(dailyLoss).map(([day, total]) => (
                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">{new Date(day).toLocaleDateString()}</p>
                    <p className="font-semibold text-gray-800">{total} minutes</p>
                  </div>
                  <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                      style={{ width: `${Math.min(100, total)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {!Object.keys(dailyLoss).length && (
                <p className="text-gray-500">No shifts logged for the selected date.</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Shift Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="pb-3">Driver</th>
                  <th>Train</th>
                  <th>Region</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th className="text-right">Delay (m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShifts.map((shift) => (
                  <tr key={shift.id} className="text-sm">
                    <td className="py-3 font-medium text-gray-800">{shift.driver}</td>
                    <td>{shift.trainNo}</td>
                    <td>{shift.region}</td>
                    <td>{new Date(shift.startTime).toLocaleString()}</td>
                    <td>{new Date(shift.endTime).toLocaleString()}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          shift.status === 'On Time'
                            ? 'bg-green-100 text-green-700'
                            : shift.status === 'Delayed'
                            ? 'bg-yellow-100 text-yellow-700'
                            : shift.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="text-right font-semibold text-gray-800">{shift.delayMinutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductivityTracker;
