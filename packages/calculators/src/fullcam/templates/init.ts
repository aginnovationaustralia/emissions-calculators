import { FullCAMAreaInputTransformed } from '../input';

export function generateInitialTrees(input: FullCAMAreaInputTransformed) {
  const { initialTrees } = input;

  if (initialTrees === false) {
    return `
      <InitTreeF treeExistsInit="false" maxTreeAgeInit="" avgTreeAgeInit="" tInitStem="Vol" stemMInitF="" branMInitF="" barkMInitF="" leafMInitF="" cortMInitF="" firtMInitF="" stemVolInitF="" stemFracInitF="" branFracInitF="" barkFracInitF="" leafFracInitF="" cortFracInitF="" firtFracInitF="" stemNCRatioInitF="" branNCRatioInitF="" barkNCRatioInitF="" leafNCRatioInitF="" cortNCRatioInitF="" firtNCRatioInitF="" storNMInitF="" stemM3PGInit="" foliM3PGInit="" rootM3PGInit="" nStemsInit="" tTYFCatInitF="Custom" frFracInit="" tFrFracInit="FracConst" treeNmInit="Environmental plantings"/>
    `;
  }

  const { speciesName } = initialTrees;

  switch (speciesName) {
    case 'Native Species Regeneration >=500mm rainfall':
      return '<InitTreeF treeExistsInit="true" maxTreeAgeInit="9999.0" avgTreeAgeInit="9999.0" tInitStem="FracAge" stemMInitF="" branMInitF="25.0" barkMInitF="8.0" leafMInitF="10.0" cortMInitF="15.0" firtMInitF="3.0" stemVolInitF="100.0" stemFracInitF="0.49" branFracInitF="0.11" barkFracInitF="0.09" leafFracInitF="0.04" cortFracInitF="0.24" firtFracInitF="0.03" stemNCRatioInitF="" branNCRatioInitF="" barkNCRatioInitF="" leafNCRatioInitF="" cortNCRatioInitF="" firtNCRatioInitF="" storNMInitF="" stemM3PGInit="5.0" foliM3PGInit="7.0" rootM3PGInit="2.0" nStemsInit="1111.0" tTYFCatInitF="BlockLMG" frFracInit="" tFrFracInit="FracConst" treeNmInit="Native Species Regeneration >=500mm rainfall"/>';
    case 'Native Species Regeneration <500mm rainfall':
      return '<InitTreeF treeExistsInit="true" maxTreeAgeInit="9999.0" avgTreeAgeInit="9999.0" tInitStem="FracAge" stemMInitF="" branMInitF="25.0" barkMInitF="8.0" leafMInitF="10.0" cortMInitF="15.0" firtMInitF="3.0" stemVolInitF="100.0" stemFracInitF="0.28" branFracInitF="0.22" barkFracInitF="0.08" leafFracInitF="0.07" cortFracInitF="0.27" firtFracInitF="0.08" stemNCRatioInitF="" branNCRatioInitF="" barkNCRatioInitF="" leafNCRatioInitF="" cortNCRatioInitF="" firtNCRatioInitF="" storNMInitF="" stemM3PGInit="5.0" foliM3PGInit="7.0" rootM3PGInit="2.0" nStemsInit="1111.0" tTYFCatInitF="BlockLMG" frFracInit="" tFrFracInit="FracConst" treeNmInit="Native Species Regeneration &lt;500mm rainfall"/>';
    case 'Mallee eucalypt species':
      return '<InitTreeF treeExistsInit="true" maxTreeAgeInit="0.0" avgTreeAgeInit="0.0" tInitStem="Frac" stemMInitF="" branMInitF="25.0" barkMInitF="8.0" leafMInitF="10.0" cortMInitF="15.0" firtMInitF="3.0" stemVolInitF="100.0" stemFracInitF="0.238" branFracInitF="0.164" barkFracInitF="0.041" leafFracInitF="0.114" cortFracInitF="0.363" firtFracInitF="0.08" stemNCRatioInitF="" branNCRatioInitF="" barkNCRatioInitF="" leafNCRatioInitF="" cortNCRatioInitF="" firtNCRatioInitF="" storNMInitF="" stemM3PGInit="5.0" foliM3PGInit="7.0" rootM3PGInit="2.0" nStemsInit="1111.0" tTYFCatInitF="Custom" frFracInit="" tFrFracInit="FracConst" treeNmInit="Mallee eucalypt species"/>';
    case 'Environmental plantings':
      return `<InitTreeF treeExistsInit="true" maxTreeAgeInit="12.0" avgTreeAgeInit="12.0" tInitStem="Frac" stemMInitF="" branMInitF="25.0" barkMInitF="8.0" leafMInitF="10.0" cortMInitF="15.0" firtMInitF="3.0" stemVolInitF="100.0" stemFracInitF="0.291" branFracInitF="0.198" barkFracInitF="0.086" leafFracInitF="0.131" cortFracInitF="0.246" firtFracInitF="0.048" stemNCRatioInitF="" branNCRatioInitF="" barkNCRatioInitF="" leafNCRatioInitF="" cortNCRatioInitF="" firtNCRatioInitF="" storNMInitF="" stemM3PGInit="5.0" foliM3PGInit="7.0" rootM3PGInit="2.0" nStemsInit="1111.0" tTYFCatInitF="Custom" frFracInit="" tFrFracInit="FracConst" treeNmInit="Environmental plantings"/>`;
  }
}
