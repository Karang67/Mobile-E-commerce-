const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { execSync } = require('child_process');

const markdownPath = path.join(__dirname, 'COLLEGE_PROJECT_REPORT.md');
const mdContent = fs.readFileSync(markdownPath, 'utf8');

marked.setOptions({
  gfm: true,
  breaks: true,
});

const htmlBody = marked.parse(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shivangi Mobile — Academic Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
      size: A4;
      margin: 22mm 18mm 22mm 18mm;
      @bottom-center {
        content: counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      line-height: 1.25;
      page-break-after: avoid;
      break-after: avoid;
    }

    h1 {
      font-size: 19pt;
      margin-top: 24pt;
      margin-bottom: 12pt;
      padding-bottom: 6pt;
      border-bottom: 2px solid #e2e8f0;
      color: #0f172a;
    }

    h2 {
      font-size: 14pt;
      margin-top: 18pt;
      margin-bottom: 8pt;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4pt;
    }

    h3 {
      font-size: 12pt;
      margin-top: 14pt;
      margin-bottom: 6pt;
      color: #334155;
    }

    p {
      margin-top: 0;
      margin-bottom: 9pt;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 9pt;
      padding-left: 20pt;
    }

    li {
      margin-bottom: 4pt;
    }

    strong {
      color: #0f172a;
      font-weight: 600;
    }

    hr {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 18pt 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 6pt 9pt;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    pre {
      background-color: #0f172a;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      padding: 10pt 12pt;
      border-radius: 6pt;
      overflow-x: auto;
      margin: 12pt 0;
      page-break-inside: avoid;
      break-inside: avoid;
      white-space: pre-wrap;
      word-break: break-word;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 9pt;
      background-color: #f1f5f9;
      color: #be185d;
      padding: 1.5pt 4pt;
      border-radius: 3pt;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    blockquote {
      margin: 12pt 0;
      padding: 6pt 14pt;
      border-left: 4px solid #3b82f6;
      background-color: #eff6ff;
      color: #1e40af;
      font-style: italic;
    }

    div[style*="page-break-after: always"] {
      page-break-after: always !important;
      break-after: page !important;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;

const htmlPath = path.join(__dirname, 'COLLEGE_PROJECT_REPORT.html');
fs.writeFileSync(htmlPath, fullHtml, 'utf8');

const pdfPath = path.join(__dirname, 'Shivangi_Mobile_College_Project_Report.pdf');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserPath = fs.existsSync(chromePath) ? chromePath : (fs.existsSync(edgePath) ? edgePath : null);

if (!browserPath) {
  console.error('Neither Chrome nor Edge was found for headless PDF printing.');
  process.exit(1);
}

const command = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;

try {
  execSync(command, { stdio: 'inherit' });
  const stats = fs.statSync(pdfPath);
  console.log(`PDF Generated Successfully: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error('Error rendering PDF:', err);
  process.exit(1);
}
