import './App.scss'
import { useState, useEffect, useRef, type MouseEvent } from 'react'
import ResultsPanel from './ResultsPanel'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { MODELS_OPENAI, MODELS_ANTHROPIC } from './extras'
import type { EmissionsBenchmarkRow, ModelSize } from './types'

function lengthKeyFromSize(size: ModelSize): 'Short' | 'Medium' | 'Long' | null {
  if (size === 'short') return 'Short'
  if (size === 'medium') return 'Medium'
  if (size === 'long') return 'Long'
  return null
}

function App() {
  const [model, setModel] = useState<string | null>('GPT-5 (medium)')
  const [size, setSize] = useState<ModelSize>()
  const [resultRow, setResultRow] = useState<EmissionsBenchmarkRow | null>(null)
  const [resultError, setResultError] = useState<string | null>(null)
  const [data, setData] = useState<EmissionsBenchmarkRow[] | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  const handleModelChange = (event: SelectChangeEvent<string | null>) => {
    const selectedModel = event.target.value
    setModel(selectedModel)
  }

  const handleSizeChange = (_event: MouseEvent<HTMLElement>, newSize: ModelSize | null) => {
    if (newSize) {
      setSize(newSize)
    }
  }

  const getResults = () => {
    const modelName = model
    const lengthKey = lengthKeyFromSize(size ?? null)

    if (!modelName || !lengthKey) {
      setResultError('Choose a model and how long your question is.')
      setResultRow(null)
      return
    }

    if (!data?.length) {
      setResultError('Numbers are still loading — wait a moment and try again.')
      setResultRow(null)
      return
    }

    const foundRow = data.find((row) => row.length === lengthKey && row.Model === modelName)

    if (!foundRow) {
      setResultRow(null)
      setResultError(
        `We don’t have a benchmark row for “${modelName}” with that prompt length yet.`
      )
      return
    }

    setResultError(null)
    setResultRow(foundRow)
  }

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/data.json`
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load benchmark data (${res.status} ${res.statusText})`)
        }
        return res.json()
      })
      .then((json: EmissionsBenchmarkRow[]) => setData(json))
      .catch((err) => {
        console.error(err)
        setData([])
        setResultError('Could not load benchmark data. Please refresh and try again.')
      })
  }, [])

  useEffect(() => {
    if (!resultRow) return
    const timer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => window.clearTimeout(timer)
  }, [resultRow])

  const canSubmit = Boolean(model && size && data?.length)

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100%',
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 2 },
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'left' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.14em' }}
          >
            Usage Calculator
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, lineHeight: 1.15 }}
          >
            How much energy was used for my AI response?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 640, lineHeight: 1.65 }}
          >
            Select how long your question was and the model you used. Below you'll see the
            electricity, climate impact, and water usage to generate the reply.
          </Typography>
        </Stack>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 0.5, fontWeight: 600 }}
                >
                  Step 1 — How long is your question?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 560 }}>
                  Choose the closest match
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={size}
                  exclusive
                  onChange={handleSizeChange}
                  aria-label="How long is your question"
                  fullWidth
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                    '& .MuiToggleButtonGroup-grouped': {
                      borderRadius: '12px !important',
                      border: '1px solid !important',
                      borderColor: 'divider !important',
                      py: 1.25,
                      px: 1.5,
                      textAlign: 'left',
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        borderColor: 'primary.main !important',
                        '&:hover': { bgcolor: 'primary.dark' },
                      },
                    },
                  }}
                >
                  <ToggleButton value="short" aria-label="Short question">
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Short
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', opacity: 0.9, mt: 0.25 }}
                      >
                        A quick question (~75 words)
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="medium" aria-label="Medium question">
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Medium
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', opacity: 0.9, mt: 0.25 }}
                      >
                        A few paragraphs (~750 words)
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="long" aria-label="Long question">
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Long
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', opacity: 0.9, mt: 0.25 }}
                      >
                        A lengthy prompt (~7500 words)
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <FormControl fullWidth>
                <InputLabel id="model-select-label" htmlFor="grouped-native-select">
                  Step 2 — Which AI?
                </InputLabel>
                <Select
                  native
                  id="grouped-native-select"
                  labelId="model-select-label"
                  label="Step 2 — Which AI?"
                  onChange={handleModelChange}
                  value={model}
                  inputProps={{ 'aria-describedby': 'model-helper' }}
                >
                  <option aria-label="None" value="">
                    Choose a model…
                  </option>
                  <optgroup label="OpenAI">
                    {MODELS_OPENAI.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Anthropic">
                    {MODELS_ANTHROPIC.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                {/* <FormHelperText id="model-helper">
                  Same tool you pick in the app menu — we match it to published benchmark data.
                </FormHelperText> */}
              </FormControl>

              <Box>
                <Button
                  onClick={getResults}
                  variant="contained"
                  size="large"
                  disabled={!canSubmit}
                  fullWidth
                  sx={{ py: 1.25, fontSize: '1rem' }}
                >
                  Show me the estimate
                </Button>
                {!data?.length ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Loading benchmark data…
                  </Typography>
                ) : null}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box ref={resultsRef}>
          {resultError ? (
            <Alert severity="warning" sx={{ textAlign: 'left', borderRadius: 2, mb: 2 }}>
              {resultError}
            </Alert>
          ) : null}
          {resultRow ? <ResultsPanel row={resultRow} /> : null}
        </Box>
      </Container>
    </Box>
  )
}

export default App
