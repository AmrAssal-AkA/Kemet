const sharp = require("sharp");

const MRZ_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<";
const MRZ_WEIGHTS = [7, 3, 1];

function computeCheckDigit(str) {
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const idx = MRZ_CHARS.indexOf(str[i].toUpperCase());
    if (idx === -1) return null;
    total += idx * MRZ_WEIGHTS[i % 3];
  }
  return total % 10;
}

async function analyzeImageQuality(buffer) {
  const meta = await sharp(buffer).metadata();
  const {width, height, size} = meta;

  const aspectRatio = width / height;
  const megapixels = (width * height) / 1_000_000;
  const bytesPerPixel = buffer.length / (width * height);

  const isBlurry = megapixels < 0.3;
  const hasGlare = bytesPerPixel > 4.5;
  const isComplete = aspectRatio >= 1.2 && aspectRatio <= 1.8;
  const isReadable = !isBlurry && bytesPerPixel <= 5.5;

  const issues = [];
  if (isBlurry)    issues.push("Image is too blurry or low resolution");
  if (hasGlare)    issues.push("Glare or reflection detected");
  if (!isComplete) issues.push("Document appears cropped or incorrect orientation");
  if (!isReadable) issues.push("Text may not be readable");

  return {width, height, isBlurry, hasGlare, isComplete, isReadable, issues};
}

function validateMRZ(mrz) {
  if (!mrz || mrz.length < 44) {
    return {message: "MRZ line too short or missing"};
  }

  const checks = [
    {field: "Passport Number", value: mrz.substring(0, 9), digit: parseInt(mrz[9])},
    {field: "Date of Birth",   value: mrz.substring(13, 19), digit: parseInt(mrz[19])},
    {field: "Expiry Date",     value: mrz.substring(21, 27), digit: parseInt(mrz[27])},
  ];

  const results = checks.map((c) => ({
    field: c.field,
    valid: computeCheckDigit(c.value) === c.digit,
  }));

  return {
    valid: results.every((r) => r.valid),
    checks: results,
  };
}

function checkExpiry(expiryDate) {
  const [y, m, d] = expiryDate.split("-").map(Number);
  return new Date(y, m - 1, d) < new Date();
}

module.exports = {analyzeImageQuality, validateMRZ, checkExpiry};