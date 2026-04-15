export type ModelSize = 'short' | 'medium' | 'long' | null

/** Row shape from `data/data.json` (fields omitted are still present at runtime). */
export type EmissionsBenchmarkRow = {
  Model: string
  length: string
  'Query Length': number
  Hardware: string
  Host: string
  PUE: number
  'WUE (Site)': number
  'WUE (Source)': number
  Size: string
  'Mean Max Energy (Wh)': number
  'Mean Min Energy (Wh)': number
  'Mean Max Carbon (gCO2e)': number
  'Mean Min Carbon (gCO2e)': number
  'Mean Max Water (Site, mL)': number
  'Mean Min Water (Site, mL)': number
  'Mean Max Water (Source, mL)': number
  'Mean Min Water (Source, mL)': number
  'Energy Consumption of 1 Billion Prompts (MWh)': number
  'Carbon Emissions of 1 Billion Prompts (TonsCO2e)': number
  'Water Consumption of 1 Billion Prompts (Kiloliter)': number
  'Household Energy Equiv. – 1B Prompts (MWh)': number
  'People Annual Drinking Water Equiv. – 1B Prompts (kL)': number
  'Gasoline Car Equiv. – 1B Prompts (TonsCO2e)': number
  'Atlantic Flight Equiv. – 1B Prompts (TonsCO2e)': number
}
