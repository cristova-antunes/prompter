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
}

export const promptParts = {
  role: ["I want you to act as a senior ", ". With expertize in"],
  context: ["Here is the context: "],
  task: ["Here is the task:"],
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
${prompt.task}`

  return output.trim()
}
