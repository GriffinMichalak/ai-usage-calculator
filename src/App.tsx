import { useState } from 'react'
import './App.scss'

import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { ThemeProvider } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import Typography from '@mui/material/Typography'
import {
  MODEL_LABELS,
  PROMPT_LABELS,
  StyledToggleButtonGroup,
  theme,
  ToggleOption,
  toggleStackSx,
} from './extras'

function App() {
  const [promptType, setPromptType] = useState<string | null>(null)
  const [modelType, setModelType] = useState<string | null>(null)

  const handlePromptType = (
    _event: React.MouseEvent<HTMLElement>,
    newPromptType: string | null
  ) => {
    setPromptType(newPromptType)
  }

  const handleModelType = (_event: React.MouseEvent<HTMLElement>, newModelType: string | null) => {
    setModelType(newModelType)
  }

  const promptLabel = promptType ? (PROMPT_LABELS[promptType] ?? promptType) : null
  const modelLabel = modelType ? (MODEL_LABELS[modelType] ?? modelType) : null

  const canCalculate = Boolean(promptType && modelType)
  const [displayResults, setDisplayResults] = useState<boolean>(false)

  const handleCalculate = () => {
    if (!canCalculate) return
    setDisplayResults(true)
    // Wire up emissions calculation here
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <header className="app-hero">
          <h1 className="app-hero__title">AI Emissions Calculator</h1>
          <p className="app-hero__lede">
            Choose how you use the model and what class of model you run. Estimates will appear
            below.
          </p>
        </header>

        <div className="selection-grid">
          <Paper
            className="selection-card"
            elevation={0}
            component="section"
            aria-labelledby="step-prompt-heading"
          >
            <span className="selection-card__step">Step 1</span>
            <h2 id="step-prompt-heading">Prompt type</h2>
            <p className="selection-card__hint">
              What kind of task best matches your typical request?
            </p>
            <div className="toggle-rows">
              <StyledToggleButtonGroup
                value={promptType}
                exclusive
                onChange={handlePromptType}
                aria-label="Prompt type, row one"
              >
                <ToggleButton value="short-text" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Short text query" example="e.g., quick question" />
                </ToggleButton>
                <ToggleButton value="long-text" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Long text generation" example="e.g., essay, report" />
                </ToggleButton>
                <ToggleButton value="code" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Code generation" />
                </ToggleButton>
              </StyledToggleButtonGroup>
              <StyledToggleButtonGroup
                value={promptType}
                exclusive
                onChange={handlePromptType}
                aria-label="Prompt type, row two"
              >
                <ToggleButton value="image" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Image generation" />
                </ToggleButton>
                <ToggleButton value="multi-turn" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Multi-turn conversation" example="per exchange" />
                </ToggleButton>
                <ToggleButton value="summary" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Document summarization" />
                </ToggleButton>
              </StyledToggleButtonGroup>
            </div>
          </Paper>

          <Paper
            className="selection-card"
            elevation={0}
            component="section"
            aria-labelledby="step-model-heading"
          >
            <span className="selection-card__step">Step 2</span>
            <h2 id="step-model-heading">Model</h2>
            <p className="selection-card__hint">
              Rough size or capability tier of the model you use.
            </p>
            <div className="toggle-rows">
              <StyledToggleButtonGroup
                value={modelType}
                exclusive
                onChange={handleModelType}
                aria-label="Model tier, row one"
              >
                <ToggleButton value="lightweight" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Lightweight" example="e.g., Claude Haiku, GPT-3.5" />
                </ToggleButton>
                <ToggleButton value="mid-size" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Mid-size" example="e.g., Claude Sonnet, GPT-4o mini" />
                </ToggleButton>
              </StyledToggleButtonGroup>
              <StyledToggleButtonGroup
                value={modelType}
                exclusive
                onChange={handleModelType}
                aria-label="Model tier, row two"
              >
                <ToggleButton value="frontier-text" color="primary" sx={toggleStackSx}>
                  <ToggleOption
                    title="Frontier text"
                    example="e.g., Claude Opus, GPT-4, Gemini Ultra"
                  />
                </ToggleButton>
                <ToggleButton value="frontier-multimodal" color="primary" sx={toggleStackSx}>
                  <ToggleOption title="Frontier multimodal" example="e.g., DALL-E 3, Midjourney" />
                </ToggleButton>
              </StyledToggleButtonGroup>
            </div>
          </Paper>
        </div>

        <aside className="summary-bar" aria-live="polite">
          <Typography component="p" variant="body2" sx={{ m: 0, color: 'text.secondary' }}>
            <strong>Prompt:</strong> {promptLabel ?? '—'}{' '}
            <span className="summary-bar__sep">·</span> <strong>Model:</strong> {modelLabel ?? '—'}
          </Typography>
        </aside>

        <div className="calculate-row">
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            disabled={!canCalculate}
            onClick={handleCalculate}
            sx={{ textTransform: 'none', px: 4, py: 1.25, borderRadius: 999, fontWeight: 600 }}
          >
            Calculate
          </Button>
        </div>

        <section className="outputs" aria-labelledby="outputs-heading">
          <h2 id="outputs-heading" className="outputs__heading">
            Results
          </h2>
          <div className="outputs__panel">
            {!displayResults ? (
              <p className="outputs__placeholder">
                Emissions and usage estimates will show here once you wire in your calculator logic.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </ThemeProvider>
  )
}

export default App
