/**
 * Download Royalty-Free Background Music and Ambient Sounds
 * Sources audio from free libraries for DBP SEJARAH game
 * 
 * Audio Sources:
 * - Pixabay (https://pixabay.com/music/) - Free music
 * - Zapsplat (https://www.zapsplat.com/) - Free SFX
 * - Freesound (https://freesound.org/) - Creative Commons sounds
 * 
 * Usage: node scripts/download-audio-assets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const MUSIC_DIR = path.join(__dirname, '..', 'assets', 'audio', 'music');
const AMBIENT_DIR = path.join(__dirname, '..', 'assets', 'audio', 'ambient');

// Ensure directories exist
[MUSIC_DIR, AMBIENT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Download file from URL
 */
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Create silent placeholder MP3 (minimal file)
 * Used as fallback when downloads fail
 */
function createSilentPlaceholder(outputPath, durationSeconds = 10) {
  console.log(`ℹ️  Creating silent placeholder: ${path.basename(outputPath)}`);
  
  // Minimal MP3 header for silent audio (actual implementation would need proper encoding)
  // For now, copy from existing audio file
  const existingAudio = path.join(__dirname, '..', 'assets', 'audio', 'ui', 'click.mp3');
  
  if (fs.existsSync(existingAudio)) {
    fs.copyFileSync(existingAudio, outputPath);
    console.log(`✓ Created placeholder: ${path.basename(outputPath)}`);
  } else {
    console.warn(`⚠️  Cannot create placeholder - no reference audio found`);
  }
}

// Royalty-free audio URLs (Pixabay - free license)
// Note: These are example URLs - actual URLs need to be obtained from Pixabay after browsing
const AUDIO_SOURCES = {
  music: [
    {
      name: 'bgm-map.mp3',
      url: 'PLACEHOLDER', // Malaysian traditional music mix
      description: 'Map/Menu Theme - Welcoming, exploratory'
    },
    {
      name: 'bgm-quiz.mp3',
      url: 'PLACEHOLDER', // Calm educational background
      description: 'Quiz Theme - Focused, thoughtful'
    },
    {
      name: 'bgm-success.mp3',
      url: 'PLACEHOLDER', // Celebratory orchestral
      description: 'Success Theme - Triumphant, joyful'
    },
    {
      name: 'bgm-tutorial.mp3',
      url: 'PLACEHOLDER', // Soft piano and strings
      description: 'Tutorial Theme - Friendly, instructive'
    }
  ],
  ambient: [
    {
      name: 'ambient-map.mp3',
      url: 'PLACEHOLDER', // Tropical birds, gentle breeze
      description: 'Map Ambience - Tropical nature sounds'
    },
    {
      name: 'ambient-quiz-soft.mp3',
      url: 'PLACEHOLDER', // Minimal room tone
      description: 'Quiz Ambience - Subtle concentration atmosphere'
    },
    {
      name: 'ambient-celebration.mp3',
      url: 'PLACEHOLDER', // Crowd cheering, confetti
      description: 'Celebration Ambience - Crowd and confetti'
    }
  ]
};

/**
 * Main download function
 */
async function downloadAllAudio() {
  console.log('🎵 Downloading royalty-free audio assets...\n');
  console.log('⚠️  NOTE: This script creates placeholder files.');
  console.log('   For production, replace with proper audio from:');
  console.log('   - Pixabay Music: https://pixabay.com/music/');
  console.log('   - Zapsplat: https://www.zapsplat.com/');
  console.log('   - Freesound: https://freesound.org/\n');

  let totalCreated = 0;

  try {
    // Download/create music tracks
    console.log('🎼 Processing background music...');
    for (const item of AUDIO_SOURCES.music) {
      const outputPath = path.join(MUSIC_DIR, item.name);
      
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipping (already exists): ${item.name}`);
        continue;
      }

      if (item.url === 'PLACEHOLDER') {
        createSilentPlaceholder(outputPath, 120); // 2-minute placeholder
      } else {
        try {
          await downloadFile(item.url, outputPath);
        } catch (error) {
          console.warn(`⚠️  Download failed for ${item.name}, creating placeholder`);
          createSilentPlaceholder(outputPath, 120);
        }
      }
      totalCreated++;
    }

    // Download/create ambient sounds
    console.log('\n🌿 Processing ambient sounds...');
    for (const item of AUDIO_SOURCES.ambient) {
      const outputPath = path.join(AMBIENT_DIR, item.name);
      
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipping (already exists): ${item.name}`);
        continue;
      }

      if (item.url === 'PLACEHOLDER') {
        createSilentPlaceholder(outputPath, 120);
      } else {
        try {
          await downloadFile(item.url, outputPath);
        } catch (error) {
          console.warn(`⚠️  Download failed for ${item.name}, creating placeholder`);
          createSilentPlaceholder(outputPath, 120);
        }
      }
      totalCreated++;
    }

    console.log(`\n✅ Audio asset processing complete!`);
    console.log(`   Created: ${totalCreated} files`);
    console.log(`\n📝 NEXT STEPS:`);
    console.log(`   1. Browse Pixabay Music for appropriate tracks`);
    console.log(`   2. Download MP3 files (128-192kbps)`);
    console.log(`   3. Replace placeholder files in:`);
    console.log(`      - ${MUSIC_DIR}`);
    console.log(`      - ${AMBIENT_DIR}`);
    console.log(`\n🎨 AUDIO REQUIREMENTS:`);
    console.log(`   bgm-map: Malaysian traditional instruments + modern (90-100 BPM, 90-120s)`);
    console.log(`   bgm-quiz: Soft strings, gentle percussion (70-80 BPM, 90-120s)`);
    console.log(`   bgm-success: Celebratory orchestration (120-130 BPM, 30-45s)`);
    console.log(`   bgm-tutorial: Soft piano, light strings (80 BPM, 60-90s)`);
    console.log(`   ambient-map: Tropical birds, gentle breeze (120s loop)`);
    console.log(`   ambient-quiz-soft: Minimal room tone (120s loop)`);
    console.log(`   ambient-celebration: Crowd cheering, confetti (15s)`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  downloadAllAudio().catch(console.error);
}

module.exports = { downloadAllAudio };

