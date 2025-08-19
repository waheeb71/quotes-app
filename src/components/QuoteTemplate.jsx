import React from "react";

const QuoteTemplate = ({ data, showTax }) => {
  const htmlContent = `
<html dir="rtl">
  <head>
    <meta charset="UTF-8">
    <style>
      body {   font-family: 'Cairo';
  font-size: 12px; line-height: 1.4; margin: 0; padding: 0; color: #000; background-color: #fff; }
      .header { display: flex; justify-content: space-between;align-items: center;  padding: 2px; border: 2px solid #000; background-color: #fff; }
      .header-right { text-align: right; font-size: 12px; display:inline;}
      .header-center { text-align: center; font-size: 12px; font-weight: bold; text-decoration: underline; margin-top: 50px;  }
      .header-left img { width: 110px; height: auto; }
      th, td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
    vertical-align: top;
    font-size: 10px; /* حجم الخط صغير */
  }

  th {
    width: 1%; /* يجعل عرض الـ th صغير جدًا حسب المحتوى */
    white-space: nowrap; /* يمنع كسر السطر داخل الـ th */
  }

  td {
    width: auto; /* يتوسع حسب محتوى الخلية */
    white-space: nowrap; /* يمنع كسر السطر داخل الـ td */
  }

      th { background-color: #bfdbfe; }
      .text-blue { color: #2563eb; }
      .totals td { font-weight: bold; }
      .notes { margin-top: 15px; }
      .signature { margin-top: 10px; text-align: left; }



    </style>
  </head>
  <body>
    <div id="quote">
     
      <div class="header">
        <div class="header-right">
         <div ><strong>${data.company_name}</strong></div>
          <p><strong>السجل التجاري:</strong> ${data.commercial_register}</p>
          <p><strong>الرقم الضريبي:</strong> ${data.tax_number}</p>
        </div>
        <div class="header-center">عرض سعر</div>
     <div class="header-left">
<img src="${data.company_logo}" alt="شعار" />

</div>

      </div>
    <div style="display: flex; gap: 20px;">

  <!-- الجدول الأول -->
<table border="1" style="border-collapse: collapse; width: 45%; float: left; margin-right: 0%;  margin-top: 10px">
    <tr>
      <th>اسم العميل</th>
      <td>${data.customer_name}</td>
    </tr>
    <tr>
      <th>الرقم الضريبي</th>
      <td>${data.customer_tax_number}</td>
    </tr>
    <tr>
      <th>رقم التواصل</th>
      <td>${data.customer_phone}</td>
    </tr>
  </table>

  <!-- الجدول الثاني -->
<table border="1" style="border-collapse: collapse; width: 45%;  margin-right: 17%; margin-top: 10px">
    <tr>
      <th>رقم العرض</th>
      <td>${data.quote_number}</td>
    </tr>
    <tr>
      <th>تاريخ العرض</th>
      <td>${data.quote_date}</td>
    </tr>
   
  </table>

</div>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr>
            <th>م</th>
            <th>البيان</th>
            <th>الكمية</th>
            <th>سعر الوحدة</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${item.unit_price}</td>
              <td>${item.total_price}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      <table  style="border-collapse: collapse; width: 100%; margin-top: 10px;font-weight: bold">
        <tr>
          <td style="font-weight: bold;background-color: #bfdbfe;">الإجمالي قبل الضريبة</td>
          <td>${data.subtotal.toFixed(2)}</td>
        </tr>
        ${showTax ? `
          <tr>
            <td style="font-weight: bold;background-color: #bfdbfe;">قيمة الضريبة (${data.vat_rate}%)</td>
            <td>${data.vat_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;background-color: #bfdbfe;">الإجمالي بعد الضريبة</td>
            <td>${data.total.toFixed(2)}</td>
          </tr>` : ''}
      </table>
      <div class="notes">
        ${data.notes ? `<p><strong>ملاحظات:</strong> ${data.notes}</p>` : ''}
        <p>للتحويل على حساب المؤسسة (IBAN):</p>
        <p class="text-blue"><strong>${data.iban}</strong></p>
      </div>
      <div class="signature">
        <p>ولكم منا جزيل الشكر والتقدير ............</p>
        <p><strong>${data.company_name}</strong></p>
      </div>
    </div>
  </body>
</html>
`;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default QuoteTemplate;
