export const role = [
  "Front-end Developer",
  "UX Writer",
  "UI Designer",
  "Prompt Engineer",
] as const
export type Role = (typeof role)[number]

export const flags = {
  general: {
    label: "General",
    flags: {
      chainOfThought: {
        label: "Enable chain of thought",
        prompt:
          "Think step-by-step, outline your solution process (in detail) and derive the solution step-by-step therefore.",
      },
      assumptions: {
        label: "Ask to clarify before answering (if relevant)",
        prompt:
          "If the provided context or instructions are insufficient or unclear, state the ambiguity and ask for clarification, rather than guessing.",
      },
      options: {
        label: "Provide alternatives or options (if relevant)",
        prompt: "Provide alternatives or options (if relevant)",
      },
    },
  },
  code: {
    label: "Code",
    flags: {
      production: {
        label: "Production ready code",
        prompt:
          "All generated code must be clean, secure, performance-optimized, and follow best practices for a production environment, no deprecated APIs and follows the latest industry standards.",
      },
      accessibility: {
        label: "Consider Accessibility (A11y)",
        prompt:
          "Ensure all outputs, especially design or front-end code, strictly adhere to WCAG 2.1 AA standards.",
      },
      onlyReturnCode: {
        label: "Only return code",
        prompt:
          "Give me just the code, no extra explanations or text. But make sure the code is formatted as such.",
      },
    },
  },
  ux: {
    label: "UX",
    flags: {
      rationale: {
        label: "Include UX rationale",
        prompt: "Include UX rationale (Why the design or writing choice works)",
      },
      bestPractices: {
        label: "Follow UX writing best practices",
        prompt: "Follow UX writing best practices (short, clear, action-based)",
      },
      accessibility: {
        label: "Consider Accessibility (A11y)",
        prompt: "Include accessibility guidance for content",
      },
    },
  },
  promptEngineering: {
    labels: "Prompt engineering",
    flags: {
      optimization: {
        label: "Optimize prompts",
        prompt: "Optimize prompts for clarity, conciseness, and efficiency",
      },
    },
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
    flagStrings.push(flags.general.flags.chainOfThought.prompt)
  }
  if (prompt.flags.general.assumptions) {
    flagStrings.push(flags.general.flags.assumptions.prompt)
  }
  if (prompt.flags.general.options) {
    flagStrings.push(flags.general.flags.options.prompt)
  }
  if (prompt.flags.code.production) {
    flagStrings.push(flags.code.flags.production.prompt)
  }
  if (prompt.flags.code.accessibility) {
    flagStrings.push(flags.code.flags.accessibility.prompt)
  }
  if (prompt.flags.ux.rationale) {
    flagStrings.push(flags.ux.flags.rationale.prompt)
  }
  if (prompt.flags.ux.bestPractices) {
    flagStrings.push(flags.ux.flags.bestPractices.prompt)
  }
  if (prompt.flags.ux.accessibility) {
    flagStrings.push(flags.ux.flags.accessibility.prompt)
  }
  if (prompt.flags.promptEngineering.optimization) {
    flagStrings.push(flags.promptEngineering.flags.optimization.prompt)
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
