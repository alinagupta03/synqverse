const fs = require('fs');
const path = require('path');

const replacements = {
  // Backgrounds
  'bg-black': 'bg-gray-50',
  'bg-[#111]': 'bg-white',
  'bg-[#0a0a0a]': 'bg-gray-100',
  'bg-white/5': 'bg-gray-100',
  'bg-white/10': 'bg-gray-200',
  'bg-white/20': 'bg-gray-300',
  'bg-white/\\[0\\.02\\]': 'bg-gray-50',
  'bg-white/\\[0\\.04\\]': 'bg-gray-100',
  'bg-black/50': 'bg-gray-100',
  'bg-black/40': 'bg-white',
  'bg-black/20': 'bg-gray-100',
  'bg-black/80': 'bg-gray-900/80',
  'backdrop-blur-md': 'backdrop-blur-md',

  // Text
  'text-white': 'text-gray-900',
  'text-white/90': 'text-gray-900',
  'text-white/80': 'text-gray-800',
  'text-white/50': 'text-gray-500',
  'text-muted-foreground': 'text-gray-500',

  // Borders
  'border-white/5': 'border-gray-200',
  'border-white/10': 'border-gray-200',
  'border-white/20': 'border-gray-300',
  'border-white/30': 'border-gray-400',
  'border-t border-white/10': 'border-t border-gray-200',
  'border-b border-white/5': 'border-b border-gray-200',

  // Special Buttons / Accents
  'bg-white text-black hover:bg-white/90': 'bg-orange-500 text-white hover:bg-orange-600',
  'hover:bg-white/5': 'hover:bg-gray-100',
  'hover:bg-white/10': 'hover:bg-gray-200',
  
  // Specific gradients
  'from-blue-900/20 via-black to-black': 'from-orange-100 via-gray-50 to-gray-50',
  'bg-gradient-to-r from-white to-white/50': 'bg-gradient-to-r from-gray-900 to-gray-600',
  'bg-gradient-to-r from-blue-400 to-purple-400': 'bg-gradient-to-r from-orange-500 to-orange-400'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log("Starting Theme Migration...");
let filesChanged = 0;

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'g');
      content = content.replace(regex, value);
    }

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesChanged++;
    }
  }
});

console.log(`Migration complete. Updated ${filesChanged} files.`);
