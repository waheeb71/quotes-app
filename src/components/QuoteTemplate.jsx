// src/components/QuoteTemplate.jsx
import React from "react";

const QuoteTemplate = ({ data }) => {
  return (
    <div
      id="quote"
      dir="rtl"
      className="font-[Arial] p-6 bg-white text-black text-sm leading-6"
    >
    {/* الترويسة */}
<div className="border-2 p-2 flex items-center justify-evenly flex-nowrap bg-white">
  
  {/* يمين (بيانات الشركة) */}
  <div className="text-right text-xs leading-6" style={{ width: '180px', minWidth: '180px' }}>
    <p className="font-bold">{data.company_name}</p>
    <p>
      <span className="font-bold">السجل التجاري:</span> {data.commercial_register}
    </p>
    <p>
      <span className="font-bold">الرقم الضريبي:</span> {data.tax_number}
    </p>
  </div>

  {/* وسط (عنوان عرض سعر) */}

  <div className="text-center flex-1" style={{ minWidth: '100px' }}>
    <h2 className="text-sm font-bold underline">عرض سعر</h2>
  </div>

  {/* يسار (الشعار) */}
  <div className="flex-shrink-0" style={{ width: '100px' }}>
    <img src="./logoa.png" alt="شعار" className="w-28 h-auto" />
  </div>

</div>


      {/* بيانات العميل والعرض */}
      <div className="grid grid-cols-2 gap-4 my-6 text-sm">
        {/* بيانات العميل */}
        <table className="w-full border text-right">
          <tbody>
            <tr>
              <th className="border-2 p-2 w-auto bg-blue-200 ">اسم العميل</th>
              <td className="border-2 p-2">{data.customer_name}</td>
            </tr>
            <tr>
              <th className="border-2 p-2 w-auto bg-blue-200 ">الرقم الضريبي</th>
              <td className="border-2 p-2">{data.customer_tax_number}</td>
            </tr>
            <tr>
              <th className="border-2 p-2 w-auto bg-blue-200">رقم التواصل</th>
              <td className="border-2 p-2">{data.customer_phone}</td>
            </tr>
          </tbody>
        </table>

        {/* بيانات العرض */}
        <table className="w-full border text-right">
          <tbody>
            <tr>
              <th className="border-2 p-2 w-auto bg-blue-200">رقم العرض</th>
              <td className="border-2 p-2">{data.quote_number}</td>
            </tr>
            <tr>
              <th className="border-2 p-2 w-auto bg-blue-200">تاريخ العرض</th>
              <td className="border-2 p-2">{data.quote_date}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* جدول المنتجات */}
      <table className="w-full border text-center text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border-2 p-2 w-auto bg-blue-200">م</th>
            <th className="border-2 p-2 w-auto bg-blue-200">البيان</th>
            <th className="border-2 p-2 w-24 bg-blue-200">الكمية</th>
            <th className="border-2 p-2 w-24 bg-blue-200">سعر الوحدة</th>
            <th className="border-2 p-2 w-32 bg-blue-200">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border-2 p-2 w-auto">{index + 1}</td>
              <td className="border-2 p-2 w-autotext-right">{item.description}</td>
              <td className="border-2 p-2 w-auto">{item.quantity}</td>
              <td className="border-2 p-2 w-auto">{item.unit_price}</td>
              <td className="border-2 p-2 w-auto">{item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* الإجمالي */}
      <div className="flex justify-end mt-4">
        <table className="w-full border text-center text-sm">
          <tbody>
            <tr>
              <td className="border-2 font-bold p-2 bg-blue-200">الإجمالي قبل الضريبة</td>
              <td className="border-2 p-2">{data.subtotal}</td>
            </tr>
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
