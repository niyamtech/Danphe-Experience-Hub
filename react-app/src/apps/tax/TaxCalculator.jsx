import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const steps = ['Income', 'Deductions', 'Tax Offsets', 'Summary', 'Final'];

const atoTax = (income) => {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.19;
  if (income <= 135000) return 5092 + (income - 45000) * 0.3;
  if (income <= 190000) return 32492 + (income - 135000) * 0.37;
  return 52092 + (income - 190000) * 0.45;
};

const lito = (income) => {
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
};

const lmito = (income) => {
  if (income <= 37000) return 255;
  if (income <= 48000) return 255 + (income - 37000) * 0.075;
  if (income <= 90000) return 1080;
  if (income <= 126000) return Math.max(0, 1080 - (income - 90000) * 0.03);
  return 0;
};

const helpRate = (income) => {
  const thresholds = [
    { min: 51850, rate: 0.01 },
    { min: 59540, rate: 0.02 },
    { min: 63230, rate: 0.025 },
    { min: 67014, rate: 0.03 },
    { min: 70888, rate: 0.035 },
    { min: 74960, rate: 0.04 },
    { min: 79236, rate: 0.045 },
    { min: 83724, rate: 0.05 },
    { min: 88432, rate: 0.055 },
    { min: 93368, rate: 0.06 },
    { min: 98540, rate: 0.065 },
    { min: 103857, rate: 0.07 },
    { min: 109327, rate: 0.075 },
    { min: 114960, rate: 0.08 },
    { min: 120767, rate: 0.085 },
    { min: 126758, rate: 0.09 },
    { min: 132945, rate: 0.095 },
    { min: 139340, rate: 0.1 }
  ];
  const bracket = thresholds.reduce((acc, curr) => (income >= curr.min ? curr : acc), null);
  return bracket ? bracket.rate : 0;
};

const TaxCalculator = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState({ salary: 95000, investment: 5200, other: 0 });
  const [deductions, setDeductions] = useState({ work: 3200, education: 900, donations: 300, other: 0 });
  const [offsets, setOffsets] = useState({ privateHealth: true, lmito: true, extraOffset: 0 });
  const [helpDebt, setHelpDebt] = useState(true);

  const totalIncome = income.salary + income.investment + income.other;
  const totalDeductions = deductions.work + deductions.education + deductions.donations + deductions.other;
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  const results = useMemo(() => {
    const baseTax = atoTax(taxableIncome);
    const medicare = taxableIncome * 0.02;
    const offsetsValue = lito(taxableIncome) + (offsets.lmito ? lmito(taxableIncome) : 0) + Number(offsets.extraOffset || 0);
    const help = helpDebt ? taxableIncome * helpRate(taxableIncome) : 0;
    const finalTax = Math.max(0, baseTax + medicare + help - offsetsValue);
    return {
      baseTax,
      medicare,
      offsetsValue,
      help,
      finalTax,
      netIncome: totalIncome - finalTax
    };
  }, [taxableIncome, totalIncome, offsets, helpDebt]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const updateField = (setter) => (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value || 0);
    setter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ATO Accurate Tax Calculator</h1>
          <p className="text-gray-600 mb-6">Step-by-step estimation for FY 2024–25</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-full text-center text-sm font-medium ${
                  index === step ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Income</h2>
              {['salary', 'investment', 'other'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field} income</label>
                  <input
                    type="number"
                    value={income[field]}
                    onChange={updateField(setIncome)(field)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Deductions</h2>
              {Object.keys(deductions).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    type="number"
                    value={deductions[field]}
                    onChange={updateField(setDeductions)(field)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Offsets & Levies</h2>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={offsets.lmito} onChange={updateField(setOffsets)('lmito')} />
                <span>Apply Low & Middle Income Offset</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={offsets.privateHealth} onChange={updateField(setOffsets)('privateHealth')} />
                <span>Private health cover (reduces Medicare surcharge)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={helpDebt} onChange={(e) => setHelpDebt(e.target.checked)} />
                <span>Include HECS/HELP repayment</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional tax offsets</label>
                <input
                  type="number"
                  value={offsets.extraOffset}
                  onChange={updateField(setOffsets)('extraOffset')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500">Deductions</p>
                  <p className="text-2xl font-bold">${totalDeductions.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500">Taxable Income</p>
                  <p className="text-2xl font-bold">${taxableIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500">Offsets Eligible</p>
                  <p className="text-2xl font-bold">${results.offsetsValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Final Tax Payable</h2>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between text-sm uppercase opacity-80">
                  <span>Tax Payable</span>
                  <span>FY 24–25</span>
                </div>
                <p className="text-4xl font-bold mt-3">${results.finalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="mt-2 text-white/80">Net income: ${results.netIncome.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <p className="uppercase tracking-wide text-white/70">Base Tax</p>
                    <p className="text-xl font-semibold">${results.baseTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-white/70">Medicare Levy</p>
                    <p className="text-xl font-semibold">${results.medicare.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-white/70">HELP</p>
                    <p className="text-xl font-semibold">${results.help.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-white/70">Offsets</p>
                    <p className="text-xl font-semibold">-${results.offsetsValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={nextStep} className="px-6 py-2 bg-emerald-500 text-white rounded-lg">
                Next
              </button>
            ) : (
              <button onClick={onBack} className="px-6 py-2 bg-gray-900 text-white rounded-lg">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
