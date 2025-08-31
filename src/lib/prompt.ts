export const role = ["Front-end Developer", "UX Writer", "UI Designer"] as const
export type Role = (typeof role)[number]

type Prompt = {
  role: {
    role: Role
    expertize?: string
  }
  context: string
  prompt: string
}

export const promptParts = {
  role: ["Act as a", ". With expertize in", "."],
  context: ["Here is the context: ", "."],
  prompt: ["Here is the prompt:", "."],
} as const

function generatePrompt(prompt: Prompt) {
  return `${promptParts.role[1]} ${prompt.role.role} ${
    prompt.role.expertize
      ? `${promptParts.role[1]} ${prompt.role.expertize} ${promptParts.role[2]}`
      : `${promptParts.role[2]}`
  }. 
  
  ${promptParts.context}
  ${prompt.context}
  
  ${promptParts.prompt}
  ${prompt.prompt}
  `
}

/**
 * Demo
 */
console.log(
  generatePrompt({
    role: {
      role: "Front-end Developer",
      expertize: "CSS Grid",
    },
    context: "We're building a map component using Google Maps API.",
    prompt:
      "Currently, we have a map component that is not responsive. We need to make it responsive so that it can be used on mobile devices.",
  })
)
