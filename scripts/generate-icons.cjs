#!/usr/bin/env node
/**
 * Gera TODOS os ícones PWA e brand a partir de uma imagem fonte.
 * Dependência: npx sharp-cli (instalação automática via npx)
 *
 * Uso:  node scripts/generate-icons.cjs <caminho-da-imagem>
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error('Uso: node scripts/generate-icons.cjs <imagem-fonte>');
  process.exit(1);
}

const out = path.resolve(__dirname, '..', 'public');
const sharp = (args) => execSync(`npx -y sharp-cli ${args}`, { stdio: 'inherit' });

const BG = '#041124';

// icon-192 (PWA)
sharp(`-i "${src}" -o "${path.join(out, 'icon-192.png')}" -- resize 192 192 --fit contain --background "${BG}" -- flatten --background "${BG}"`);
console.log('✓ icon-192.png');

// icon-512 (PWA)
sharp(`-i "${src}" -o "${path.join(out, 'icon-512.png')}" -- resize 512 512 --fit contain --background "${BG}" -- flatten --background "${BG}"`);
console.log('✓ icon-512.png');

// apple-touch-icon
sharp(`-i "${src}" -o "${path.join(out, 'apple-touch-icon.png')}" -- resize 180 180 --fit contain --background "${BG}" -- flatten --background "${BG}"`);
console.log('✓ apple-touch-icon.png');

// icon-maskable (smaller art in 512 canvas for safe zone)
sharp(`-i "${src}" -o "${path.join(out, 'icon-maskable.png')}" -- resize 356 356 --fit contain --background "${BG}" -- extend --top 78 --bottom 78 --left 78 --right 78 --background "${BG}" -- flatten --background "${BG}"`);
console.log('✓ icon-maskable.png');

// favicon-32
sharp(`-i "${src}" -o "${path.join(out, 'favicon-32.png')}" -- resize 32 32 --fit contain`);
console.log('✓ favicon-32.png');

// brand-penguin.webp (large, for login/header)
sharp(`-i "${src}" -o "${path.join(out, 'brand-penguin.webp')}" -- resize 512 512 --fit contain`);
console.log('✓ brand-penguin.webp');

console.log('\nTodos os ícones gerados com sucesso!');
