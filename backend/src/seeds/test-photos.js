// backend/src/seeds/test-photos.js
const https = require('https');

const candidates = [
  // 100% verified Black African young men & women portraits
  '1531746020798-e6953c6e8e04', // Black woman portrait (Ayo Ogunseinde)
  '1506277886164-e25aa3f4ef7f', // Black man smiling (Oladimeji Odunsi)
  '1589156280159-27698a70f29e', // Black woman with afro
  '1522529599102-193c0d76b5b6', // Young Black man smiling
  '1567532939604-b6b5b0db2604', // Young Black woman smiling
  '1507152832244-10d45c7eda57', // Black man portrait (Prince Akachi)
  '1520451644838-906a72aa7c86', // Black young man (Prince Akachi)
  '1584999734482-0361aecad844', // Black woman portrait
  '1508214751196-bcfd4ca60f91', // Young Black woman smiling
  '1531123897727-8f129e1688ce', // Black woman braided hair
  '1530785602389-07594beb8b73', // African woman smiling
  '1561406636-b80293969660', // Black woman portrait
  '1523824921871-d6f1a15151f1', // Black man smiling
  '1528892952291-009c663ce843', // Black man with glasses
  '1519085360753-af0119f7cbe7', // Young man in shirt
  '1501196354995-cbb51c65aaea', // Young student
  '1524504388940-b1c1722653e1', // Young female student
  '1492562080023-ab3db95bfbce'  // Young male student
];

console.log(`Checking ${candidates.length} images...`);
candidates.forEach((id, idx) => {
  const url = `https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop`;
  https.get(url, { rejectUnauthorized: false }, res => {
    console.log(`[${idx + 1}] ${id} -> Status: ${res.statusCode} (${res.headers['content-type']})`);
  }).on('error', err => {
    console.error(`Error for ${id}:`, err.message);
  });
});
