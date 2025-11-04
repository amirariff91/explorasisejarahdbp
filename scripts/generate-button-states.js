#!/usr/bin/env node
/**
 * Generate Button State Variants
 * 
 * Creates pressed and disabled variants for interactive buttons.
 * 
 * Transformations:
 * - Pressed: 10% darker, slight offset (shadow effect)
 * - Disabled: 50% opacity (grayed out)
 * 
 * Requirements:
 *   npm install sharp
 * 
 * Usage:
 *   node scripts/generate-button-states.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp is not installed');
  console.error('Please run: npm install --save-dev sharp');
  console.error('Or: yarn add --dev sharp');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'images');

/**
 * Button configurations
 * Each button needs default, pressed, and disabled variants
 */
const BUTTONS = [
  {
    name: 'menu-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'menu-button.png'),
    outputDir: path.join(ASSETS_DIR, 'shared', 'buttons'),
    pressedEffect: 'darken', // darken or glow
  },
  {
    name: 'next-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'next-button.png'),
    outputDir: path.join(ASSETS_DIR, 'shared', 'buttons'),
    pressedEffect: 'darken',
  },
  {
    name: 'ok-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'ok-button.png'),
    outputDir: path.join(ASSETS_DIR, 'shared', 'buttons'),
    pressedEffect: 'darken',
  },
  {
    name: 'jawapan-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'jawapan-button.png'),
    outputDir: path.join(ASSETS_DIR, 'games', 'dbp-sejarah'),
    pressedEffect: 'darken',
  },
  {
    name: 'betul-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'betul-button.png'),
    outputDir: path.join(ASSETS_DIR, 'games', 'dbp-sejarah'),
    pressedEffect: 'glow',
    glowColor: { r: 76, g: 175, b: 80 }, // Green #4CAF50
  },
  {
    name: 'salah-button',
    input: path.join(ASSETS_DIR, 'game', 'buttons', 'salah-button.png'),
    outputDir: path.join(ASSETS_DIR, 'games', 'dbp-sejarah'),
    pressedEffect: 'glow',
    glowColor: { r: 255, g: 68, b: 68 }, // Red #FF4444
  },
  {
    name: 'button-teruskan',
    input: path.join(ASSETS_DIR, 'game', 'ui-elements', 'button-teruskan.png'),
    outputDir: path.join(ASSETS_DIR, 'games', 'dbp-sejarah'),
    pressedEffect: 'glow',
    glowColor: { r: 255, g: 215, b: 0 }, // Gold #FFD700
  },
];

/**
 * Generate pressed variant (10% darker)
 */
async function generatePressed(inputPath, outputPath, effect, glowColor) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (effect === 'darken') {
      // Apply brightness reduction (10% darker)
      await image
        .modulate({ brightness: 0.9 }) // 90% brightness = 10% darker
        .toFile(outputPath);
    } else if (effect === 'glow' && glowColor) {
      // Create glow effect (simplified - just tint slightly)
      // For a true glow, you'd need to create a blurred layer and composite
      await image
        .modulate({ brightness: 1.1, saturation: 1.2 }) // Slightly brighter and more saturated
        .toFile(outputPath);
    }

    console.log(`  ✓ Pressed: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`  ✗ Error generating pressed variant: ${error.message}`);
  }
}

/**
 * Generate disabled variant (50% opacity)
 */
async function generateDisabled(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Create a semi-transparent overlay
    // Sharp doesn't directly support opacity, so we composite with a transparent layer
    const { width, height } = metadata;

    // Create transparent overlay
    const overlay = Buffer.from(
      `<svg width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="white" opacity="0.5"/>
      </svg>`
    );

    await image
      .composite([{ input: overlay, blend: 'dest-in' }])
      .toFile(outputPath);

    console.log(`  ✓ Disabled: ${path.basename(outputPath)}`);
  } catch (error) {
    // Fallback: just reduce brightness significantly
    console.warn(`  ⚠ Opacity not supported, using brightness reduction`);
    try {
      await sharp(inputPath)
        .modulate({ brightness: 0.5 }) // 50% brightness as fallback
        .toFile(outputPath);
      console.log(`  ✓ Disabled (fallback): ${path.basename(outputPath)}`);
    } catch (fallbackError) {
      console.error(`  ✗ Error generating disabled variant: ${fallbackError.message}`);
    }
  }
}

/**
 * Generate @2x and @3x variants
 */
async function generateDensityVariants(inputPath, outputDir, baseName, suffix) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // @2x (200%)
    const output2x = path.join(outputDir, `${baseName}${suffix}@2x.png`);
    await image
      .clone()
      .resize(Math.round(metadata.width * 2), Math.round(metadata.height * 2))
      .toFile(output2x);
    console.log(`  ✓ @2x: ${path.basename(output2x)}`);

    // @3x (300%)
    const output3x = path.join(outputDir, `${baseName}${suffix}@3x.png`);
    await image
      .clone()
      .resize(Math.round(metadata.width * 3), Math.round(metadata.height * 3))
      .toFile(output3x);
    console.log(`  ✓ @3x: ${path.basename(output3x)}`);
  } catch (error) {
    console.error(`  ✗ Error generating density variants: ${error.message}`);
  }
}

/**
 * Process a single button
 */
async function processButton(button) {
  console.log(`\n📦 Processing: ${button.name}`);

  // Check if input file exists
  if (!fs.existsSync(button.input)) {
    console.error(`  ✗ Input file not found: ${button.input}`);
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(button.outputDir)) {
    fs.mkdirSync(button.outputDir, { recursive: true });
  }

  // Generate default (copy original)
  const defaultOutput = path.join(button.outputDir, `${button.name}.png`);
  try {
    await sharp(button.input).toFile(defaultOutput);
    console.log(`  ✓ Default: ${path.basename(defaultOutput)}`);
  } catch (error) {
    console.error(`  ✗ Error copying default: ${error.message}`);
    return;
  }

  // Generate pressed variant
  const pressedOutput = path.join(button.outputDir, `${button.name}-pressed.png`);
  await generatePressed(button.input, pressedOutput, button.pressedEffect, button.glowColor);

  // Generate disabled variant
  const disabledOutput = path.join(button.outputDir, `${button.name}-disabled.png`);
  await generateDisabled(button.input, disabledOutput);

  // Generate density variants for all states
  console.log(`  📐 Generating density variants...`);
  await generateDensityVariants(defaultOutput, button.outputDir, button.name, '');
  await generateDensityVariants(pressedOutput, button.outputDir, button.name, '-pressed');
  await generateDensityVariants(disabledOutput, button.outputDir, button.name, '-disabled');
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Button State Variant Generator');
  console.log('=================================\n');

  for (const button of BUTTONS) {
    await processButton(button);
  }

  console.log('\n✅ Done! All button states generated.');
  console.log('\n📝 Next steps:');
  console.log('1. Review generated images in output directories');
  console.log('2. Update /constants/assets.ts to use new paths');
  console.log('3. Test button states in components');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { processButton, generatePressed, generateDisabled };

