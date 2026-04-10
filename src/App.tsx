import { useState } from 'react'
import './App.scss'

import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton'
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup'
import { styled } from '@mui/material/styles'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: '2rem',
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
    borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
  },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
  {
    borderLeft: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
  },
}))

function App() {
  // const [count, setCount] = useState(0)
  const [promptType, setPromptType] = useState<string | null>('')
  const [modelType, setModelType] = useState<string | null>('')

  const handlePromptType = (_event: React.MouseEvent<HTMLElement>, newPromptType: string | null) => {
    setPromptType(newPromptType)
  }

  const handleModelType = (_event: React.MouseEvent<HTMLElement>, newModelType: string | null) => {
    setModelType(newModelType)
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>AI Emissions Calculator</h1>
          {/* <p>Subtitle</p> */}
          <br />
          <br />
        </div>
      </section>

      <div style={{ justifyContent: 'center', display: 'flex', gap: '5rem' }}>
        <section id="prompt-select">
          <div id="docs">
            <h2>1. Select Prompt Type</h2>
            <p>Your questions, answered</p>
            <StyledToggleButtonGroup
              value={promptType}
              exclusive
              onChange={handlePromptType}
              aria-label="text promptType"
            >
              <ToggleButton value="short-text" aria-label="left aligned" style={{ textTransform: 'none' }}>
                Short text query
              </ToggleButton>
              <ToggleButton value="long-text" aria-label="centered" style={{ textTransform: 'none' }}>
                Long Text Gen.
              </ToggleButton>
              <ToggleButton value="code" aria-label="right aligned" style={{ textTransform: 'none' }}>
                Code Gen.
              </ToggleButton>
            </StyledToggleButtonGroup>
            <StyledToggleButtonGroup
              value={promptType}
              exclusive
              onChange={handlePromptType}
              aria-label="extra options"
              style={{ marginTop: '0.5rem' }}
            >
              <ToggleButton value="image" aria-label="left aligned" style={{ textTransform: 'none' }}>
                Image Gen.
              </ToggleButton>
              <ToggleButton value="multi-turn" aria-label="centered" style={{ textTransform: 'none' }}>
                Multi-Turn
              </ToggleButton>
              <ToggleButton value="summary" aria-label="right aligned" style={{ textTransform: 'none' }}>
                Summarizing
              </ToggleButton>
            </StyledToggleButtonGroup>
          </div>
        </section>
        <section id="prompt-select">
          <div id="docs">
            <h2>2. Select Model</h2>
            <p>Your questions, answered</p>
            <StyledToggleButtonGroup
              value={modelType}
              exclusive
              onChange={handleModelType}
              aria-label="text modelType"
            >
              <ToggleButton value="lightweight" aria-label="left aligned" style={{ textTransform: 'none' }}>
                Lightweight
              </ToggleButton>
              <ToggleButton value="mid-size" aria-label="centered" style={{ textTransform: 'none' }}>
                Mid-Size
              </ToggleButton>
            </StyledToggleButtonGroup>
            <StyledToggleButtonGroup
              value={modelType}
              exclusive
              onChange={handleModelType}
              aria-label="extra options"
              style={{ marginTop: '0.5rem' }}
            >
              <ToggleButton value="frontier-text" aria-label="left aligned" style={{ textTransform: 'none' }}>
                Frontier Text
              </ToggleButton>
              <ToggleButton value="frontier-image" aria-label="centered" style={{ textTransform: 'none' }}>
                Frontier Image
              </ToggleButton>
            </StyledToggleButtonGroup>
          </div>
        </section>
      </div>

      <div>Prompt: {promptType}</div>
      <div>Model: {modelType}</div>
    </>
  )
}

export default App
