import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const frequencies = {
  Monthly: 12,
  Fortnightly: 26,
  Weekly: 52
};

const HomeLoanCalculator = ({ onBack }) => {
  const [borrow, setBorrow] = useState(750000);
  const [rate, setRate] = useState(6.2);
  const [term, setTerm] = useState(30);
  const [frequency, setFrequency] = useState('Monthly');
  const [loanType, setLoanType] = useState('P&I');
  const [rateType, setRateType] = useState('Variable');
  const [extra, setExtra] = useState(150);

  const calc = useMemo(() => {
    const paymentsPerYear = frequencies[frequency];
    const totalPayments = term * paymentsPerYear;
    const r = rate / 100 / paymentsPerYear;
    const repayment =
      loanType === 'IO'
        ? (borrow * rate) / 100 / paymentsPerYear
        : (borrow * r * Math.pow(1 + r, totalPayments)) / (Math.pow(1 + r, totalPayments) - 1);
    const extraPrincipal = Math.max(0, repayment - (borrow * rate) / 100 / paymentsPerYear);
    const wealthProjection = Array.from({ length: term + 1 }).map((_, year) => {
      const growthRate = 0.03;
      const equity = borrow * (year / term);
      const projectedValue = borrow + borrow * growthRate * year;
      return { year, equity, projectedValue };
    });
    return {
      repayment,
      totalPayments,
      wealthProjection,
      repaymentWithExtra: repayment + extra,
      totalInterest: repayment * totalPayments - borrow,
      extraPrincipal
    };
  }, [borrow, rate, term, frequency, loanType, extra]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <header>
            <p className="text-sm uppercase tracking-wide text-emerald-500 font-semibold">Westpac inspired</p>
            <h1 className="text-3xl font-bold text-gray-800">Home Loan Experience</h1>
            <p className="text-gray-600">Compare repayment styles, rate types and wealth projection.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Borrow Amount</label>
              <input
                type="number"
                value={borrow}
                onChange={(e) => setBorrow(Number(e.target.value || 0))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Interest Rate: {rate}%</label>
                <span className="text-xs text-gray-500">{rateType}</span>
              </div>
              <input type="range" min="2" max="12" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Loan Term (years)</label>
              <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value || 0))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Repayment Frequency</label>
              <div className="flex gap-2">
                {Object.keys(frequencies).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${frequency === freq ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-gray-200'}`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Loan Type</label>
              <div className="flex gap-2">
                {['P&I', 'IO'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLoanType(type)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${loanType === type ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-gray-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rate Type</label>
              <div className="flex gap-2">
                {['Variable', 'Fixed'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setRateType(type)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${rateType === type ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-gray-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Extra Repayments ({frequency})</label>
              <input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value || 0))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-white/70">Repayment</p>
                <p className="text-4xl font-bold">${calc.repayment.toFixed(2)}</p>
                <p className="text-white/80 text-sm">{frequency} | {loanType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60">With Extra</p>
                  <p className="text-2xl font-semibold">${calc.repaymentWithExtra.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-white/60">Total Interest</p>
                  <p className="text-2xl font-semibold">${calc.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <p className="text-white/60">Extra Principal</p>
                  <p className="text-2xl font-semibold">${calc.extraPrincipal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-white/60">Payments</p>
                  <p className="text-2xl font-semibold">{calc.totalPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Wealth Projection</h3>
              <div className="h-56">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {calc.wealthProjection.map((point, index, arr) => {
                    if (index === 0) return null;
                    const prev = arr[index - 1];
                    const x1 = (prev.year / arr.length) * 400;
                    const y1 = 200 - (prev.equity / borrow) * 200;
                    const x2 = (point.year / arr.length) * 400;
                    const y2 = 200 - (point.equity / borrow) * 200;
                    return <line key={point.year} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth={4} strokeLinecap="round" />;
                  })}
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-3">Shows equity growth relative to principal remaining.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
