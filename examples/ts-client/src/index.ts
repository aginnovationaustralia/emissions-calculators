import { calculateBeef } from '@aginnovationaustralia/emissions-calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/types/Beef/input';

/**
 * Example TypeScript client consuming the @aginnovationaustralia/emissions-calculators package
 * This demonstrates how to use the package to calculate beef emissions
 */
async function main() {
  try {
    console.log('🐄 Starting Beef Emissions Calculation Example...\n');

    // Create a sample beef input (simplified for demonstration)
    const beefInput: BeefInput = {
      state: 'nsw' as const,
      northOfTropicOfCapricorn: true,
      rainfallAbove600: true,
      beef: [
        {
          classes: {
            bullsGt1: {
              autumn: {
                head: 50,
                liveweight: 600,
                liveweightGain: 50,
                crudeProtein: 12,
                dryMatterDigestibility: 65
              },
              winter: {
                head: 50,
                liveweight: 580,
                liveweightGain: 30,
                crudeProtein: 10,
                dryMatterDigestibility: 60
              },
              spring: {
                head: 50,
                liveweight: 620,
                liveweightGain: 80,
                crudeProtein: 14,
                dryMatterDigestibility: 70
              },
              summer: {
                head: 50,
                liveweight: 650,
                liveweightGain: 60,
                crudeProtein: 13,
                dryMatterDigestibility: 68
              },
              headSold: 10,
              saleWeight: 650,
              purchases: []
            }
          },
          limestone: 0,
          limestoneFraction: 0,
          fertiliser: {
            singleSuperphosphate: 0,
            pastureDryland: 0,
            pastureIrrigated: 0,
            cropsDryland: 0,
            cropsIrrigated: 0
          },
          diesel: 0,
          petrol: 0,
          lpg: 0,
          mineralSupplementation: {
            mineralBlock: 0,
            mineralBlockUrea: 0,
            weanerBlock: 0,
            weanerBlockUrea: 0,
            drySeasonMix: 0,
            drySeasonMixUrea: 0
          },
          electricitySource: 'State Grid' as const,
          electricityRenewable: 0,
          electricityUse: 0,
          grainFeed: 0,
          hayFeed: 0,
          cottonseedFeed: 0,
          herbicide: 0,
          herbicideOther: 0,
          cowsCalving: {
            autumn: 0,
            winter: 0,
            spring: 0,
            summer: 0
          }
        }
      ],
      burning: [],
      vegetation: []
    };

    console.log('📊 Input Data:');
    console.log(`- State: ${beefInput.state}`);
    console.log(`- North of Tropic of Capricorn: ${beefInput.northOfTropicOfCapricorn}`);
    console.log(`- Rainfall Above 600mm: ${beefInput.rainfallAbove600}`);
    console.log(`- Number of Beef Classes: ${beefInput.beef.length}`);
    console.log(`- Total Bulls (>1 year): ${beefInput.beef[0].classes.bullsGt1?.autumn.head || 0}`);
    console.log(`- Total Steers (1-2 years): ${beefInput.beef[0].classes.steers1To2?.autumn.head || 0}`);
    console.log(`- Total Cows (>2 years): ${beefInput.beef[0].classes.cowsGt2?.autumn.head || 0}\n`);

    // Calculate emissions using the latest version
    console.log('🔄 Calculating emissions...');
    const result = calculateBeef(beefInput);

    console.log('✅ Calculation completed!\n');

    // Display results
    console.log('📈 Results Summary:');
    console.log(`- Calculator: Beef`);
    console.log(`- Calculation completed successfully\n`);

    console.log('🌍 Scope 1 Emissions (Direct):');
    console.log(`- Enteric CH4: ${result.scope1.entericCH4?.toFixed(2) || 'N/A'} t CO2-e`);
    console.log(`- Manure Management CH4: ${result.scope1.manureManagementCH4?.toFixed(2) || 'N/A'} t CO2-e`);
    console.log(`- Savannah Burning N2O: ${result.scope1.savannahBurningN2O?.toFixed(2) || 'N/A'} t CO2-e`);
    console.log(`- Total Scope 1: ${result.scope1.total?.toFixed(2) || 'N/A'} t CO2-e\n`);

    console.log('🏭 Scope 2 Emissions (Indirect Energy):');
    console.log(`- Total Scope 2: ${result.scope2.total?.toFixed(2) || 'N/A'} t CO2-e\n`);

    console.log('🚚 Scope 3 Emissions (Other Indirect):');
    console.log(`- Total Scope 3: ${result.scope3.total?.toFixed(2) || 'N/A'} t CO2-e\n`);

    console.log('🌱 Carbon Sequestration:');
    console.log(`- Total Sequestration: ${result.carbonSequestration.total?.toFixed(2) || 'N/A'} t CO2-e\n`);

    console.log('📊 Net Emissions:');
    console.log(`- Net Total: ${result.net.total?.toFixed(2) || 'N/A'} t CO2-e\n`);

    console.log('📈 Emission Intensities:');
    console.log(`- Liveweight Beef Produced: ${result.intensities.liveweightBeefProducedKg?.toFixed(2) || 'N/A'} kg`);
    console.log(`- Beef Excluding Sequestration: ${result.intensities.beefExcludingSequestration?.toFixed(2) || 'N/A'} kg CO2-e/kg`);
    console.log(`- Beef Including Sequestration: ${result.intensities.beefIncludingSequestration?.toFixed(2) || 'N/A'} kg CO2-e/kg\n`);

    console.log('🎉 Example completed successfully!');

  } catch (error) {
    console.error('❌ Error occurred during calculation:');
    console.error(error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main };
