import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup'
import { createTheme, styled } from '@mui/material/styles'
import { toggleButtonClasses } from '@mui/material/ToggleButton'

export const theme = createTheme({
  palette: {
    primary: { main: '#aa3bff' },
    mode: 'light',
  },
  typography: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  },
})

export const toggleStackSx = {
  textTransform: 'none' as const,
  py: 1.25,
  px: 1.5,
  flexDirection: 'column' as const,
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: 0.35,
  lineHeight: 1.35,
}

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme: t }) => ({
  flexWrap: 'wrap',
  gap: '0.5rem',
  justifyContent: 'flex-start',
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopRightRadius: (t.vars || t).shape.borderRadius,
    borderBottomRightRadius: (t.vars || t).shape.borderRadius,
  },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]: {
    borderTopLeftRadius: (t.vars || t).shape.borderRadius,
    borderBottomLeftRadius: (t.vars || t).shape.borderRadius,
    borderLeft: `1px solid ${(t.vars || t).palette.divider}`,
  },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${(t.vars || t).palette.action.disabledBackground}`,
    },
}))

export const PROMPT_LABELS: Record<string, string> = {
  'short-text': 'Short text query',
  'long-text': 'Long text generation',
  code: 'Code generation',
  image: 'Image generation',
  'multi-turn': 'Multi-turn conversation',
  summary: 'Document summarization',
}

export const MODEL_LABELS: Record<string, string> = {
  lightweight: 'Lightweight',
  'mid-size': 'Mid-size',
  'frontier-text': 'Frontier text',
  'frontier-multimodal': 'Frontier Multimodal',
}

export function ToggleOption({ title, example }: { title: string; example?: string }) {
  return (
    <span className="toggle-option">
      <span className="toggle-option__title">{title}</span>
      {example ? <span className="toggle-option__example">{example}</span> : null}
    </span>
  )
}
