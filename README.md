# PDF Quote & Report Generator

A simple yet powerful web application for creating, managing, and exporting quote reports in PDF format.  

## Overview

This project allows users to:  
- Enter and manage quote data (customer info, items, totals, notes).  
- Generate professional PDF reports from the entered data.  
- Store quote data securely in Firebase.  

The application is built with a **React frontend** and a **Python/Flask backend**. The backend receives HTML content from the frontend and converts it into a downloadable PDF.  

## Live Demo & Hosting

- **Backend**: Hosted on [Render](https://render.com) (Free tier). The backend endpoint accepts HTML content and returns a PDF.  
- **Frontend**: Hosted on [Netlify](https://www.netlify.com) (Free tier) for seamless user experience.  

## GitHub Repository

You can find the backend source code here: [https://github.com/waheeb71/server](https://github.com/waheeb71/server)  

## Features

- Dynamic PDF generation with proper layout and styling.  
- Automatic calculation of totals, VAT, and subtotals.  
- Option to include or exclude tax in the final PDF.  
- User-friendly interface for entering customer and item data.  
- Fully hosted solution with no local setup required for demo purposes.  

## Technology Stack

- **Frontend:** React, Tailwind CSS, React Router  
- **Backend:** Python, Flask, WeasyPrint  
- **Database & Storage:** Firebase (Firestore & Storage)  
- **Deployment:** Render (Backend), Netlify (Frontend)  



## Screenshots

### Dashboard / Main Page
![Dashboard](screenshots/dashboard.png)

### Create Quote
![Create Quote](screenshots/create-quote.png)

### Edit Quote
![Edit Quote](screenshots/edit-quote.png)

### Generated PDF
![PDF Preview](screenshots/pdf-preview.png)

## Usage

1. Open the frontend URL hosted on Netlify.  
2. Enter customer details, items, and other relevant information.  
3. Click on "Download PDF" to generate and download the professional PDF report.  

## Notes

- Images and company logos can be embedded directly using Base64 encoding for proper rendering in PDFs.  
- The backend handles HTML-to-PDF conversion and ensures styling is preserved.  

---

Crafted as a clean, professional solution for managing quotes and generating PDF reports quickly and efficiently.


## Installation
```bash
git clone git@github.com:waheeb71/quotes-app.git
cd quotes-app
pnpm inst
```
---

##  Contact:
For questions or support, contact me via:
- Telegram: [@SyberSc71](https://t.me/SyberSc71)
- Telegram: [@WAT4F](https://t.me/WAT4F)
- GitHub: [waheeb71](https://github.com/waheeb71)
- GitHub2: [cyberlangdev](https://github.com/cyberlangdev)
- **Location:** I am from Yemen, Taiz.
- **YouTube Channel:** [Cyber Code](https://www.youtube.com/@cyber_code1)
- **X (formerly Twitter):** [@wa__cys](https://x.com/wa__cys)

---
## Author / المطور

**English:** Waheeb Mahyoob Al-Humaeri (Waheeb Al-Humaeri)  
**العربية:** وهيب مهيوب الحميري (وهيب الحميري)
