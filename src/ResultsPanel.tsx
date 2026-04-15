import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { EmissionsBenchmarkRow } from './types'

function formatNum(n: number, maxFractionDigits = 3) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits })
}

function ResultsPanel({ row }: { row: EmissionsBenchmarkRow }) {
  const perPrompt = [
    {
      label: 'Energy (min–max)',
      unit: 'Wh',
      min: row['Mean Min Energy (Wh)'],
      max: row['Mean Max Energy (Wh)'],
    },
    {
      label: 'Carbon (min–max)',
      unit: 'gCO₂e',
      min: row['Mean Min Carbon (gCO2e)'],
      max: row['Mean Max Carbon (gCO2e)'],
    },
    {
      label: 'Water, site (min–max)',
      unit: 'mL',
      min: row['Mean Min Water (Site, mL)'],
      max: row['Mean Max Water (Site, mL)'],
    },
  ]

  const scale = [
    {
      label: 'Energy @ 1B prompts',
      value: row['Energy Consumption of 1 Billion Prompts (MWh)'],
      unit: 'MWh',
    },
    {
      label: 'Carbon @ 1B prompts',
      value: row['Carbon Emissions of 1 Billion Prompts (TonsCO2e)'],
      unit: 't CO₂e',
    },
    {
      label: 'Water @ 1B prompts',
      value: row['Water Consumption of 1 Billion Prompts (Kiloliter)'],
      unit: 'kL',
    },
  ]

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'left' }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
        Benchmark match
      </Typography>
      <Box sx={{ mt: 0.5, mb: 2 }}>
        <Typography variant="h6" component="h2">
          {row.Model}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {row.length} prompt · {row['Query Length']} tokens
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} useFlexGap sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Hardware: <strong style={{ color: 'inherit' }}>{row.Hardware}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Host: <strong style={{ color: 'inherit' }}>{row.Host}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Model tier (data): <strong style={{ color: 'inherit' }}>{row.Size}</strong>
        </Typography>
      </Stack>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Per prompt (single query)
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {perPrompt.map((m) => (
          <Typography key={m.label} variant="body2">
            {m.label}: {formatNum(m.min)}–{formatNum(m.max)} {m.unit}
          </Typography>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        At 1 billion prompts (scale)
      </Typography>
      <Stack spacing={1}>
        {scale.map((s) => (
          <Typography key={s.label} variant="body2">
            {s.label}: {formatNum(s.value)} {s.unit}
          </Typography>
        ))}
      </Stack>
    </Paper>
  )
}

export default ResultsPanel
