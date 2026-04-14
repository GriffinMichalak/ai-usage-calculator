import './App.scss'
import { useState, useEffect, type MouseEvent } from 'react'

import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'

class AIModel {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

const MODELS_OPENAI: AIModel[] = [
  new AIModel('gpt-5-medium', 'GPT-5 (medium)'),
  new AIModel('gpt-5-nano', 'GPT-5 nano (minimal)'),
  new AIModel('gpt-5-mini', 'GPT-5 mini (medium)'),
]

const MODELS_ANTHROPIC: AIModel[] = [
  new AIModel('claude-4-sonnet', 'Claude 4 Sonnet'),
  new AIModel('claude-4.5-haiku', 'Claude 4.5 Haiku'),
  new AIModel('claude-4.1-opus', 'Claude 4.1 Opus'),
  new AIModel('claude-4.5-sonnet', 'Claude 4.5 Sonnet'),
]

type ModelSize = 'small' | 'medium' | 'large'

function App() {
  const [model, setModel] = useState<string | null>('')
  const [size, setSize] = useState<ModelSize>('medium')
  const canCalculate = Boolean(model) && Boolean(size)
  const [displayResults, setDisplayResults] = useState<Boolean>(false)
  const [data, setData] = useState(null);

  const handleModelChange = (event: SelectChangeEvent<string | null>) => {
    const selectedModel = event.target.value
    setModel(selectedModel)
    console.log(selectedModel)
  }

  const handleSizeChange = (_event: MouseEvent<HTMLElement>, newSize: ModelSize | null) => {
    if (newSize) {
      setSize(newSize)
      console.log(newSize)
    }
  }

  useEffect(() => {
    fetch('../data/data.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div>{data ? data[0].Model : 'Loading...'}</div>
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
          <ToggleButton value="small" aria-label="small size">
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2">Small</Typography>
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
          <ToggleButton value="large" aria-label="large size">
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2">Large</Typography>
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
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Anthropic">
            {MODELS_ANTHROPIC.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        </Select>
      </FormControl>
      <Button onClick={() => setDisplayResults(true)} variant="contained" disabled={!canCalculate}>
        Calculate
      </Button>
      {displayResults && <Box>Results</Box>}
    </Box>
  )
}

export default App
