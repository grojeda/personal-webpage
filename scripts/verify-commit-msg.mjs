#!/usr/bin/env node
import fs from 'node:fs';

const [, , messageFile] = process.argv;

if (!messageFile) {
  console.error('No se recibio el archivo con el mensaje de commit.');
  process.exit(1);
}

const message = fs.readFileSync(messageFile, 'utf8').split('\n')[0].trim();

const gitmojiPattern = /^((:[a-z0-9_+\-]+:)|(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*))(?:\s.+)$/u;

if (!gitmojiPattern.test(message)) {
  console.error(
    'El mensaje de commit debe comenzar con un gitmoji (por ejemplo "✨ Nueva feature" o ":sparkles: Nueva feature").'
  );
  process.exit(1);
}
