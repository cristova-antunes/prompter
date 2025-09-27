export const role = [
  "Front-end Developer",
  "UX Writer",
  "UI Designer",
  "Prompt Engineer",
] as const
export type Role = (typeof role)[number]

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
  enableChainOfThought?: boolean
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

  const output = `
${roleStr}
<context>${prompt.context}</context>
<instructions>${prompt.instructions}</instructions>
${constraintsStr}
<tone of voice>${prompt.toneOfVoice}</tone of voice>
${formatStr}
${prompt.enableChainOfThought ? "Lets think step by step." : ""}
If you don't know the answer, just say "Unknown".
`

  return output.trim()
}
