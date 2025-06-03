const fs = require('fs').promises; // Use promise-based fs for async operations
const path =require('path');
// execSync is not used with async approach, jsdoc2md handles its own operations
const jsdoc2md = require('jsdoc-to-markdown');

const baseDir = path.resolve(__dirname, '../../web-automation-framework');
const outputBaseDirEn = path.resolve(__dirname, '../en/api');
const outputBaseDirTr = path.resolve(__dirname, '../tr/api');

// İşlenecek klasörler
const sourceDirs = ['core', 'modules', 'utils'];
// İşlenecek tekil dosyalar
const sourceFiles = [path.join(baseDir, 'index.js')];

async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch (e) {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Oluşturuldu: ${dir}`);
  }
}

async function processFile(inputFile, outputDirEn, outputDirTr) {
  const baseName = path.basename(inputFile, '.js');
  const outputFileEn = path.join(outputDirEn, `${baseName}.md`);
  const outputFileTr = path.join(outputDirTr, `${baseName}.md`);

  console.log(`İşleniyor: ${inputFile}`);

  try {
    const mdContent = await jsdoc2md.render({ files: inputFile });

    if (mdContent.trim() === '*Nothing to document.*' || mdContent.trim() === '') {
      console.warn(`Uyarı: ${inputFile} için JSDoc yorumu bulunamadı veya boş.`);
      const warningMessage = `# ${baseName}\n\n*Bu dosya için JSDoc yorumu bulunamadı veya yorumlar boş.*`;
      await fs.writeFile(outputFileEn, warningMessage);
      await fs.writeFile(outputFileTr, warningMessage);
    } else {
      await fs.writeFile(outputFileEn, mdContent);
      console.log(`Oluşturuldu: ${outputFileEn}`);
      await fs.writeFile(outputFileTr, mdContent);
      console.log(`Oluşturuldu: ${outputFileTr}`);
    }
  } catch (error) {
    console.error(`Hata (${inputFile}): ${error.message}`);
    const errorMessage = `# ${baseName}\n\n*JSDoc yorumları işlenirken bir hata oluştu: ${error.message}*`;
    try {
      await fs.writeFile(outputFileEn, errorMessage);
      await fs.writeFile(outputFileTr, errorMessage);
    } catch (writeError) {
      console.error(`Hata dosyası yazılırken ek hata (${inputFile}): ${writeError.message}`);
    }
  }
}

async function main() {
  // Çıktı klasörlerinin var olduğundan emin ol
  await ensureDirExists(outputBaseDirEn);
  await ensureDirExists(outputBaseDirTr);

  console.log('API dokümantasyonları oluşturuluyor...');

  // Klasörlerdeki dosyaları işle
  for (const sourceDir of sourceDirs) {
    const fullSourceDir = path.join(baseDir, sourceDir);
    try {
      await fs.access(fullSourceDir);
      const files = (await fs.readdir(fullSourceDir)).filter(file => file.endsWith('.js'));
      for (const file of files) {
        await processFile(path.join(fullSourceDir, file), outputBaseDirEn, outputBaseDirTr);
      }
    } catch (e) {
      console.warn(`Uyarı: Kaynak klasörü bulunamadı veya erişilemedi: ${fullSourceDir}`);
    }
  }

  // Tekil dosyaları işle
  for (const inputFile of sourceFiles) {
    try {
      await fs.access(inputFile);
      await processFile(inputFile, outputBaseDirEn, outputBaseDirTr);
    } catch (e) {
      console.warn(`Uyarı: Kaynak dosyası bulunamadı veya erişilemedi: ${inputFile}`);
    }
  }

  console.log('API dokümantasyonları oluşturma tamamlandı.');
}

main().catch(console.error);
