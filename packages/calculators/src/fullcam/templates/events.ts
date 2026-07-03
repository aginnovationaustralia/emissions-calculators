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

function generatePlantingEvent(event: FullCAMPlantingEventTransformed): string {
  const plantingName = escapeXmlAttribute(
    `Establish ${event.speciesName} - block geometry - ${fullCAMDate(event.plantingDate)}`,
  );
  switch (event.speciesName) {
    case 'Environmental plantings':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1990" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Environmental plantings']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.3" stemVolPlnF="" stemMPlnF="0.087" branMPlnF="0.059" barkMPlnF="0.026" leafMPlnF="0.039" cortMPlnF="0.074" firtMPlnF="0.014" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="BlockES" treeNmPlnF="Environmental plantings"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Mallee eucalypt species':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1990" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Mallee eucalypt species']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.3" stemVolPlnF="" stemMPlnF="0.072" branMPlnF="0.049" barkMPlnF="0.012" leafMPlnF="0.034" cortMPlnF="0.109" firtMPlnF="0.024" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="BlockES" treeNmPlnF="Mallee eucalypt species"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration <500mm rainfall':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="PlantTreesNat" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Native Species Regeneration <500mm rainfall']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.0" stemVolPlnF="" stemMPlnF="0.0" branMPlnF="0.0" barkMPlnF="0.0" leafMPlnF="0.0" cortMPlnF="0.0" firtMPlnF="0.0" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="BlockLMG" treeNmPlnF="Native Species Regeneration &lt;500mm rainfall"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration >=500mm rainfall':
      return `<Event tEV="PlnF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="PlantTreesNat" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="${plantingName}" categoryEV="CatUndef" tEvent="Doc" idSP="${treeSpeciesIdMap['Native Species Regeneration >=500mm rainfall']}" regimeInstance="fd726ee9-d483-4506-b5f9-c78fb7c52055" nmRegime="New Regime">
      <notesEV/>
      <PlnF tStemPlnF="Mass" agePlnF="0.0" stemVolPlnF="" stemMPlnF="0.0" branMPlnF="0.0" barkMPlnF="0.0" leafMPlnF="0.0" cortMPlnF="0.0" firtMPlnF="0.0" stemNCRatioPlnF="" branNCRatioPlnF="" barkNCRatioPlnF="" leafNCRatioPlnF="" cortNCRatioPlnF="" firtNCRatioPlnF="" storNMPlnF="" fixPlnF="" phaPlnF="" tTYFCat="BlockLMG" treeNmPlnF="Native Species Regeneration >=500mm rainfall"/>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.plantingDate)}</dateEV>
    </Event>`;
  }
}

function generateClearingEvent(
  input: FullCAMClearableAreaInputTransformed,
  event: FullCAMClearingEventTransformed,
): string {
  switch (input.initialTrees.speciesName) {
    case 'Environmental plantings':
      return `    <Event tEV="Thin" clearEV="true" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrNoProd" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="73c3f21c-6326-487d-9826-d6e6725a18bf" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${event.percentThinned / 100}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Environmental plantings" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="1" fracStemToFuelThin="0" fracStemToPaprThin="0" fracStemToPackThin="0" fracStemToFurnThin="0" fracStemToFibrThin="0" fracStemToConsThin="0" fracStemToResiThin="0" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Mallee eucalypt species':
      return `    <Event tEV="Thin" clearEV="true" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrNoProd" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="8171b217-31ef-49d7-a263-3c40a3c3c38e" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${event.percentThinned / 100}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Mallee eucalypt species" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="1" fracStemToFuelThin="0" fracStemToPaprThin="0" fracStemToPackThin="0" fracStemToFurnThin="0" fracStemToFibrThin="0" fracStemToConsThin="0" fracStemToResiThin="0" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration <500mm rainfall':
      return `    <Event tEV="Thin" clearEV="true" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrNoProd" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="2" regimeInstance="628071e5-fdc3-44d3-9f2e-f9e2119edfde" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${event.percentThinned / 100}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Native Species Regeneration &lt;500mm rainfall" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="1" fracStemToFuelThin="0" fracStemToPaprThin="0" fracStemToPackThin="0" fracStemToFurnThin="0" fracStemToFibrThin="0" fracStemToConsThin="0" fracStemToResiThin="0" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
    case 'Native Species Regeneration >=500mm rainfall':
      return `<Event tEV="Thin" clearEV="true" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="InitClrNoProd" tAaqEV="Blank" aqStYrEV="1800" aqEnYrEV="2100" nmEV="Thin (clearing)" categoryEV="CatUndef" tEvent="Doc" idSP="1" regimeInstance="88552154-b94d-489b-96df-b909cf64ef23" nmRegime="New Regime">
      <notesEV/>
      <Thin fracAfctThin="${event.percentThinned / 100}" userThisThinByLG="false" clearAllRemainsF="false" fracStemToDdwdExtraF="" fracBranToDdwdExtraF="" fracBarkToBlitExtraF="" fracLeafToLlitExtraF="" fracCortToCodrExtraF="" fracFirtToFidrExtraF="" replaceStemsThin="false" useBioAgeAdjThin="false" remvAvgAgeMultThin="1.0" remvMaxAgeMultThin="0.0" remvOffsetThin="0.0" multStemThin="1.0" multBranThin="1.0" multBarkThin="1.0" multLeafThin="1.0" multFirtThin="1.0" multCortThin="1.0" boostYrsThin="0.0" fixThin="" phaThin="" treeNmThin="Native species and revegetation >=500mm rainfall" yrsStemRegrowThin="0.0" yrsBarkRegrowThin="0.0" yrsBranRegrowThin="0.0" yrsLeafRegrowThin="0.0" yrsCortRegrowThin="0.0" yrsFirtRegrowThin="0.0">
        <fracGradeThin>,,,,</fracGradeThin>
        <ThinDest id="dest" fracStemToDdwdThin="1" fracStemToFuelThin="0" fracStemToPaprThin="0" fracStemToPackThin="0" fracStemToFurnThin="0" fracStemToFibrThin="0" fracStemToConsThin="0" fracStemToResiThin="0" fracStemToSDdwdThin="0" fracBranToDdwdThin="1" fracBranToFuelThin="0" fracBranToPaprThin="0" fracBranToPackThin="0" fracBranToFurnThin="0" fracBranToFibrThin="0" fracBranToConsThin="0" fracBranToResiThin="0" fracBranToSDdwdThin="0" fracBarkToBlitThin="1" fracBarkToFuelThin="0" fracBarkToPaprThin="0" fracBarkToResiThin="0" fracBarkToSBlitThin="0" fracLeafToLlitThin="1" fracLeafToFuelThin="0" fracLeafToSLlitThin="0" fracCortToCodrThin="1" fracCortToFuelThin="0" fracCortToSCodrThin="0" fracFirtToFidrThin="1" fracFirtToSFidrThin="0" fracDdwdToFuelThin="0" fracChwdToFuelThin="0" fracBlitToFuelThin="0" fracLlitToFuelThin="0" fracSDdwdToFuelThin="0" fracSChwdToFuelThin="0" fracSBlitToFuelThin="0" fracSLlitToFuelThin="0"/>
      </Thin>
      <dateEV CalendarSystemT="FixedLength">${fullCAMDate(event.clearingDate)}</dateEV>
    </Event>`;
  }
}

function generateWildfireEvent(event: FullCAMWildfireEventTransformed): string {
  return `<Event tEV="FirF" clearEV="false" onEV="true" dateOriginEV="Calendar" nYrsFromStEV="" nDaysFromStEV="" tFaqEV="Blank" tAaqEV="Blank" aqStYrEV="1" aqEnYrEV="2100" nmEV="Forest Fire 51-61 &amp; 64-70_ACT-Wildfire" categoryEV="CatUndef" tEvent="Doc" idSP="1" regimeInstance="093b2a36-07e0-4f1c-a2e3-da5158b882f8" nmRegime="New Regime">
      <notesEV/>
      <FirF fracAfctFirF="${event.percentBurned / 100}" fracStemToAtmsFirF="0.09" fracBranToAtmsFirF="0.09" fracBarkToAtmsFirF="0.09" fracLeafToAtmsFirF="0.05" fracCortToAtmsFirF="0" fracFirtToAtmsFirF="0" fracStemToDdwdFirF="0" fracBranToDdwdFirF="0" fracBarkToBlitFirF="0" fracLeafToLlitFirF="0" fracCortToCodrFirF="0" fracFirtToFidrFirF="0" fracStemToSDdwdFirF="0.01" fracBranToSChwdFirF="0.01" fracBarkToSBlitFirF="0.01" fracLeafToSLlitFirF="0.05" fracCortToSCodrFirF="0" fracFirtToSFidrFirF="0" fracDDdwdToAtmsFirF="0.55" fracRDdwdToAtmsFirF="0.55" fracDChwdToAtmsFirF="0.55" fracRChwdToAtmsFirF="0.55" fracDBlitToAtmsFirF="0.65" fracRBlitToAtmsFirF="0.65" fracDLlitToAtmsFirF="0.9" fracRLlitToAtmsFirF="0.9" fracDCodrToAtmsFirF="0" fracRCodrToAtmsFirF="0" fracDFidrToAtmsFirF="0" fracRFidrToAtmsFirF="0" fracDDdwdToInrtFirF="0" fracRDdwdToInrtFirF="0" fracDChwdToInrtFirF="0" fracRChwdToInrtFirF="0" fracDBlitToInrtFirF="0" fracRBlitToInrtFirF="0" fracDLlitToInrtFirF="0" fracRLlitToInrtFirF="0" fracDCodrToInrtFirF="0" fracRCodrToInrtFirF="0" fracDFidrToInrtFirF="0" fracRFidrToInrtFirF="0" fracSopmToAtmsFirF="" fracLrpmToAtmsFirF="" fracMrpmToAtmsFirF="" fracSommToAtmsFirF="" fracLrmmToAtmsFirF="" fracMrmmToAtmsFirF="" fracMicrToAtmsFirF="" fracSopmToInrtFirF="" fracLrpmToInrtFirF="" fracMrpmToInrtFirF="" fracSommToInrtFirF="" fracLrmmToInrtFirF="" fracMrmmToInrtFirF="" fracMicrToInrtFirF="" fracMnamNToAtmsFirF="" fracSAmmNToAtmsFirF="" fracSNtrNToAtmsFirF="" fracDAmmNToAtmsFirF="" fracDNtrNToAtmsFirF="" yrsStemRegrowFirF="60.0" yrsBranRegrowFirF="60.0" yrsBarkRegrowFirF="60.0" yrsLeafRegrowFirF="15.0" yrsCortRegrowFirF="0.0" yrsFirtRegrowFirF="0.0" fracSDdwdToAtmsFirF="0.28" fracSChwdToAtmsFirF="0.28" fracSBlitToAtmsFirF="0.28" fracSLlitToAtmsFirF="0.76" fracSDdwdToDebrFirF="0.03" fracSChwdToDebrFirF="0.03" fracSBlitToDebrFirF="0.03" fracSLlitToDebrFirF="0.08" useBioAgeAdjFirF="false" fixFirF="" phaFirF=""/>
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
  return (
    input.clearingEvents?.map((c) => generateClearingEvent(input, c)) ?? []
  );
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
