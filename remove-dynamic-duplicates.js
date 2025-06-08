const fs = require('fs');
const path = require('path');

function cleanDynamicDeclaration(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      cleanDynamicDeclaration(filePath);
    } else if (file === 'route.ts') {
      let content = fs.readFileSync(filePath, 'utf8');
      // On ne garde que la première occurrence
      let parts = content.split("export const dynamic = 'force-dynamic';");
      if (parts.length > 2) {
        content = parts[0] + "export const dynamic = 'force-dynamic';" + parts.slice(1).join('');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Doublon nettoyé : ${filePath}`);
      }
    }
  });
}

cleanDynamicDeclaration('./src/app/api');
