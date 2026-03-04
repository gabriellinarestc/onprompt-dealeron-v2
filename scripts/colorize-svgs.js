const { readFileSync, writeFileSync } = require('fs');

const BASE = '/vercel/share/v0-project/public/models';

const brandGradients = {
  gpt: { from: '#10a37f', to: '#1a7f5a', id: 'gpt-grad' },
  claude: { from: '#d97757', to: '#c4613f', id: 'claude-grad' },
  gemini: null,
  copilot: { from: '#0078d4', to: '#005a9e', id: 'copilot-grad' },
  perplexity: { from: '#20b8cd', to: '#1a8fa0', id: 'perplexity-grad' },
};

for (const [name, gradient] of Object.entries(brandGradients)) {
  const filePath = `${BASE}/${name}.svg`;
  let svg = readFileSync(filePath, 'utf8');

  if (!gradient) {
    console.log(`Skipping ${name} (already has gradients)`);
    continue;
  }

  const gradientDef = `<defs><linearGradient id="${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradient.from}"/><stop offset="100%" stop-color="${gradient.to}"/></linearGradient></defs>`;

  svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`);

  // Add fill to paths that don't have one
  svg = svg.replace(/<path(?![^>]*fill=)/g, `<path fill="url(#${gradient.id})"`);

  // Replace explicit black fills
  svg = svg.replace(/fill="black"/g, `fill="url(#${gradient.id})"`);
  svg = svg.replace(/fill="#000"/g, `fill="url(#${gradient.id})"`);
  svg = svg.replace(/fill="#000000"/g, `fill="url(#${gradient.id})"`);

  writeFileSync(filePath, svg, 'utf8');
  console.log(`Colorized ${name} with gradient ${gradient.from} -> ${gradient.to}`);
}
