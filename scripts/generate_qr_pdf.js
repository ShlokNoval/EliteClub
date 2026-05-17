import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

const START_ID = 2098;
const TOTAL_CARDS = 300;
const DOMAIN = 'https://eliteclubcsn.in';
const OUTPUT_DIR = path.join(process.cwd(), 'qr_exports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateQRCodes() {
  console.log(`Starting generation of ${TOTAL_CARDS} QR codes...`);
  
  // 1. Create a PDF document for easy printing
  const pdfPath = path.join(OUTPUT_DIR, 'EliteClub_QRCards.pdf');
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(fs.createWriteStream(pdfPath));
  
  doc.fontSize(20).text('EliteClub - Official QR Cards', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('These QR codes are mapped to the live production database.', { align: 'center' });
  doc.moveDown(2);

  let x = 50;
  let y = doc.y;
  const qrSize = 120;
  const spacing = 40;

  for (let i = 0; i < TOTAL_CARDS; i++) {
    const cardId = `K${String(START_ID + i).padStart(6, '0')}`;
    const url = `${DOMAIN}/scan/${cardId}`;
    
    // Generate QR Code image buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 300,
      margin: 1,
      color: { dark: '#0A0A0A', light: '#FFFFFF' }
    });

    // Save individual image for the owner
    const imgPath = path.join(OUTPUT_DIR, `${cardId}.png`);
    fs.writeFileSync(imgPath, qrBuffer);

    // Add to PDF
    if (x + qrSize > doc.page.width - 50) {
      x = 50;
      y += qrSize + spacing;
    }
    
    if (y + qrSize + spacing > doc.page.height - 50) {
      doc.addPage();
      x = 50;
      y = 50;
    }

    doc.image(qrBuffer, x, y, { width: qrSize });
    doc.fontSize(10).text(cardId, x, y + qrSize + 5, { width: qrSize, align: 'center' });
    
    x += qrSize + spacing;
    
    if ((i + 1) % 50 === 0) {
      console.log(`Generated ${i + 1}/${TOTAL_CARDS} cards...`);
    }
  }

  doc.end();
  console.log(`\n✅ Successfully generated ${TOTAL_CARDS} QR codes!`);
  console.log(`📂 Output saved to: ${OUTPUT_DIR}`);
  console.log(`📄 PDF ready for printing: ${pdfPath}`);
}

generateQRCodes().catch(console.error);
