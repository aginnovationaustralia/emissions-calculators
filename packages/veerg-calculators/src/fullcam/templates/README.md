# Templates for FullCAM plot file generation

## Output terms to request

We want specific columns to be returned in generated CSV files, to make sure we can read the values we require

| Column name                         | FullCAM UI output                                      | OutWinSet xml value  |
| ----------------------------------- | ------------------------------------------------------ | -------------------- |
| "CH4 emitted due to fire (tCH4/ha)" | Carbon - whole - emissions - CH4 emitted due to fire   | flowCH4MSiteAtmsFire |
| "C mass of trees (tC/ha)"           | Carbon - forest - plants - C mass of trees             | treeCM               |
| "C mass of forest products (tC/ha)" | Carbon - forest - products - C mass of forest products | prodCMF              |
| "N2O emitted due to fire (tN2O/ha)" | Nitrogen - whole emissions - N2O emitted due to fire   | flowN2OMSiteAtmsFire |
| "C mass of forest debris (tC/ha)"   | Other - Carbon projects - C mass of forest debris      | cpdebrCMF            |
