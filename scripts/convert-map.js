const fs = require('fs');
const topojson = require('topojson-client');
const d3 = require('d3-geo');

const TOPOJSON_FILE = './scripts/my-all.topo.json';

const STATE_MAPPING = {
  'MY.SA': 'sabah',
  'MY.SK': 'sarawak',
  'MY.PL': 'perlis',
  'MY.KH': 'kedah',
  'MY.PG': 'pulau-pinang',
  'MY.PK': 'perak',
  'MY.SL': 'selangor',
  'MY.KL': 'kuala-lumpur',
  'MY.NS': 'negeri-sembilan',
  'MY.ME': 'melaka',
  'MY.JH': 'johor',
  'MY.PH': 'pahang',
  'MY.KN': 'kelantan',
  'MY.TE': 'terengganu'
};

function generateMapPaths() {
  try {
    console.log('📥 Loading TopoJSON data...');
    const topology = JSON.parse(fs.readFileSync(TOPOJSON_FILE, 'utf8'));

    console.log('🔄 Converting to GeoJSON...');
    const geojson = topojson.feature(topology, topology.objects.default);

    console.log('📐 Creating projection...');
    const projection = d3.geoMercator().fitSize([1200, 800], geojson);
    const pathGenerator = d3.geoPath(projection);

    console.log('✏️  Generating SVG paths...');
    const statePaths = {};
    let convertedCount = 0;
    let skippedCount = 0;

    geojson.features.forEach(feature => {
      const stateId = feature.id;
      const stateName = STATE_MAPPING[stateId];

      if (stateName) {
        const path = pathGenerator(feature);
        if (path) {
          statePaths[stateName] = path;
          convertedCount++;
          console.log(`  ✓ ${stateName} (${feature.properties.name})`);
        }
      } else {
        console.log(`  ⚠️  Skipped: ${stateId} (${feature.properties.name})`);
        skippedCount++;
      }
    });

    console.log(`\n✅ Converted ${convertedCount} states`);
    console.log(`⏭️  Skipped ${skippedCount} regions (Labuan, Putrajaya not in MalaysianState type)`);

    const output = `// Auto-generated from Highcharts Malaysia TopoJSON
// Source: https://code.highcharts.com/mapdata/2.3.2/countries/my/my-all.topo.json
// Generated: ${new Date().toISOString()}
// States: ${convertedCount}

import type { MalaysianState } from '@/types';

/**
 * Professional Malaysia map SVG paths from Highcharts
 * Coordinate system: ViewBox 0 0 1200 800
 * Projection: Mercator
 */
export const statePaths: Record<MalaysianState, string> = ${JSON.stringify(statePaths, null, 2)} as const;
`;

    fs.writeFileSync('./constants/mapPaths.ts', output);
    console.log('\n💾 Saved to constants/mapPaths.ts');
    console.log('🎉 Done! You can now import and use the generated paths in your component.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateMapPaths();
