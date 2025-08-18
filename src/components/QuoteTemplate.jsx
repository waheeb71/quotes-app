// src/components/QuoteTemplate.jsx
import React from "react";

const QuoteTemplate = ({ data, showTax }) => {

  return (
    <div
      id="quote"
      dir="rtl"
      className="font-[Arial] p-4 bg-white text-black text-sm leading-6"
    >
       {/* العلامة المائية */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-17">
    <img
      src="/watermark.png"
      alt="Watermark"
      className="w-1/3 opacity-20"
    />
  </div>
    {/* الترويسة */}
<div className="border-1 p-2 flex items-center justify-evenly flex-nowrap bg-white">
  
  {/* يمين (بيانات الشركة) */}
  <div className="text-right text-xs leading-4" style={{ width: '180px', minWidth: '180px' }}>
    <p className="font-bold">{data.company_name}</p>
    <p>
      <span className="font-bold">السجل التجاري:</span> {data.commercial_register}
    </p>
    <p>
      <span className="font-bold">الرقم الضريبي:</span> {data.tax_number}
    </p>
  </div>

  {/* وسط (عنوان عرض سعر) */}
<div className="text-center flex-1 ml-21" style={{ minWidth: '50px' }}>
  <h2 className="text-xs font-bold underline">عرض سعر</h2>
</div>


  {/* يسار (الشعار) */}
  <div className="flex-shrink-0" style={{ width: '50px' }}>
   <img
  src={data.company_logo || "/logoa.png"}
  alt="شعار"
  className="w-28 h-auto"
/>

  </div>
  

</div>
<div className="grid grid-cols-2 gap-15 my-3 text-[8px]">
  {/* بيانات العميل */}
  <table className="w-full border text-center align-top text-[8px]" style={{ verticalAlign: 'top' }}>
    <tbody className="leading-tight" style={{ verticalAlign: 'top' }}>
      <tr>
        <th className="border p-1 bg-blue-200 whitespace-nowrap align-top" style={{ verticalAlign: 'top' }}>اسم العميل</th>
        <td className="border p-1 leading-tight break-words align-top" style={{ verticalAlign: 'top' }}>{data.customer_name}</td>
      </tr>
      <tr>
        <th className="border p-1 bg-blue-200 whitespace-nowrap align-top" style={{ verticalAlign: 'top' }}>الرقم الضريبي</th>
        <td className="border p-1 leading-tight break-words" style={{ verticalAlign: 'top' }}>{data.customer_tax_number}</td>
      </tr>
      <tr>
        <th className="border p-1 bg-blue-200 whitespace-nowrap align-top" style={{ verticalAlign: 'top' }}>رقم التواصل</th>
        <td className="border p-1 leading-tight break-words align-top" style={{ verticalAlign: 'top' }}>{data.customer_phone}</td>
      </tr>
    </tbody>
  </table>

  {/* بيانات العرض */}
  <table className="border text-center text-[6px]" style={{ verticalAlign: 'top' }}>
    <tbody className="leading-tight" style={{ verticalAlign: 'top' }}>
      <tr>
        <th className="border p-1 w-[100px] bg-blue-200" style={{ verticalAlign: 'top' }}>رقم العرض</th>
        <td className="border p-1" style={{ verticalAlign: 'top' }}>{data.quote_number}</td>
      </tr>
      <tr>
        <th className="border p-1 w-[100px] bg-blue-200" style={{ verticalAlign: 'top' }}>تاريخ العرض</th>
        <td className="border p-1" style={{ verticalAlign: 'top' }}>{data.quote_date}</td>
      </tr>
    </tbody>
  </table>
</div>



   {/* جدول المنتجات */}
<table className="w-full border text-center table-auto">
  <thead className="bg-gray-200 text-[8px]">
    <tr>
      <th className="border-1 p-1 bg-blue-200">م</th>
      <th className="border-1 p-1 bg-blue-200 text-[12px]">البيان</th>
      <th className="border-1 p-1 bg-blue-200">الكمية</th>
      <th className="border-1 p-1 bg-blue-200">سعر الوحدة</th>
      <th className="border-1 p-1 bg-blue-200">الإجمالي</th>
    </tr>
  </thead>
  <tbody className="text-[8px]">
    {data.items.map((item, index) => (
      <tr key={index} className="align-middle">
        <td className="border-1 p-1 whitespace-nowrap">{index + 1}</td>
        <td className="border-1 p-1 text-[12px] whitespace-nowrap">{item.description}</td>
        <td className="border-1 p-1 whitespace-nowrap">{item.quantity}</td>
        <td className="border-1 p-1 whitespace-nowrap">{item.unit_price}</td>
        <td className="border-1 p-1 whitespace-nowrap">{item.total_price}</td>
      </tr>
    ))}
  </tbody>
</table>



      {/* الإجمالي */}
      <div className="flex justify-end mt-4">
        <table className="w-full border text-center text-sm">
         <tbody>
  <tr>
    <td className="border-1 font-bold p-1 bg-blue-200 align-top" style={{ verticalAlign: 'top' }}>الإجمالي قبل الضريبة</td>
    <td className="border-1 p-1 align-top" style={{ verticalAlign: 'top' }}>{data.subtotal.toFixed(2)}</td>
  </tr>

  {showTax && (
    <>
      <tr>
        <td className="border-2 font-bold p-2 bg-blue-100">قيمة الضريبة ({data.vat_rate}%)</td>
        <td className="border-2 p-2">{data.vat_amount.toFixed(2)}</td>
      </tr>
      <tr>
        <td className="border-2 font-bold p-2 bg-blue-300">الإجمالي بعد الضريبة</td>
        <td className="border-2 p-2">{data.total.toFixed(2)}</td>
      </tr>
    </>
  )}
</tbody>


        </table>
      </div>

      {/* الملاحظات + معلومات البنك */}
      <div className="mt-6">
{data.notes && (
  <p className="font-bold mb-4">
    ملاحظات: {data.notes}
  </p>
)}

        <p>للتحويل على حساب المؤسسة (IBAN):</p>
    <p className="font-bold">
  البنك الأهلي: <span className="text-blue-600">{data.iban}</span>
</p>


      </div>

      {/* التوقيع */}
      <div className="mt-1 text-left">
        <p>ولكم منا جزيل الشكر والتقدير ............</p>
        <p className="mt-2 font-bold">{data.company_name}</p>
      </div>
    </div>
  );
};

export default QuoteTemplate;
