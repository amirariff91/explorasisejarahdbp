/**
 * ElevenLabs Audio Generation Script
 * Generates voice narration for DBP SEJARAH game
 * 
 * Usage: node scripts/generate-voice-audio.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ElevenLabs API Configuration
const ELEVENLABS_API_KEY = 'sk_e759bf65de2d0541c7694364437dd8f5205674c504b7ff3d';
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam - warm, friendly voice (multilingual)
// Alternative voices: Rachel (21m00Tcm4TlvDq8ikWAM), Bella (EXAVITQu4vr4xnSDxMaL)

// Output directories
const AUDIO_BASE = path.join(__dirname, '..', 'assets', 'audio');
const FEEDBACK_DIR = path.join(AUDIO_BASE, 'feedback');
const TUTORIAL_DIR = path.join(AUDIO_BASE, 'tutorial');
const STATES_DIR = path.join(AUDIO_BASE, 'states');

// Ensure directories exist
[FEEDBACK_DIR, TUTORIAL_DIR, STATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Voice generation settings
const VOICE_SETTINGS = {
  stability: 0.7,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true
};

/**
 * Generate audio using ElevenLabs API
 */
async function generateAudio(text, outputPath, voiceSettings = VOICE_SETTINGS) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: voiceSettings
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', chunk => errorBody += chunk);
        res.on('end', () => {
          reject(new Error(`API Error ${res.statusCode}: ${errorBody}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Generated: ${path.basename(outputPath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Clean up partial file
        reject(err);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Delay helper for rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Audio generation definitions
const AUDIO_DEFINITIONS = {
  // Tutorial narration (2 files)
  tutorial: [
    {
      file: 'voice-tutorial-step1.mp3',
      text: 'Selamat datang! Anda akan diberikan seratus ringgit Malaysia sebagai duit perjalanan, dan anda perlu melengkapkan perjalanan anda keseluruh negeri di dalam Malaysia. Jika jawapan anda salah, dua ringgit akan ditolak.'
    },
    {
      file: 'voice-tutorial-step2.mp3',
      text: 'Pengembaraan bermula mengikut topik Sejarah dan pelajar perlu menyelesaikan setiap satu aras atau bahagian.'
    }
  ],

  // General instructions (5 files)
  instructions: [
    {
      file: 'voice-welcome.mp3',
      text: 'Selamat datang ke Eksplorasi Sejarah Malaysia'
    },
    {
      file: 'voice-select-state.mp3',
      text: 'Pilih negeri untuk memulakan pengembaraan anda'
    },
    {
      file: 'voice-good-luck.mp3',
      text: 'Semoga berjaya!'
    },
    {
      file: 'voice-try-again.mp3',
      text: 'Cuba lagi! Jangan putus asa'
    },
    {
      file: 'voice-perfect-score.mp3',
      text: 'Sempurna! Anda mendapat markah penuh!'
    }
  ],

  // State completion messages (13 files)
  stateCompletions: [
    { state: 'perlis', name: 'Perlis' },
    { state: 'kedah', name: 'Kedah' },
    { state: 'pulau-pinang', name: 'Pulau Pinang' },
    { state: 'perak', name: 'Perak' },
    { state: 'selangor', name: 'Selangor' },
    { state: 'kuala-lumpur', name: 'Kuala Lumpur' },
    { state: 'negeri-sembilan', name: 'Negeri Sembilan' },
    { state: 'melaka', name: 'Melaka' },
    { state: 'johor', name: 'Johor' },
    { state: 'pahang', name: 'Pahang' },
    { state: 'terengganu', name: 'Terengganu' },
    { state: 'kelantan', name: 'Kelantan' },
    { state: 'sabah', name: 'Sabah' },
    { state: 'sarawak', name: 'Sarawak' }
  ].map(({ state, name }) => ({
    file: `complete-${state}.mp3`,
    text: `Tahniah! Anda telah berjaya menamatkan ${name}!`
  })),

  // Expanded feedback variations (8 files)
  feedback: [
    {
      file: 'correct-1.mp3',
      text: 'Betul sekali!'
    },
    {
      file: 'correct-2.mp3',
      text: 'Jawapan yang tepat!'
    },
    {
      file: 'correct-3.mp3',
      text: 'Syabas!'
    },
    {
      file: 'wrong-1.mp3',
      text: 'Tidak tepat, cuba lagi'
    },
    {
      file: 'wrong-2.mp3',
      text: 'Hampir betul, cuba sekali lagi'
    },
    {
      file: 'encourage-1.mp3',
      text: 'Teruskan usaha!'
    },
    {
      file: 'encourage-2.mp3',
      text: 'Jangan mengalah!'
    },
    {
      file: 'encourage-3.mp3',
      text: 'Anda boleh buat ini!'
    }
  ]
};

/**
 * Main generation function
 */
async function generateAllAudio() {
  console.log('🎙️  Starting ElevenLabs audio generation...\n');
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Model: eleven_multilingual_v2\n`);

  let totalGenerated = 0;
  let totalFailed = 0;

  try {
    // Generate tutorial narration
    console.log('📚 Generating tutorial narration...');
    for (const item of AUDIO_DEFINITIONS.tutorial) {
      try {
        await generateAudio(item.text, path.join(TUTORIAL_DIR, item.file));
        totalGenerated++;
        await delay(500); // Rate limiting
      } catch (error) {
        console.error(`✗ Failed: ${item.file} - ${error.message}`);
        totalFailed++;
      }
    }

    // Generate general instructions
    console.log('\n📢 Generating general instructions...');
    for (const item of AUDIO_DEFINITIONS.instructions) {
      try {
        await generateAudio(item.text, path.join(TUTORIAL_DIR, item.file));
        totalGenerated++;
        await delay(500);
      } catch (error) {
        console.error(`✗ Failed: ${item.file} - ${error.message}`);
        totalFailed++;
      }
    }

    // Generate state completion messages
    console.log('\n🗺️  Generating state completion messages...');
    for (const item of AUDIO_DEFINITIONS.stateCompletions) {
      try {
        await generateAudio(item.text, path.join(STATES_DIR, item.file));
        totalGenerated++;
        await delay(500);
      } catch (error) {
        console.error(`✗ Failed: ${item.file} - ${error.message}`);
        totalFailed++;
      }
    }

    // Generate feedback variations
    console.log('\n💬 Generating feedback variations...');
    for (const item of AUDIO_DEFINITIONS.feedback) {
      try {
        await generateAudio(item.text, path.join(FEEDBACK_DIR, item.file));
        totalGenerated++;
        await delay(500);
      } catch (error) {
        console.error(`✗ Failed: ${item.file} - ${error.message}`);
        totalFailed++;
      }
    }

    console.log('\n✅ Audio generation complete!');
    console.log(`   Generated: ${totalGenerated} files`);
    if (totalFailed > 0) {
      console.log(`   Failed: ${totalFailed} files`);
    }
    console.log(`\nAudio files saved to: ${AUDIO_BASE}`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllAudio().catch(console.error);
}

module.exports = { generateAudio, generateAllAudio };

