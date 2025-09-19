import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Read package.json to get version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Function to recursively find all .md files in a directory
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      include: ['src/versions/3.0.0/calculators.ts'],
      exclude: ['**/*.test.ts', '**/test/**'],
      copyDtsFiles: true,
    }),
    // Custom plugin to copy .md files from src/versions to dist after build
    {
      name: 'copy-markdown-files',
      writeBundle() {
        const mdFiles = findMarkdownFiles('src/versions');
        mdFiles.forEach(file => {
          const relativePath = file.replace('src/', '');
          const destPath = join('dist', relativePath);
          const destDir = dirname(destPath);
          
          // Create directory if it doesn't exist
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          
          // Copy the file
          copyFileSync(file, destPath);
        });
      },
    },
  ],
  build: {
    lib: {
      entry: {
        'versions/3.0.0/calculators': 'src/versions/3.0.0/calculators.ts',
      },
      formats: ['cjs', 'es'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`;
        }
        return `${entryName}.js`;
      },
    },
    outDir: 'dist',
    sourcemap: false,
    minify: false,
    target: 'es2020',
    rollupOptions: {
      external: (id) => {
        // console.log(id)
        // Don't bundle dependencies
        return !id.startsWith('.') && !id.startsWith('/');
      },
    },
  },
  define: {
    PACKAGE_VERSION: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
