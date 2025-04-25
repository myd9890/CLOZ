const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Sample balance sheet data
const balanceSheetData = {
  assets: {
    Cash: 5000,
    "Accounts Receivable": 3000,
    Inventory: 2000,
    "Total Assets": 10000,
  },
  liabilities: {
    "Accounts Payable": 2000,
    Loans: 3000,
    "Total Liabilities": 5000,
  },
  equity: {
    "Owner's Equity": 5000,
    "Total Equity": 5000,
  },
};

// Controller function to generate the PDF
exports.generateBalanceSheet = (req, res) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "../balance_sheet.pdf");

  // Pipe the PDF to a file
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add title
  doc.fontSize(20).text("Balance Sheet", { align: "center" });
  doc.moveDown();

  // Add Assets
  doc.fontSize(16).text("Assets");
  doc.moveDown(0.5);
  Object.entries(balanceSheetData.assets).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: $${value}`);
  });
  doc.moveDown();

  // Add Liabilities
  doc.fontSize(16).text("Liabilities");
  doc.moveDown(0.5);
  Object.entries(balanceSheetData.liabilities).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: $${value}`);
  });
  doc.moveDown();

  // Add Equity
  doc.fontSize(16).text("Equity");
  doc.moveDown(0.5);
  Object.entries(balanceSheetData.equity).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: $${value}`);
  });

  // Finalize the PDF
  doc.end();

  // Send the PDF file as a response
  writeStream.on("finish", () => {
    res.download(filePath, "balance_sheet.pdf", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
      }
    });
  });
};