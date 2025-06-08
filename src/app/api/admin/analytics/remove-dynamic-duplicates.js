import fs from 'fs';
import path from 'path';

function cleanDynamicDeclaration(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      cleanDynamicDeclaration(filePath);
    } else if (file === 'route.ts') {
      let content = fs.readFileSync(filePath, 'utf8');
      // On ne garde que la première occurrence
      const parts = content.split("export const dynamic = 'force-dynamic';");
      if (parts.length > 2) {
        content = parts[0] + "export const dynamic = 'force-dynamic';" + parts.slice(1).join('');
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  });
}

cleanDynamicDeclaration('./src/app/api');
