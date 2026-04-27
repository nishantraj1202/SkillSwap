/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — Resume Text Extractor
 * ─────────────────────────────────────────────
 *  Extracts raw text from uploaded resume files.
 *  • PDF  → uses `pdf-parse`
 *  • DOCX → uses `mammoth`
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract text from a resume file.
 * @param {string} filePath - Absolute path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - The extracted plain text
 */
const extractText = async (filePath, mimeType) => {
  // ── PDF extraction ──
  if (mimeType === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text.trim();
  }

  // ── DOCX extraction ──
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
};

module.exports = extractText;
