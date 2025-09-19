import { BuildConstantsDocs } from "./build-docs";

const enumLookups: Record<string, Record<string, string>> = {
    'STATES': {
        NSW: 'nsw',
        VIC: 'vic',
        QLD: 'qld',
        SA: 'sa',
        WA_NW: 'wa_nw',
        WA_SW: 'wa_sw',
        TAS: 'tas',
        NT: 'nt',
        ACT: 'act',
    },
    'REGIONS': {
        SOUTHWEST: 'southwest',
        PILBARA: 'pilbara',
        KIMBERLEY: 'kmberley',
    },
    'LIVESTOCK_SOURCE_LOCATION': {
        'Dairy origin': 'dairy origin',
        'nth/sth/central QLD': 'nth/sth/central QLD',
        'nth/sth NSW/VIC/sth SA': 'nth/sth NSW/VIC/sth SA',
        'NSW/SA pastoral zone': 'NSW/SA pastoral zone',
        'sw WA': 'sw WA',
        'WA pastoral': 'WA pastoral',
    },
    'FluidWasteTreatmentType': {
        'Anaerobic lagoon': 'anaerobic lagoon',
        'Solid storage': 'solid storage',
        'Composting': 'composting',
        'Uncovered anaerobic lagoon': 'uncovered anaerobic lagoon',
    },
    AquacultureBait: {
        SARDINES: 'Whole Sardines',
        LOW_ANIMAL_PROTEIN: 'Low Animal Protein Formulated Feed',
        HIGH_ANIMAL_PROTEIN: 'High Animal Protein Formulated Feed',
        CEREAL: 'Cereal Grain',
        SQUID: 'Squid',
        FISH: 'Whole Fish',
    },
    FreightTypes: {
        TRUCK: 'Truck',
        RAIL: 'Rail',
        LONG_HAUL_FLIGHT: 'Long haul flight',
        MEDIUM_HAUL_FLIGHT: 'Medium haul flight',
        SMALL_CONTAINER_SHIP: 'Small container ship',
        LARGE_CONTAINER_SHIP: 'Large container ship',
    }
}

const buildConstantsDocsFor300 = async () => {
     return new BuildConstantsDocs('src/versions/3.0.0', enumLookups).buildConstantsDocs();
}

export { buildConstantsDocsFor300 };
