const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Brand gradient definitions (from → to colors)
const brandGradients = {
  gpt: { from: '#10a37f', to: '#1a7f5a', id: 'gpt-grad' },
  claude: { from: '#d97757', to: '#c4613f', id: 'claude-grad' },
  gemini: null, // Gemini already has its own gradients
  copilot: { from: '#0078d4', to: '#005a9e', id: 'copilot-grad' },
  perplexity: { from: '#20b8cd', to: '#1a8fa0', id: 'perplexity-grad' },
};

for (const [name, gradient] of Object.entries(brandGradients)) {
  const filePath = path.join(__dirname, '..', 'public', 'models', `${name}.svg`);
  let svg = readFileSync(filePath, 'utf8');

  if (!gradient) {
    // Gemini already has gradients, skip
    console.log(`Skipping ${name} (already has gradients)`);
    continue;
  }

  // Add gradient def right after the opening <svg> tag
  const gradientDef = `<defs><linearGradient id="${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradient.from}"/><stop offset="100%" stop-color="${gradient.to}"/></linearGradient></defs>`;

  // Insert defs after the opening svg tag
  svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`);

  // Replace fill="none" on root to keep it, but add fill to all path elements
  // that don't already have a fill attribute set to a color
  // For paths with fill="none" (the mask rects etc), keep them
  // For paths without fill or with fill="black"/"#000", replace with gradient
  svg = svg.replace(/<path(?![^>]*fill=)/g, `<path fill="url(#${gradient.id})"`);

  // Also replace explicit black fills
  svg = svg.replace(/fill="black"/g, `fill="url(#${gradient.id})"`);
  svg = svg.replace(/fill="#000"/g, `fill="url(#${gradient.id})"`);
  svg = svg.replace(/fill="#000000"/g, `fill="url(#${gradient.id})"`);

  writeFileSync(filePath, svg, 'utf8');
  console.log(`Colorized ${name} with gradient ${gradient.from} → ${gradient.to}`);
}
