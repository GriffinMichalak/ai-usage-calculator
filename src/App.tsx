import './App.scss'
import { useState, useEffect, type MouseEvent } from 'react'
import ResultsPanel from './ResultsPanel'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
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
  const [model, setModel] = useState<string | null>('')
  const [size, setSize] = useState<ModelSize>()
  const [resultRow, setResultRow] = useState<EmissionsBenchmarkRow | null>(null)
  const [resultError, setResultError] = useState<string | null>(null)
  const [data, setData] = useState<EmissionsBenchmarkRow[] | null>(null)

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
    fetch('../data/data.json')
      .then((res) => res.json())
      .then((json: EmissionsBenchmarkRow[]) => setData(json))
      .catch((err) => console.error(err))
  }, [])

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
            Plain-language estimates
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, lineHeight: 1.15 }}
          >
            How much energy does one AI answer use?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 640, lineHeight: 1.65 }}
          >
            Pick the kind of AI and roughly how long your question is. We’ll show electricity,
            climate impact, and water in units most people recognize — plus optional technical
            detail if you want to dig in.
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
                  Shorter prompts usually use less compute; longer ones can cost a bit more time,
                  energy, and emissions. Choose the closest match.
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
                        Quick question — usually fastest and lightest
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
                        A few paragraphs or a detailed ask
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
                        Long prompt or you need the best-quality answer
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
                <FormHelperText id="model-helper">
                  Same tool you pick in the app menu — we match it to published benchmark data.
                </FormHelperText>
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

        {resultError ? (
          <Alert severity="warning" sx={{ textAlign: 'left', borderRadius: 2, mb: 2 }}>
            {resultError}
          </Alert>
        ) : null}
        {resultRow ? <ResultsPanel row={resultRow} /> : null}
      </Container>
    </Box>
  )
}

export default App
