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
    expertize?: string
  }
  context: string
  task: string
  enableChainOfThought?: boolean
}

export const promptParts = {
  role: ["I want you to act as a Senior ", ". With expertize in"],
  context: ["### Context: "],
  task: ["### Task:"],
  chainOfThought: ["Lets think step by step."],
} as const

export function generatePrompt(prompt: Prompt) {
  const output = `
${promptParts.role[0]} ${prompt.role.role}${
    prompt.role.expertize
      ? `${promptParts.role[1]} ${prompt.role.expertize}.`
      : "."
  }
       
${promptParts.context}
${prompt.context}.
  
${promptParts.task}
${prompt.task} 
${prompt.enableChainOfThought ? promptParts.chainOfThought[0] : ""}`

  return output.trim()
}
