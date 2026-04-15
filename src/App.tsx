import './App.scss'
import { useState, useEffect, type MouseEvent } from 'react'
import ResultsPanel from './ResultsPanel'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
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
  const inputData = [model, size]
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
      setResultError('Choose a model and prompt length.')
      setResultRow(null)
      return
    }

    if (!data?.length) {
      setResultError('Benchmark data is still loading. Try again in a moment.')
      setResultRow(null)
      return
    }

    const foundRow = data.find((row) => row.length === lengthKey && row.Model === modelName)

    if (!foundRow) {
      setResultRow(null)
      setResultError(`No benchmark row for “${modelName}” with ${lengthKey} prompt length.`)
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

  return (
    <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* <div>{data ? data[0].Model : 'Loading...'}</div> */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Model Size
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={size}
          exclusive
          onChange={handleSizeChange}
          aria-label="model size"
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none' } }}
        >
          <ToggleButton value="short" aria-label="short size">
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2">Short</Typography>
              <Typography variant="caption" color="text.secondary">
                Fastest / lowest cost
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="medium" aria-label="medium size">
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2">Medium</Typography>
              <Typography variant="caption" color="text.secondary">
                Balanced performance
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="long" aria-label="long size">
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2">Long</Typography>
              <Typography variant="caption" color="text.secondary">
                Best quality output
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel htmlFor="grouped-native-select">AI Model</InputLabel>
        <Select
          native
          id="grouped-native-select"
          label="AI Model"
          onChange={handleModelChange}
          value={model}
        >
          <option aria-label="None" value="" />
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
      </FormControl>
      <Button onClick={getResults} variant="contained" disabled={!inputData[0] || !inputData[1]}>
        Calculate
      </Button>
      {resultError ? (
        <Alert severity="warning" sx={{ textAlign: 'left' }}>
          {resultError}
        </Alert>
      ) : null}
      {resultRow ? <ResultsPanel row={resultRow} /> : null}
    </Box>
  )
}

export default App
