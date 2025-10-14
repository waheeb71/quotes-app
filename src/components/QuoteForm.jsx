import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate, Link, useParams } from "react-router-dom";
import QuoteTemplate from "./QuoteTemplate";
import QuoteActions from "./QuoteActions";

const QuoteForm = () => {
  const [showTax, setShowTax] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { quoteId } = useParams();

  const [data, setData] = useState({
    company_name: "مؤسسة القوة العاشرة للمقاولات العامة",
    commercial_register: "4030202520",
    tax_number: "301252163700003",
    company_logo: "",
    customer_name: "",
    customer_tax_number: "",
    customer_phone: "",
    quote_number: "",
    quote_date: today,
    items: [{ description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    subtotal: 0,
    discount_rate: 0,
    discount_amount: 0,
    subtotal_after_discount: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    notes: "",
    iban: "SA2710000010700000165109",
  });

  useEffect(() => {
    if (!quoteId) return;
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, "quotes", quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setData((prev) => ({
            ...prev,
            ...docData,
            quote_date: docData.quote_date || prev.quote_date,
          }));
        } else {
          alert(" هذا العرض غير موجود");
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    };
    fetchQuote();
  }, [quoteId]);

  const saveToFirebase = async () => {
    try {
      const quoteData = { ...data, company_logo: "/logoa.png" };
      if (quoteId) {
        await updateDoc(doc(db, "quotes", quoteId), quoteData);
        alert(" تم تحديث عرض السعر!");
      } else {
        await addDoc(collection(db, "quotes"), quoteData); 
        alert("✅ تم حفظ عرض السعر!");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ خطأ في الحفظ");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = { ...prev, [name]: parseFloat(value) || 0 };
      
      // إعادة حساب الخصم والمبالغ
      const subtotal = newData.items.reduce(
        (sum, item) => sum + (Number(item.total_price) || 0),
        0
      );
      
      const discount_amount = (subtotal * newData.discount_rate) / 100;
      const subtotal_after_discount = subtotal - discount_amount;
      const vat_amount = (subtotal_after_discount * newData.vat_rate) / 100;
      const total = subtotal_after_discount + vat_amount;

      return {
        ...newData,
        subtotal,
        discount_amount,
        subtotal_after_discount,
        vat_amount,
        total,
      };
    });
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unit_price: 0, total_price: 0 },
      ],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;

    const q = Number(newItems[index].quantity) || 0;
    const p = Number(newItems[index].unit_price) || 0;
    newItems[index].total_price = q * p;

    const subtotal = newItems.reduce(
      (sum, item) => sum + (Number(item.total_price) || 0),
      0
    );
    
    const discount_amount = (subtotal * data.discount_rate) / 100;
    const subtotal_after_discount = subtotal - discount_amount;
    const vat_amount = (subtotal_after_discount * data.vat_rate) / 100;
    const total = subtotal_after_discount + vat_amount;

    setData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      discount_amount,
      subtotal_after_discount,
      vat_amount,
      total,
    }));
  };

  const waitForImages = (element) => {
    const images = element.querySelectorAll("img");
    return Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );
  };

  const downloadPDF = async (htmlContent) => {
    try {
      await saveToFirebase();

      const response = await fetch("https://server-bd2c.onrender.com/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error("خطأ في السيرفر");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `quote-${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(" Error generating PDF:", err);
      alert(" خطأ أثناء إنشاء PDF");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen rounded-xl shadow-lg">
    
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          إنشاء عرض سعر
        </h1>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">العودة للصفحة الرئيسية</span>
        </Link>
      </div>

      {/* بيانات العميل */}
      <div className="space-y-3">
        <label className="flex flex-col">
          <span className="text-sm bold text-slate-600 mb-1">اسم العميل</span>
          <input
            type="text"
            name="customer_name"
            value={data.customer_name}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
          />
        </label>
        
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">الرقم الضريبي للعميل</span>
          <input
            type="text"
            name="customer_tax_number"
            value={data.customer_tax_number}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
          />
        </label>
      
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">رقم التواصل</span>
          <input
            type="text"
            name="customer_phone"
            value={data.customer_phone}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
          />
        </label>
         
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">رقم العرض</span>
          <input
            type="text"
            name="quote_number"
            value={data.quote_number}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        {/* تاريخ العرض */}
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">تاريخ العرض</span>
          <input
            type="date"
            name="quote_date"
            value={data.quote_date}
            onChange={handleChange} 
            className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
          />
        </label>
      </div>

      {/* البنود */}
      <h2 className="font-semibold text-lg text-slate-700 mt-6 mb-2">📦 البيانات</h2>
      {data.items.map((item, i) => (
        <div key={i} className="flex gap-3 mb-3">
          <label className="flex flex-col flex-1">
            <span className="text-sm text-slate-600 mb-1">البيان</span>
            <textarea
              value={item.description}
              onChange={(e) => handleItemChange(i, "description", e.target.value)}
              className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 resize-y"
              rows={1}
              placeholder="اكتب البيان هنا"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600 mb-1">الكمية</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(i, "quantity", +e.target.value)} 
              className="border border-slate-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600 mb-1">سعر الوحدة</span>
            <input
              type="number"
              value={item.unit_price}
              onChange={(e) => handleItemChange(i, "unit_price", +e.target.value)}
              className="border border-slate-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400"
            />
          </label>
        </div>
      ))}

      <button
        onClick={addItem}
        className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition"
      >
        ➕ إضافة بند
      </button>

      {/* إعدادات الخصم والضريبة */}
      <div className="mt-6 p-4 border border-slate-300 rounded-lg bg-white">
        <h2 className="font-semibold text-lg text-slate-700 mb-3">⚙️ الإعدادات المالية</h2>
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDiscount}
              onChange={() => setShowDiscount(!showDiscount)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-600">إظهار الخصم</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTax}
              onChange={() => setShowTax(!showTax)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-600">إظهار الضريبة</span>
          </label>
        </div>

        {showDiscount && (
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-600 mb-1">نسبة الخصم (%)</span>
              <input
                type="number"
                name="discount_rate"
                value={data.discount_rate}
                onChange={handleDiscountChange}
                min="0"
                max="100"
                step="0.1"
                className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            
            <div className="flex flex-col justify-end">
              <span className="text-sm text-slate-600">قيمة الخصم: {data.discount_amount.toFixed(2)} ريال</span>
              <span className="text-sm text-slate-600">الإجمالي بعد الخصم: {data.subtotal_after_discount.toFixed(2)} ريال</span>
            </div>
          </div>
        )}

        {showTax && (
          <div className="mt-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-600 mb-1">نسبة الضريبة (%)</span>
              <input
                type="number"
                name="vat_rate"
                value={data.vat_rate}
                onChange={handleDiscountChange}
                min="0"
                max="100"
                step="0.1"
                className="border border-slate-300 rounded-lg p-2 w-32 focus:ring-2 focus:ring-indigo-400"
              />
            </label>
          </div>
        )}
      </div>

      {/* ملخص المبالغ */}
      <div className="mt-4 p-4 border border-slate-300 rounded-lg bg-white">
        <h2 className="font-semibold text-lg text-slate-700 mb-3">💰 ملخص المبالغ</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">الإجمالي قبل الضريبة:</span>
            <span className="font-bold">{data.subtotal.toFixed(2)} ريال</span>
          </div>
          
          {showDiscount && (
            <>
              <div className="flex justify-between text-red-600">
                <span>الخصم ({data.discount_rate}%):</span>
                <span className="font-bold">-{data.discount_amount.toFixed(2)} ريال</span>
              </div>
              <div className="flex justify-between">
                <span>الإجمالي بعد الخصم:</span>
                <span className="font-bold">{data.subtotal_after_discount.toFixed(2)} ريال</span>
              </div>
            </>
          )}
          
          {showTax && (
            <>
              <div className="flex justify-between">
                <span>الضريبة ({data.vat_rate}%):</span>
                <span className="font-bold">{data.vat_amount.toFixed(2)} ريال</span>
              </div>
              <div className="flex justify-between text-green-600 border-t pt-2">
                <span className="font-bold">الإجمالي النهائي:</span>
                <span className="font-bold text-lg">{data.total.toFixed(2)} ريال</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ملاحظات */}
      <textarea
        placeholder="ملاحظات"
        name="notes"
        value={data.notes}
        onChange={handleChange}
        className="border border-slate-300 rounded-lg p-3 mt-4 w-full focus:ring-2 focus:ring-indigo-400"
      />

      {/* الأزرار */}
      <QuoteActions
        saveToFirebase={saveToFirebase}
        downloadPDF={async () => {
          const dataWithImages = {
            ...data,
            company_logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS8...",
          };
          const htmlContent = QuoteTemplate({ 
            data: dataWithImages, 
            showTax,
            showDiscount 
          }).props.dangerouslySetInnerHTML.__html;
          await downloadPDF(htmlContent);
        }}
        showTax={showTax}
        toggleShowTax={() => setShowTax((prev) => !prev)}
        showDiscount={showDiscount}
        toggleShowDiscount={() => setShowDiscount((prev) => !prev)}
      />

      {/* المعاينة */}
      <div className="mt-10">
        <QuoteTemplate data={data} showTax={showTax} showDiscount={showDiscount} />
      </div>
    </div>
  );
};

export default QuoteForm;
