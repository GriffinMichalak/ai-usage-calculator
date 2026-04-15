import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import Box from '@mui/material/Box'
import Co2OutlinedIcon from '@mui/icons-material/Co2Outlined'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined'
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Link from '@mui/material/Link'
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import { alpha } from '@mui/material/styles'
import { useState, type ReactNode, type SyntheticEvent } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import type { EmissionsBenchmarkRow } from './types'

function formatNum(n: number, maxFractionDigits = 3) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits })
}

/** Rounded to nearest tenth for summary stats (1 decimal place max). */
function formatTenth(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const rounded = Math.round(n * 10) / 10
  return rounded.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
}

/** Keeps tiny EPA-equivalence values readable instead of showing as 0. */
function formatAdaptiveSmall(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 10) return formatNum(n, 1)
  if (abs >= 1) return formatNum(n, 2)
  if (abs >= 0.1) return formatNum(n, 3)
  if (abs >= 0.01) return formatNum(n, 4)
  return formatNum(n, 6)
}

function formatPlainRange(min: number, max: number, unit: string) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return '—'
  const a = formatTenth(min)
  const b = formatTenth(max)
  return `${a}–${b} ${unit}`
}

/**
 * Factors from the U.S. EPA Greenhouse Gas Equivalencies Calculator (national defaults, 2022 grid / vehicle
 * averages where applicable). Values are grams CO₂e implied per one unit of the activity.
 *
 * @see https://www.epa.gov/energy/ghg-equivalencies-calculator-calculations-and-references
 */
const EPA_G_CO2E_PER_MILE_GAS_CAR = 3.93e-4 * 1_000_000 // metric tons CO₂e/mile → g
const EPA_G_CO2E_PER_GALLON_GASOLINE = 8887
const EPA_G_CO2E_PER_SMARTPHONE_CHARGE = 1.24e-5 * 1_000_000 // g per charge
const EPA_G_CO2E_PER_LB_COAL = 9.0e-4 * 1_000_000 // g per lb power-sector coal
/** CO₂ sequestered by one average urban tree seedling per year (10-year avg, after planting). */
const EPA_G_CO2E_PER_TREE_SEEDLING_YEAR = 0.06 * 1_000_000

function epaDrivingLine(gCo2e: number): string {
  const miles = gCo2e / EPA_G_CO2E_PER_MILE_GAS_CAR
  if (!Number.isFinite(miles)) return '—'
  if (miles < 1) {
    const ft = miles * 5280
    return `${formatAdaptiveSmall(ft)} feet driven by the average gasoline-powered passenger vehicle`
  }
  return `${formatAdaptiveSmall(miles)} miles driven by the average gasoline-powered passenger vehicle`
}

function epaGasolineGallonsLine(gCo2e: number): string {
  const gal = gCo2e / EPA_G_CO2E_PER_GALLON_GASOLINE
  if (!Number.isFinite(gal)) return '—'
  if (gal < 1) {
    const cups = gal * 16
    return `${formatAdaptiveSmall(cups)} cups of gasoline consumed (CO₂ from combustion)`
  }
  return `${formatAdaptiveSmall(gal)} gallons of gasoline consumed (CO₂ from combustion)`
}

function epaSmartphonesLine(gCo2e: number): string {
  const n = gCo2e / EPA_G_CO2E_PER_SMARTPHONE_CHARGE
  if (!Number.isFinite(n)) return '—'
  return `${formatAdaptiveSmall(n)} smartphone charges (electricity at U.S. grid average)`
}

function epaCoalLine(gCo2e: number): string {
  const lb = gCo2e / EPA_G_CO2E_PER_LB_COAL
  if (!Number.isFinite(lb)) return '—'
  if (lb < 1) {
    const oz = lb * 16
    return `${formatAdaptiveSmall(oz)} oz of coal burned at power plants (typical U.S. factor)`
  }
  return `${formatAdaptiveSmall(lb)} pounds of coal burned at power plants (typical U.S. factor)`
}

function epaTreeLine(gCo2e: number): string {
  const treeYears = gCo2e / EPA_G_CO2E_PER_TREE_SEEDLING_YEAR
  if (!Number.isFinite(treeYears)) return '—'
  if (treeYears < 0.01) {
    return `${(treeYears * 100).toFixed(3)}% of one urban tree seedling year's average CO₂ uptake (EPA, ~60 kg CO₂/yr)`
  }
  return `${formatAdaptiveSmall(treeYears)} years of average CO₂ uptake for one urban tree seedling (EPA)`
}

function EpaEquivalencesCallout({ gCo2eMid }: { gCo2eMid: number }) {
  const rows: { id: string; Icon: SvgIconComponent; text: string }[] = [
    { id: 'miles', Icon: DirectionsCarOutlinedIcon, text: epaDrivingLine(gCo2eMid) },
    { id: 'gas', Icon: LocalGasStationOutlinedIcon, text: epaGasolineGallonsLine(gCo2eMid) },
    { id: 'phone', Icon: SmartphoneOutlinedIcon, text: epaSmartphonesLine(gCo2eMid) },
    { id: 'coal', Icon: LocalFireDepartmentOutlinedIcon, text: epaCoalLine(gCo2eMid) },
    { id: 'trees', Icon: ForestOutlinedIcon, text: epaTreeLine(gCo2eMid) },
  ]

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
        bgcolor: alpha(theme.palette.success.main, 0.06),
      })}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        EPA-style equivalents (climate footprint)
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}
      >
        Same order of magnitude of CO₂e as about the following — using the <strong>midpoint</strong>{' '}
        of your min–max ({formatTenth(gCo2eMid)} g CO₂e). Method matches the U.S. EPA{' '}
        <Link
          href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          Greenhouse Gas Equivalencies Calculator
        </Link>{' '}
        (
        <Link
          href="https://www.epa.gov/energy/ghg-equivalencies-calculator-calculations-and-references"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          calculations & references
        </Link>
        ).
      </Typography>
      <Stack spacing={1.25}>
        {rows.map(({ id, Icon, text }) => (
          <Stack
            key={id}
            direction="row"
            spacing={1.25}
            useFlexGap
            sx={{ alignItems: 'flex-start' }}
          >
            <Icon
              sx={{ fontSize: 20, color: 'success.main', flexShrink: 0, mt: 0.15 }}
              aria-hidden
            />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              {text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function lengthLabel(length: string): string {
  if (length === 'Short') return 'a shorter question'
  if (length === 'Medium') return 'a medium-length question'
  if (length === 'Long') return 'a longer question'
  return length.toLowerCase()
}

type PaletteTint = 'primary' | 'secondary' | 'info' | 'warning' | 'success'

function OneReplyStatCard({
  icon: Icon,
  tint,
  label,
  value,
  children,
}: {
  icon: SvgIconComponent
  tint: PaletteTint
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: '1 1 240px',
        borderColor: 'divider',
        bgcolor: (theme) => alpha(theme.palette[tint].main, 0.06),
        boxShadow: 'none',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2.5 },
        }}
      >
        <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center' }}>
          <Box
            sx={(theme) => ({
              width: 52,
              height: 52,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              bgcolor: alpha(theme.palette[tint].main, 0.18),
              color: theme.palette[tint].main,
            })}
          >
            <Icon sx={{ fontSize: 28 }} aria-hidden />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            component="p"
            sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', m: 0 }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mt: 2.25,
            mb: 0,
            pl: 0,
            ml: 0,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.25, pl: 0, ml: 0, lineHeight: 1.55 }}
        >
          {children}
        </Typography>
      </CardContent>
    </Card>
  )
}

function ScaleStoryCard({
  icon: Icon,
  tint,
  title,
  headline,
  detail,
}: {
  icon: SvgIconComponent
  tint: PaletteTint
  title: string
  headline: string
  detail: string
}) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderColor: 'divider',
        bgcolor: alpha(theme.palette[tint].main, 0.05),
        boxShadow: 'none',
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: theme.palette[tint].main,
      })}
    >
      <CardContent
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          py: 2,
          px: 2.5,
          '&:last-child': { pb: 2 },
        }}
      >
        <Box
          sx={(theme) => ({
            width: 44,
            height: 44,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(theme.palette[tint].main, 0.18),
            color: theme.palette[tint].main,
          })}
        >
          <Icon sx={{ fontSize: 24 }} aria-hidden />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.75, fontWeight: 600, lineHeight: 1.45 }}>
            {headline}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.55 }}>
            {detail}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

function ResultsPanel({ row }: { row: EmissionsBenchmarkRow }) {
  const [activeTab, setActiveTab] = useState(0)
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

  const scaleStories = [
    {
      icon: HomeOutlinedIcon,
      tint: 'warning' as const,
      title: 'Household electricity',
      headline: `About ${formatNum(homesApprox, 0)} typical homes' electricity for a year`,
      detail: `The benchmark's "household energy" yardstick is ${formatNum(householdMwh)} MWh. That uses ~10.5 MWh per home per year as an estimate, though real usage varies.`,
    },
    {
      icon: WaterDropOutlinedIcon,
      tint: 'info' as const,
      title: 'Drinking water',
      headline: `About ${formatNum(peopleDrinkingApprox, 0)} people's drinking water for a year`,
      detail: `The yardstick is ${formatNum(drinkingKl, 0)} thousand m³ (~${formatNum((drinkingKl * 1000) / 1e6, 2)} million liters), using ~1,500 L per person per year as a rough guide.`,
    },
    {
      icon: DirectionsCarOutlinedIcon,
      tint: 'secondary' as const,
      title: 'Car emissions',
      headline: `On the order of ${formatNum(carYearsApprox, 0)} car-years of CO₂`,
      detail: `The "gasoline car" yardstick is ${formatNum(carTons)} metric tons CO₂e, using ~4.6 tons per car per year as a rough comparison.`,
    },
    {
      icon: FlightTakeoffOutlinedIcon,
      tint: 'primary' as const,
      title: 'Long flights',
      headline: `On the order of ${formatNum(flightsApprox, 0)} long flights (one passenger each)`,
      detail: `The "Atlantic flight" yardstick is ${formatNum(flightTons)} metric tons CO₂e, using ~1 ton per long flight as a rough comparison.`,
    },
  ]

  const carbonMid = (minC + maxC) / 2
  const energyMid = (minE + maxE) / 2
  const waterMid = (minW + maxW) / 2

  const handleTabChange = (_event: SyntheticEvent, nextTab: number) => {
    setActiveTab(nextTab)
  }

  return (
    <Stack spacing={3} sx={{ textAlign: 'left', mt: 1 }}>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: '0.12em', fontWeight: 600, m: 0 }}
          >
            Your estimate
          </Typography>
          <Chip size="small" label="One AI reply" variant="outlined" sx={{ fontWeight: 600 }} />
        </Stack>
        <Typography variant="h5" component="h2" sx={{ mt: 0.5, fontWeight: 700 }}>
          {row.Model}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 600, lineHeight: 1.6 }}
        >
          Based on the <strong>"How Hungry is AI?"</strong> benchmark paper for{' '}
          <strong>{lengthLabel(row.length)}</strong>. The three cards below translate power, climate
          impact, and cooling water into everyday amounts — each for a single answer, not a whole
          conversation.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.75, display: 'block', maxWidth: 640 }}
        >
          Source:{' '}
          <Link
            href="https://arxiv.org/abs/2505.09598"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference
          </Link>
          .
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block', maxWidth: 560 }}
        >
          Technical note: the study sized prompts at about {row['Query Length'].toLocaleString()}{' '}
          tokens (a common measure of text length for models).
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label="Summary view" />
        <Tab label="Detailed report" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <OneReplyStatCard
              icon={BoltOutlinedIcon}
              tint="warning"
              label="Electricity"
              value={formatPlainRange(minE, maxE, 'Wh')}
            >
              Energy used for this query. For reference, one Google search is ~0.3 Wh.
            </OneReplyStatCard>
            <OneReplyStatCard
              icon={Co2OutlinedIcon}
              tint="success"
              label="Climate footprint"
              value={formatPlainRange(minC, maxC, 'g CO₂e')}
            >
              CO₂e adds up different greenhouse gases into one number. A Google search is ~0.2 g
              CO₂e
            </OneReplyStatCard>
            <OneReplyStatCard
              icon={WaterDropOutlinedIcon}
              tint="info"
              label="Cooling water (on-site)"
              value={formatPlainRange(minW, maxW, 'mL')}
            >
              The water used at the data center for cooling. Typically, a reply ranges from a few
              drops to a small sip.
            </OneReplyStatCard>
          </Stack>

          {Number.isFinite(minC) && Number.isFinite(maxC) && (
            <EpaEquivalencesCallout gCo2eMid={carbonMid} />
          )}

          <Box
            sx={(theme) => ({
              display: 'flex',
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.info.main, 0.25),
            })}
          >
            <InfoOutlinedIcon
              sx={{ color: 'info.main', flexShrink: 0, fontSize: 22, mt: 0.15 }}
              aria-hidden
            />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              These numbers come from one benchmark setup in{' '}
              <Link
                href="https://arxiv.org/abs/2505.09598"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                "How Hungry is AI?"
              </Link>
              . Your real chats can land higher or lower depending on how long they are, how busy
              the service is, and where it runs.
            </Typography>
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
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="billion-prompts-details"
              id="billion-prompts-header"
            >
              <Typography sx={{ fontWeight: 700 }}>What if I did this 1 billion times?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, maxWidth: 720, lineHeight: 1.55 }}
              >
                Every day, billions of queries are sent to ChatGPT and Claude. So while one AI
                prompt may be harmless, observe the impact of <strong>1000000000 people</strong>{' '}
                doing it every day.
              </Typography>
              <Stack spacing={1.5}>
                {scaleStories.map((item) => (
                  <ScaleStoryCard
                    key={item.title}
                    icon={item.icon}
                    tint={item.tint}
                    title={item.title}
                    headline={item.headline}
                    detail={item.detail}
                  />
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>

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
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="technical-details"
              id="technical-details-header"
            >
              <Typography sx={{ fontWeight: 600 }}>Technical details</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}
              >
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
        </>
      ) : (
        <Stack spacing={2.5}>
          <Card variant="outlined" sx={{ borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                How this calculator works
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>1) Benchmark lookup:</strong> We match your selected model + prompt length
                  to one row in the dataset published in{' '}
                  <Link
                    href="https://arxiv.org/abs/2505.09598"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    "How Hungry is AI?"
                  </Link>
                  .
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>2) Per-reply ranges:</strong> That row provides min/max values for energy
                  (Wh), climate footprint (gCO₂e), and water (mL). We show those ranges directly.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>3) Scale-up stories:</strong> We convert the same row to “1 billion
                  prompts” and then map those totals into household, driving, flight, and water
                  analogies for easier interpretation.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>4) EPA equivalents:</strong> For climate context, we also convert the
                  midpoint of your carbon range ({formatTenth(carbonMid)} g CO₂e) using EPA
                  equivalency factors.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Core formulas used in this report
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Midpoints for reporting:</strong> energy ≈ ({formatNum(minE)} +{' '}
                  {formatNum(maxE)}) / 2 =<strong> {formatNum(energyMid)} Wh</strong>, carbon ≈ (
                  {formatNum(minC)} + {formatNum(maxC)}) / 2 =
                  <strong> {formatNum(carbonMid)} gCO₂e</strong>, water ≈ ({formatNum(minW)} +{' '}
                  {formatNum(maxW)}) / 2 =<strong> {formatNum(waterMid)} mL</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Homes (rough):</strong> household-energy-equivalent MWh / 10.5 MWh per
                  home-year.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>People’s drinking water (rough):</strong> kL × 1,000 / 1,500 L per
                  person-year.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Car-years (rough):</strong> tons CO₂e / 4.6 tons per gasoline
                  vehicle-year.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>EPA conversions:</strong> We apply EPA factors for miles driven, gasoline
                  burned, smartphone charges, coal burned, and tree-seedling uptake.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Why this matters
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Decision quality:</strong> Seeing tradeoffs in energy, water, and
                  emissions helps teams pick models and prompt patterns more intentionally.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Responsible scaling:</strong> Small per-reply impacts can become very
                  large at product scale; the 1B-prompt view makes that visible early.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Transparent communication:</strong> Everyday equivalences make technical
                  sustainability data understandable for non-specialists.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Continuous improvement:</strong> Once impacts are measurable, you can
                  track changes from model choice, caching, prompt shortening, and infrastructure
                  shifts.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={(theme) => ({
              display: 'flex',
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.warning.main, 0.25),
            })}
          >
            <InfoOutlinedIcon
              sx={{ color: 'warning.main', flexShrink: 0, fontSize: 22, mt: 0.15 }}
              aria-hidden
            />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              This report is intended for transparency and planning, not exact accounting. Results
              vary by data center, hardware, utilization, model version, and output length.
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}

export default ResultsPanel
