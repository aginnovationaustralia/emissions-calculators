import {
  FullCAMAreaInputTransformed,
  FullCAMClearableAreaInputTransformed,
  FullCAMClearingEventTransformed,
  FullCAMPlantingEventTransformed,
  FullCAMPrescribedBurnEventTransformed,
  FullCAMWildfireEventTransformed,
  isAreaClearable,
} from '../input';
import { treeSpeciesIdMap } from '../types';
import { escapeXmlAttribute } from './xml';

function fullCAMDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}${String(m).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

const shapeMap: Record<FullCAMPlantingEventTransformed['shape'], string> = {
  BeltLt1500SPH: 'BeltL',
  BeltGt1500SPH: 'BeltH',
  Block: 'BlockES',
};

function generatePlantingEvent(event: FullCAMPlantingEventTransformed): string {
  const plantingName = escapeXmlAttribute(
    `Establish ${event.speciesName} - ${event.shape} geometry - ${fullCAMDate(event.plantingDate)}`,
  );
  const shape = shapeMap[event.shape];
  switch (event.speciesName) {
    case 'Environmental plantings':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1990" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Environmental plantings']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.3" stemVolPlnF="" stemMPlnF="0.087" branMPlnF="0.059" barkMPlnF="0.026" leafMPlnF="0.039" cortMPlnF="0.074" firtMPlnF="0.014" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="${shape}" treeNmPlnF="Environmental plantings"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Mallee eucalypt species':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1990" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Mallee eucalypt species']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.3" stemVolPlnF="" stemMPlnF="0.072" branMPlnF="0.049" barkMPlnF="0.012" leafMPlnF="0.034" cortMPlnF="0.109" firtMPlnF="0.024" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="${shape}" treeNmPlnF="Mallee eucalypt species"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration <500mm rainfall':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="PlantTreesNat" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Native Species Regeneration <500mm rainfall']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.0" stemVolPlnF="" stemMPlnF="0.0" branMPlnF="0.0" barkMPlnF="0.0" leafMPlnF="0.0" cortMPlnF="0.0" firtMPlnF="0.0" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="${shape}" treeNmPlnF="Native Species Regeneration &lt;500mm rainfall"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration >=500mm rainfall':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="PlantTreesNat" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Native Species Regeneration >=500mm rainfall']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.0" stemVolPlnF="" stemMPlnF="0.0" branMPlnF="0.0" barkMPlnF="0.0" leafMPlnF="0.0" cortMPlnF="0.0" firtMPlnF="0.0" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="${shape}" treeNmPlnF="Native Species Regeneration >=500mm rainfall"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
  }
}

const productFactorPaper = 30 / 90;
const productFactorPackingWood = 30 / 90;
const productFactorFiberboard = 5 / 90;
const productFactorConstruction = 20 / 90;
const productFactorMillResidue = 5 / 90;

function generateClearingEvent(
  input: FullCAMClearableAreaInputTransformed,
  event: FullCAMClearingEventTransformed,
): string {
  const fractionThinned = event.percentThinned / 100;
  const clear = event.percentThinned === 100;
  const fractionAsProducts = event.percentMassRecoveredAsProducts / 100;
  const fractionDeadStems = 1 - fractionAsProducts;
  const fractionPaper = fractionAsProducts * productFactorPaper;
  const fractionPackingWood = fractionAsProducts * productFactorPackingWood;
  const fractionFiberboard = fractionAsProducts * productFactorFiberboard;
  const fractionConstruction = fractionAsProducts * productFactorConstruction;
  const fractionMillResidue = fractionAsProducts * productFactorMillResidue;

  switch (input.initialTrees.speciesName) {
    case 'Environmental plantings':
      return `<Event tEV="Thin" clearEV="${clear}" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrProdRcvy" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="1" regimeInstance="03d08d73-a238-415f-b843-bd8dd217b398" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${fractionThinned}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Environmental plantings" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="${fractionDeadStems}" fracStemToFuelThin="0" fracStemToPaprThin="${fractionPaper}" fracStemToPackThin="${fractionPackingWood}" fracStemToFurnThin="0" fracStemToFibrThin="${fractionFiberboard}" fracStemToConsThin="${fractionConstruction}" fracStemToResiThin="${fractionMillResidue}" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Mallee eucalypt species':
      return `<Event tEV="Thin" clearEV="${clear}" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrProdRcvy" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="067c5913-4216-4640-8030-640d5e2c38a1" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${fractionThinned}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Mallee eucalypt species" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="${fractionDeadStems}" fracStemToFuelThin="0" fracStemToPaprThin="${fractionPaper}" fracStemToPackThin="${fractionPackingWood}" fracStemToFurnThin="0" fracStemToFibrThin="${fractionFiberboard}" fracStemToConsThin="${fractionConstruction}" fracStemToResiThin="${fractionMillResidue}" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration <500mm rainfall':
      return `<Event tEV="Thin" clearEV="${clear}" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrProdRcvy" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="6d85e4ca-156b-4e79-b448-73e0e999e191" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${fractionThinned}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Native Species Regeneration &lt;500mm rainfall" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="${fractionDeadStems}" fracStemToFuelThin="0" fracStemToPaprThin="${fractionPaper}" fracStemToPackThin="${fractionPackingWood}" fracStemToFurnThin="0" fracStemToFibrThin="${fractionFiberboard}" fracStemToConsThin="${fractionConstruction}" fracStemToResiThin="${fractionMillResidue}" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration >=500mm rainfall':
      return `    <Event tEV="Thin" clearEV="${clear}" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrProdRcvy" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="9eafa5a3-2796-4eda-9700-7c47370dc3fc" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${fractionThinned}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Native Species Regeneration >=500mm rainfall" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="${fractionDeadStems}" fracStemToFuelThin="0" fracStemToPaprThin="${fractionPaper}" fracStemToPackThin="${fractionPackingWood}" fracStemToFurnThin="0" fracStemToFibrThin="${fractionFiberboard}" fracStemToConsThin="${fractionConstruction}" fracStemToResiThin="${fractionMillResidue}" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
  }
}

function generateWildfireEvent(event: FullCAMWildfireEventTransformed): string {
  if (event.treesKilled) {
    return `<Event tEV="FirF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1" aqEnYrEV="2100" nmEV="Wildfire - trees killed" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="2096fb6e-5550-4d5b-a286-e2418c420f88" nmRegime="New Regime">
      <notesEV/>
      <FirF fracAfctFirF="${event.percentBurned / 100}" fracStemToAtmsFirF="0.1" fracBranToAtmsFirF="0.2" fracBarkToAtmsFirF="0.1" fracLeafToAtmsFirF="0.8" fracCortToAtmsFirF="0" fracFirtToAtmsFirF="0" fracStemToDdwdFirF="0.9" fracBranToDdwdFirF="0.8" fracBarkToBlitFirF="0.9" fracLeafToLlitFirF="0.2" fracCortToCodrFirF="1" fracFirtToFidrFirF="1" fracStemToSDdwdFirF="0" fracBranToSChwdFirF="0" fracBarkToSBlitFirF="0" fracLeafToSLlitFirF="0" fracCortToSCodrFirF="0" fracFirtToSFidrFirF="0" fracDDdwdToAtmsFirF="0.25" fracRDdwdToAtmsFirF="0.25" fracDChwdToAtmsFirF="0" fracRChwdToAtmsFirF="0" fracDBlitToAtmsFirF="1" fracRBlitToAtmsFirF="1" fracDLlitToAtmsFirF="1" fracRLlitToAtmsFirF="1" fracDCodrToAtmsFirF="0.2" fracRCodrToAtmsFirF="0.2" fracDFidrToAtmsFirF="0" fracRFidrToAtmsFirF="0" fracDDdwdToInrtFirF="0" fracRDdwdToInrtFirF="0" fracDChwdToInrtFirF="0" fracRChwdToInrtFirF="0" fracDBlitToInrtFirF="0" fracRBlitToInrtFirF="0" fracDLlitToInrtFirF="0" fracRLlitToInrtFirF="0" fracDCodrToInrtFirF="0" fracRCodrToInrtFirF="0" fracDFidrToInrtFirF="0" fracRFidrToInrtFirF="0" fracSopmToAtmsFirF="" fracLrpmToAtmsFirF="" fracMrpmToAtmsFirF="" fracSommToAtmsFirF="" fracLrmmToAtmsFirF="" fracMrmmToAtmsFirF="" fracMicrToAtmsFirF="" fracSopmToInrtFirF="" fracLrpmToInrtFirF="" fracMrpmToInrtFirF="" fracSommToInrtFirF="" fracLrmmToInrtFirF="" fracMrmmToInrtFirF="" fracMicrToInrtFirF="" fracMnamNToAtmsFirF="" fracSAmmNToAtmsFirF="" fracSNtrNToAtmsFirF="" fracDAmmNToAtmsFirF="" fracDNtrNToAtmsFirF="" yrsStemRegrowFirF="20" yrsBranRegrowFirF="20" yrsBarkRegrowFirF="20" yrsLeafRegrowFirF="20" yrsCortRegrowFirF="20" yrsFirtRegrowFirF="20" fracSDdwdToAtmsFirF="0.28" fracSChwdToAtmsFirF="0.28" fracSBlitToAtmsFirF="0.28" fracSLlitToAtmsFirF="0.76" fracSDdwdToDebrFirF="0.03" fracSChwdToDebrFirF="0.03" fracSBlitToDebrFirF="0.03" fracSLlitToDebrFirF="0.08" useBioAgeAdjFirF="false" fixFirF="" phaFirF=""/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.fireDate)}</dateEV>
    </Event>`;
  }
  return `<Event tEV="FirF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1" aqEnYrEV="2100" nmEV="Wildfire - trees not killed" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="65a944a2-4206-45fa-b87f-8e65144d527c" nmRegime="New Regime">
      <notesEV/>
      <FirF fracAfctFirF="${event.percentBurned / 100}" fracStemToAtmsFirF="0.05" fracBranToAtmsFirF="0.1" fracBarkToAtmsFirF="0.08" fracLeafToAtmsFirF="0.8" fracCortToAtmsFirF="0" fracFirtToAtmsFirF="0" fracStemToDdwdFirF="0" fracBranToDdwdFirF="0" fracBarkToBlitFirF="0" fracLeafToLlitFirF="0.2" fracCortToCodrFirF="0.05" fracFirtToFidrFirF="0" fracStemToSDdwdFirF="0" fracBranToSChwdFirF="0" fracBarkToSBlitFirF="0" fracLeafToSLlitFirF="0" fracCortToSCodrFirF="0" fracFirtToSFidrFirF="0" fracDDdwdToAtmsFirF="0.25" fracRDdwdToAtmsFirF="0.25" fracDChwdToAtmsFirF="0" fracRChwdToAtmsFirF="0" fracDBlitToAtmsFirF="1" fracRBlitToAtmsFirF="1" fracDLlitToAtmsFirF="1" fracRLlitToAtmsFirF="1" fracDCodrToAtmsFirF="0.2" fracRCodrToAtmsFirF="0.2" fracDFidrToAtmsFirF="0" fracRFidrToAtmsFirF="0" fracDDdwdToInrtFirF="0" fracRDdwdToInrtFirF="0" fracDChwdToInrtFirF="0" fracRChwdToInrtFirF="0" fracDBlitToInrtFirF="0" fracRBlitToInrtFirF="0" fracDLlitToInrtFirF="0" fracRLlitToInrtFirF="0" fracDCodrToInrtFirF="0" fracRCodrToInrtFirF="0" fracDFidrToInrtFirF="0" fracRFidrToInrtFirF="0" fracSopmToAtmsFirF="" fracLrpmToAtmsFirF="" fracMrpmToAtmsFirF="" fracSommToAtmsFirF="" fracLrmmToAtmsFirF="" fracMrmmToAtmsFirF="" fracMicrToAtmsFirF="" fracSopmToInrtFirF="" fracLrpmToInrtFirF="" fracMrpmToInrtFirF="" fracSommToInrtFirF="" fracLrmmToInrtFirF="" fracMrmmToInrtFirF="" fracMicrToInrtFirF="" fracMnamNToAtmsFirF="" fracSAmmNToAtmsFirF="" fracSNtrNToAtmsFirF="" fracDAmmNToAtmsFirF="" fracDNtrNToAtmsFirF="" yrsStemRegrowFirF="20" yrsBranRegrowFirF="20" yrsBarkRegrowFirF="20" yrsLeafRegrowFirF="20" yrsCortRegrowFirF="20" yrsFirtRegrowFirF="0.0" fracSDdwdToAtmsFirF="0.28" fracSChwdToAtmsFirF="0.28" fracSBlitToAtmsFirF="0.28" fracSLlitToAtmsFirF="0.76" fracSDdwdToDebrFirF="0.03" fracSChwdToDebrFirF="0.03" fracSBlitToDebrFirF="0.03" fracSLlitToDebrFirF="0.08" useBioAgeAdjFirF="false" fixFirF="" phaFirF=""/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.fireDate)}</dateEV>
    </Event>`;
}

function generatePrescribedBurnEvent(
  event: FullCAMPrescribedBurnEventTransformed,
): string {
  return `<Event tEV="FirF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1" aqEnYrEV="2100" nmEV="Forest Fire 51-61 &amp; 64-70_ACT-Prescribed" categoryEV="CatUndef" tEvent="Doc" idSP="1" regimeInstance="45923b30-8a7c-455d-ba12-51910fa109da" nmRegime="New Regime">
      <notesEV/>
      <FirF fracAfctFirF="${event.percentBurned / 100}" fracStemToAtmsFirF="0.045" fracBranToAtmsFirF="0.045" fracBarkToAtmsFirF="0.045" fracLeafToAtmsFirF="0.025" fracCortToAtmsFirF="0" fracFirtToAtmsFirF="0" fracStemToDdwdFirF="0" fracBranToDdwdFirF="0" fracBarkToBlitFirF="0" fracLeafToLlitFirF="0" fracCortToCodrFirF="0" fracFirtToFidrFirF="0" fracStemToSDdwdFirF="0.005" fracBranToSChwdFirF="0.005" fracBarkToSBlitFirF="0.005" fracLeafToSLlitFirF="0.005" fracCortToSCodrFirF="0" fracFirtToSFidrFirF="0" fracDDdwdToAtmsFirF="0.18" fracRDdwdToAtmsFirF="0.18" fracDChwdToAtmsFirF="0.18" fracRChwdToAtmsFirF="0.18" fracDBlitToAtmsFirF="0.25" fracRBlitToAtmsFirF="0.25" fracDLlitToAtmsFirF="0.55" fracRLlitToAtmsFirF="0.55" fracDCodrToAtmsFirF="0" fracRCodrToAtmsFirF="0" fracDFidrToAtmsFirF="0" fracRFidrToAtmsFirF="0" fracDDdwdToInrtFirF="0" fracRDdwdToInrtFirF="0" fracDChwdToInrtFirF="0" fracRChwdToInrtFirF="0" fracDBlitToInrtFirF="0" fracRBlitToInrtFirF="0" fracDLlitToInrtFirF="0" fracRLlitToInrtFirF="0" fracDCodrToInrtFirF="0" fracRCodrToInrtFirF="0" fracDFidrToInrtFirF="0" fracRFidrToInrtFirF="0" fracSopmToAtmsFirF="" fracLrpmToAtmsFirF="" fracMrpmToAtmsFirF="" fracSommToAtmsFirF="" fracLrmmToAtmsFirF="" fracMrmmToAtmsFirF="" fracMicrToAtmsFirF="" fracSopmToInrtFirF="" fracLrpmToInrtFirF="" fracMrpmToInrtFirF="" fracSommToInrtFirF="" fracLrmmToInrtFirF="" fracMrmmToInrtFirF="" fracMicrToInrtFirF="" fracMnamNToAtmsFirF="" fracSAmmNToAtmsFirF="" fracSNtrNToAtmsFirF="" fracDAmmNToAtmsFirF="" fracDNtrNToAtmsFirF="" yrsStemRegrowFirF="2.0" yrsBranRegrowFirF="2.0" yrsBarkRegrowFirF="2.0" yrsLeafRegrowFirF="0.5" yrsCortRegrowFirF="0.0" yrsFirtRegrowFirF="0.0" fracSDdwdToAtmsFirF="0.12" fracSChwdToAtmsFirF="0.12" fracSBlitToAtmsFirF="0.12" fracSLlitToAtmsFirF="0.63" fracSDdwdToDebrFirF="0.02" fracSChwdToDebrFirF="0.02" fracSBlitToDebrFirF="0.02" fracSLlitToDebrFirF="0.07" useBioAgeAdjFirF="false" fixFirF="" phaFirF=""/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.fireDate)}</dateEV>
    </Event>`;
}

const eventQHeader = `<HeaderState sortIx="0" sortUp="true" sortBy1="false" sortBy2="false" showOnlyHS="false">
  <headSectW>80,270,785,270,270,0</headSectW>
</HeaderState>
<showEvT>t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,f</showEvT>`;

function eventsWithClearing(input: FullCAMClearableAreaInputTransformed) {
  return input.clearingEvent
    ? [generateClearingEvent(input, input.clearingEvent)]
    : [];
}

export function generateEventQ(input: FullCAMAreaInputTransformed) {
  const { plantingEvents, wildfireEvents, prescribedBurnEvents } = input;

  const clearingEvents = isAreaClearable(input)
    ? eventsWithClearing(input)
    : [];

  const eventSnippets = plantingEvents
    .map(generatePlantingEvent)
    .concat(wildfireEvents.map(generateWildfireEvent))
    .concat(prescribedBurnEvents.map(generatePrescribedBurnEvent))
    .concat(clearingEvents);

  const eventQ = `<EventQ count="${eventSnippets.length}">
      ${eventSnippets.join('\n')}
      ${eventQHeader}
    </EventQ>`;

  return eventQ;
}
