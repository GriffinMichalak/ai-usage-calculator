export class AIModel {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}

export const MODELS_OPENAI: AIModel[] = [
  new AIModel('gpt-5-medium', 'GPT-5 (medium)'),
  new AIModel('gpt-5-nano', 'GPT-5 nano (minimal)'),
  new AIModel('gpt-5-mini', 'GPT-5 mini (medium)'),
]

export const MODELS_ANTHROPIC: AIModel[] = [
  new AIModel('claude-4-sonnet', 'Claude 4 Sonnet'),
  new AIModel('claude-4.5-haiku', 'Claude 4.5 Haiku'),
  new AIModel('claude-4.1-opus', 'Claude 4.1 Opus'),
  new AIModel('claude-4.5-sonnet', 'Claude 4.5 Sonnet'),
]
