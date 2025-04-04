import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "../public");

// Target the specific large image
const largeImagePath = path.join(publicDir, "images/products/awnings/main.jpg");

async function optimizeImage(imagePath) {
  try {
    console.log(`Optimizing: ${imagePath}`);

    // Create a temporary path for the optimized image
    const optimizedPath = `${imagePath}.optimized`;

    // Optimize the image - reduce quality to 80% and resize if needed
    await sharp(imagePath)
      .resize(1200) // Limit max width to 1200px while maintaining aspect ratio
      .jpeg({ quality: 80, progressive: true }) // Reduce quality to 80%
      .toFile(optimizedPath);

    // Get file sizes for comparison
    const originalSize = fs.statSync(imagePath).size / (1024 * 1024);
    const optimizedSize = fs.statSync(optimizedPath).size / (1024 * 1024);

    // Replace the original with the optimized version
    fs.unlinkSync(imagePath);
    fs.renameSync(optimizedPath, imagePath);

    console.log(`Optimized ${path.basename(imagePath)}:`);
    console.log(`  Original: ${originalSize.toFixed(2)}MB`);
    console.log(`  Optimized: ${optimizedSize.toFixed(2)}MB`);
    console.log(
      `  Reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(2)}%`,
    );

    return true;
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
    return false;
  }
}

// Optimize the specific large image
async function run() {
  if (fs.existsSync(largeImagePath)) {
    await optimizeImage(largeImagePath);
  } else {
    console.error(`File not found: ${largeImagePath}`);
  }
}

run();
