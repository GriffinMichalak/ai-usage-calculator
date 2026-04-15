import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { EmissionsBenchmarkRow } from './types'

function formatNum(n: number, maxFractionDigits = 3) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits })
}

function formatPlainRange(min: number, max: number, unit: string) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return '—'
  const a = formatNum(min)
  const b = formatNum(max)
  return `${a}–${b} ${unit}`
}

function lengthLabel(length: string): string {
  if (length === 'Short') return 'a shorter question'
  if (length === 'Medium') return 'a medium-length question'
  if (length === 'Long') return 'a longer question'
  return length.toLowerCase()
}

function ResultsPanel({ row }: { row: EmissionsBenchmarkRow }) {
  const minE = row['Mean Min Energy (Wh)']
  const maxE = row['Mean Max Energy (Wh)']
  const minC = row['Mean Min Carbon (gCO2e)']
  const maxC = row['Mean Max Carbon (gCO2e)']
  const minW = row['Mean Min Water (Site, mL)']
  const maxW = row['Mean Max Water (Site, mL)']

  const perPrompt = [
    {
      label: 'Energy (min–max)',
      unit: 'Wh',
      min: minE,
      max: maxE,
    },
    {
      label: 'Carbon (min–max)',
      unit: 'gCO₂e',
      min: minC,
      max: maxC,
    },
    {
      label: 'Water, data-center site (min–max)',
      unit: 'mL',
      min: minW,
      max: maxW,
    },
    {
      label: 'Water, full upstream (min–max)',
      unit: 'mL',
      min: row['Mean Min Water (Source, mL)'],
      max: row['Mean Max Water (Source, mL)'],
    },
  ]

  const scaleRaw = [
    {
      label: 'Energy',
      value: row['Energy Consumption of 1 Billion Prompts (MWh)'],
      unit: 'MWh',
    },
    {
      label: 'Carbon',
      value: row['Carbon Emissions of 1 Billion Prompts (TonsCO2e)'],
      unit: 'metric tons CO₂e',
    },
    {
      label: 'Water (site)',
      value: row['Water Consumption of 1 Billion Prompts (Kiloliter)'],
      unit: 'kL',
    },
  ]

  const householdMwh = row['Household Energy Equiv. – 1B Prompts (MWh)']
  const drinkingKl = row['People Annual Drinking Water Equiv. – 1B Prompts (kL)']
  const carTons = row['Gasoline Car Equiv. – 1B Prompts (TonsCO2e)']
  const flightTons = row['Atlantic Flight Equiv. – 1B Prompts (TonsCO2e)']

  /** Ballpark only: ~10.5 MWh electricity per home per year (varies by country and home). */
  const homesApprox = householdMwh / 10.5
  /** Ballpark: ~1,500 L drinking water per person per year (illustration). */
  const peopleDrinkingApprox = (drinkingKl * 1000) / 1500
  /** Ballpark: ~4.6 t CO₂e per car per year (illustration). */
  const carYearsApprox = carTons / 4.6
  /** Ballpark: ~1 t CO₂e per long transatlantic flight per passenger (varies widely). */
  const flightsApprox = flightTons / 1

  const scaleAnalogies = [
    {
      title: 'Household electricity',
      body: `The dataset’s “household energy” yardstick is **${formatNum(householdMwh)} MWh**. As a **very rough** picture, that’s on the order of **${formatNum(homesApprox, 0)}** typical homes’ electricity for a year (assuming ~10.5 MWh per home).`,
    },
    {
      title: 'Drinking water',
      body: `The “people’s drinking water” yardstick is **${formatNum(drinkingKl, 0)} m³** (about **${formatNum((drinkingKl * 1000) / 1e6, 2)} million liters**). Very roughly, that’s **${formatNum(peopleDrinkingApprox, 0)}** people’s drinking water for a year (assuming ~1,500 L per person).`,
    },
    {
      title: 'Car travel',
      body: `The “gasoline car” yardstick is **${formatNum(carTons)}** metric tons CO₂e. Very roughly, that’s on the order of **${formatNum(carYearsApprox, 0)}** car-years of emissions (assuming ~4.6 tons per car per year).`,
    },
    {
      title: 'Long flights',
      body: `The “Atlantic flight” yardstick is **${formatNum(flightTons)}** metric tons CO₂e. Very roughly, that’s on the order of **${formatNum(flightsApprox, 0)}** long flights per passenger (assuming ~1 ton CO₂e per flight; real flights vary a lot).`,
    },
  ]

  return (
    <Stack spacing={3} sx={{ textAlign: 'left', mt: 1 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 600 }}>
          Your estimate
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mt: 0.5, fontWeight: 600 }}>
          {row.Model}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
          For <strong>{lengthLabel(row.length)}</strong> in the benchmark data (about{' '}
          <strong>{row['Query Length'].toLocaleString()} tokens</strong> — a rough size measure for the
          prompt). One reply uses a small amount of power, water, and emissions; the cards below spell that
          out in everyday units.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Card
          variant="outlined"
          sx={{
            flex: '1 1 200px',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Electricity for one reply
            </Typography>
            <Typography variant="h4" component="p" sx={{ mt: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
              {formatPlainRange(minE, maxE, 'Wh')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Watt-hours measure how much energy was used. For context, a single prompt here is far less
              than running a microwave for a minute.
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            flex: '1 1 200px',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Climate footprint (one reply)
            </Typography>
            <Typography variant="h4" component="p" sx={{ mt: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
              {formatPlainRange(minC, maxC, 'g CO₂e')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              CO₂e (“carbon dioxide equivalent”) bundles different greenhouse gases into one number. A few
              grams is a very small amount — think in the same general range as many quick online tasks.
            </Typography>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          sx={{
            flex: '1 1 200px',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Water at the data center (one reply)
            </Typography>
            <Typography variant="h4" component="p" sx={{ mt: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
              {formatPlainRange(minW, maxW, 'mL')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Milliliters of water used on-site for cooling and related operations — typically a few drops to
              a sip’s worth for a single prompt.
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
        These figures come from a published benchmark for this model and setup. Your real chats can be higher
        or lower depending on length, how busy the service is, and where it runs.
      </Typography>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          A “what if” at huge scale
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
          It helps to picture scale. The comparisons below are <strong>not</strong> predictions — they only
          ask: “If this exact benchmark applied to <strong>one billion</strong> similar prompts, what familiar
          things would that be roughly like?”
        </Typography>
        <Stack spacing={1.5}>
          {scaleAnalogies.map((item) => (
            <Card
              key={item.title}
              variant="outlined"
              sx={{ borderColor: 'divider', bgcolor: 'action.hover', boxShadow: 'none' }}
            >
              <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {item.body.split('**').map((chunk, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>
                        {chunk}
                      </strong>
                    ) : (
                      <span key={i}>{chunk}</span>
                    ),
                  )}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Accordion
        disableGutters
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          overflow: 'hidden',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="technical-details" id="technical-details-header">
          <Typography sx={{ fontWeight: 600 }}>Technical details</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
            Raw ranges, infrastructure, and 1B-prompt totals
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            For analysts and anyone who wants the numbers behind the summary.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Per prompt (single query)
          </Typography>
          <Stack spacing={0.75} sx={{ mb: 2 }}>
            {perPrompt.map((m) => (
              <Typography key={m.label} variant="body2" component="div">
                <strong>{m.label}:</strong> {formatNum(m.min)}–{formatNum(m.max)} {m.unit}
              </Typography>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            At 1 billion prompts (same benchmark)
          </Typography>
          <Stack spacing={0.75} sx={{ mb: 2 }}>
            {scaleRaw.map((s) => (
              <Typography key={s.label} variant="body2" component="div">
                <strong>{s.label}:</strong> {formatNum(s.value)} {s.unit}
              </Typography>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Infrastructure (from dataset)
          </Typography>
          <Stack spacing={0.75}>
            <Typography variant="body2">
              <strong>Hardware:</strong> {row.Hardware}
            </Typography>
            <Typography variant="body2">
              <strong>Host / cloud:</strong> {row.Host}
            </Typography>
            <Typography variant="body2">
              <strong>Model tier in data:</strong> {row.Size}
            </Typography>
            <Typography variant="body2">
              <strong>PUE:</strong> {formatNum(row.PUE)}{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                (power usage effectiveness — data-center overhead)
              </Typography>
            </Typography>
            <Typography variant="body2">
              <strong>WUE (site):</strong> {formatNum(row['WUE (Site)'])} L/kWh{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                (site water per kWh)
              </Typography>
            </Typography>
            <Typography variant="body2">
              <strong>WUE (source):</strong> {formatNum(row['WUE (Source)'])} L/kWh{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                (includes upstream water)
              </Typography>
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}

export default ResultsPanel
