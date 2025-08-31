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
  goal?: string
  context: string
  task: string
  constraints?: string
  enableChainOfThought?: boolean
}

export const promptParts = {
  role: ["I want you to act as a Senior", ". With expertise in"],
  goal: ["### Goal"],
  context: ["### Context: "],
  task: ["### Task:"],
  constraints: ["### Constraints:"],
  chainOfThought: ["Lets think step by step."],
} as const

export function generatePrompt(prompt: Prompt) {
  const expertiseStr = `${
    prompt.role.expertise
      ? `${promptParts.role[1]} ${prompt.role.expertise}.`
      : "."
  }`

  const goalStr = `${
    prompt.goal && prompt.goal !== ""
      ? `${promptParts.goal[0]} 
${prompt.goal}.`
      : ""
  }`

  const constraintsStr = `${
    prompt.constraints && prompt.constraints !== ""
      ? `${promptParts.constraints[0]} 
${prompt.constraints}.`
      : ""
  }`

  const output = `
${promptParts.role[0]} ${prompt.role.role}${expertiseStr}

${goalStr}
       
${promptParts.context}
${prompt.context}.
  
${promptParts.task}
${prompt.task} 

${constraintsStr}

${prompt.enableChainOfThought ? promptParts.chainOfThought[0] : ""}`

  return output.trim()
}
