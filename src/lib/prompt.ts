export const role = [
  "Front-end Developer",
  "UX Writer",
  "UI Designer",
  "Prompt Engineer",
] as const
export type Role = (typeof role)[number]

export const flags = {
  general: {
    chainOfThought: "Lets think step by step.",
    assumptions:
      "If the provided context or instructions are insufficient or unclear, state the ambiguity and ask for clarification, rather than guessing.",
    options: "Provide alternatives or options (if relevant)",
  },
  code: {
    production:
      "All generated code must be clean, secure, performance-optimized, and follow best practices for a production environment, no deprecated APIs and follows the latest industry standards.",
    accessibility: "Include accessibility (a11y) considerations",
  },
  ux: {
    rationale: "Include UX rationale (Why the design or writing choice works)",
    bestPractices:
      "Follow UX writing best practices(short, clear, action-based)",
    accessibility: "Include accessibility guidance for content",
  },
  promptEngineering: {
    optimization: "Optimize prompts for clarity, conciseness, and efficiency",
  },
} as const

type Prompt = {
  role: {
    role: string
    expertise?: string
  }
  context: string
  instructions: string
  toneOfVoice?: string
  constraints?: string
  format?: string
  flags: {
    general: {
      chainOfThought: boolean
      assumptions: boolean
      options: boolean
    }
    code: {
      production: boolean
      accessibility: boolean
    }
    ux: {
      rationale: boolean
      bestPractices: boolean
      accessibility: boolean
    }
    promptEngineering: {
      optimization: boolean
    }
  }
}

export function generatePrompt(prompt: Prompt) {
  const expertiseStr = `${
    prompt.role.expertise
      ? `. With expertise in ${prompt.role.expertise}.`
      : "."
  }`

  const roleStr = `<role>I want you to act as a Senior ${prompt.role.role}${expertiseStr}</role>`

  const constraintsStr = `${
    prompt.constraints && prompt.constraints !== ""
      ? `<constraints>${prompt.constraints}</constraints>`
      : ""
  }`

  const formatStr = `${
    prompt.format && prompt.format !== ""
      ? `<format>${prompt.format}</format>`
      : ""
  }`

  const flagStrings: string[] = []

  if (prompt.flags.general.chainOfThought) {
    flagStrings.push(flags.general.chainOfThought)
  }
  if (prompt.flags.general.assumptions) {
    flagStrings.push(flags.general.assumptions)
  }
  if (prompt.flags.general.options) {
    flagStrings.push(flags.general.options)
  }
  if (prompt.flags.code.production) {
    flagStrings.push(flags.code.production)
  }
  if (prompt.flags.code.accessibility) {
    flagStrings.push(flags.code.accessibility)
  }
  if (prompt.flags.ux.rationale) {
    flagStrings.push(flags.ux.rationale)
  }
  if (prompt.flags.ux.bestPractices) {
    flagStrings.push(flags.ux.bestPractices)
  }
  if (prompt.flags.ux.accessibility) {
    flagStrings.push(flags.ux.accessibility)
  }
  if (prompt.flags.promptEngineering.optimization) {
    flagStrings.push(flags.promptEngineering.optimization)
  }

  const flagsStr = flagStrings.length > 0 ? flagStrings.join("\n") + "\n" : ""

  const output = `
${roleStr}
<context>${prompt.context}</context>
<instructions>${prompt.instructions}</instructions>
${constraintsStr}
<tone of voice>${prompt.toneOfVoice}</tone of voice>
${formatStr}
${flagsStr}`

  return output.trim()
}
