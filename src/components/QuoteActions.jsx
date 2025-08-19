import React, { useState } from "react";

const QuoteActions = ({ saveToFirebase, downloadPDF, htmlContent, showTax, toggleShowTax }) => {
  const [loadingFirebase, setLoadingFirebase] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleDownload = async () => {
    setLoadingPDF(true);
    try {
      await downloadPDF(htmlContent); // استخدم HTML مباشرة
    } finally {
      setLoadingPDF(false);
    }
  };


  const handleSave = async () => {
    setLoadingFirebase(true);
    try {
      await saveToFirebase();
    } finally {
      setLoadingFirebase(false);
    }
  };



  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleSave}
        disabled={loadingFirebase}
        className={`bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-5 py-2 rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-800 transition flex items-center justify-center gap-2`}
      >
        {loadingFirebase ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          "💾 حفظ في Firebase"
        )}
      </button>

      <button
        onClick={handleDownload}
        disabled={loadingPDF}
        className={`bg-gradient-to-r from-rose-500 to-rose-700 text-white px-5 py-2 rounded-lg shadow-md hover:from-rose-600 hover:to-rose-800 transition flex items-center justify-center gap-2`}
      >
        {loadingPDF ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          "📥 تحميل PDF"
        )}
      </button>
      <button
  onClick={toggleShowTax}
  className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-5 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition flex items-center justify-center gap-2"
>
  {showTax ? "إخفاء الضريبة" : "عرض الضريبة"}
</button>

    </div>
  );
};

export default QuoteActions;
