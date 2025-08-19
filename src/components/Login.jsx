import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق من localStorage إذا كان مسجل الدخول مسبقاً
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      navigate("/"); // اعادة توجيه للصفحة الرئيسية
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const docRef = doc(db, "settings", "secret");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().password;

        if (passwordInput === storedPassword) {
          localStorage.setItem("loggedIn", "true"); // حفظ تسجيل الدخول
          navigate("/"); // تحويل للصفحة الرئيسية
        } else {
          setError("كلمة السر غير صحيحة");
        }
      } else {
        setError("المستند غير موجود في Firebase");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>
        <input
          type="password"
          placeholder="كلمة السر"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border border-slate-300 rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-indigo-400"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          دخول
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
