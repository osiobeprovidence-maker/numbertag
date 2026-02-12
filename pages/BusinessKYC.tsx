
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessKYC: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    idNumber: '',
  });

  const canProceedToDocs = formData.businessName.trim() !== '' && formData.idNumber.trim() !== '';

  const handleNextStep = () => {
    if (!canProceedToDocs) {
      alert("Protocol Error: Company Name and TIN/NIN are mandatory for verification.");
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    if (!formData.businessName || !formData.idNumber) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('nt_kyc_status', 'verified');
      localStorage.setItem('nt_business_name', formData.businessName);
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-48 pb-32 flex items-center justify-center px-8 sm:px-12">
      <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-12 md:p-16 border border-white/5 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#bef264]"></div>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-black font-heading mb-6 tracking-tight uppercase">Identity Protocol</h2>
            <p className="text-zinc-500 mb-12 text-base sm:text-lg">We verify every corporate node to maintain the integrity of the intent network.</p>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">
                  Company Name <span className="text-[#bef264]">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-[#bef264]/50 text-white font-bold text-sm transition-all" 
                  placeholder="Official Company Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">
                  TIN or NIN <span className="text-[#bef264]">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 focus:outline-none focus:border-[#bef264]/50 text-white font-bold text-sm transition-all" 
                  placeholder="Tax ID or National ID Number" 
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={handleNextStep}
                  disabled={!canProceedToDocs}
                  className={`w-full py-6 rounded-2xl font-black transition-all uppercase tracking-widest text-sm shadow-xl ${
                    canProceedToDocs 
                      ? 'bg-white text-black hover:bg-[#bef264] shadow-[#bef264]/10' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  PROCEED TO DOCUMENTS
                </button>
                {!canProceedToDocs && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-center mt-4 text-zinc-700 italic">
                    All required fields must be calibrated to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-black font-heading mb-6 tracking-tight uppercase">Document Upload</h2>
            <p className="text-zinc-500 mb-12 text-base sm:text-lg italic">Node Target: {formData.businessName}</p>
            
            <div className="grid grid-cols-1 gap-6 mb-12">
               <div className="p-10 sm:p-12 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-[#bef264]/30 cursor-pointer transition-all">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl sm:text-4xl text-zinc-700 mb-4 group-hover:text-[#bef264] transition-colors"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Drop PDF or Certificate Image here</span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl bg-zinc-800 text-white font-bold transition-all uppercase text-xs hover:bg-zinc-700">BACK</button>
              <button 
                onClick={handleComplete}
                disabled={loading}
                className="flex-[2] py-5 rounded-2xl bg-[#bef264] text-black font-black hover:bg-[#d9ff96] transition-all uppercase tracking-widest text-xs shadow-xl shadow-[#bef264]/10"
              >
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : "SUBMIT FOR VERIFICATION"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessKYC;
