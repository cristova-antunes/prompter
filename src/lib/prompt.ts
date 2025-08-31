export const role = ["Front-end Developer", "UX Writer", "UI Designer"] as const
export type Role = (typeof role)[number]

type Prompt = {
  role: Role
  context: string
  prompt: string
}

export const promptParts = {
  role: ["Act as a", ". With expertize in", "."],
  context: ["Here is the context: ", "."],
  prompt: ["Here is the prompt:", "."],
} as const

function generatePrompt(prompt: Prompt) {
  return `Act as a ${prompt.role}. Here is the context:
  ${prompt.context}
  
  Here is the prompt:
  ${prompt.prompt}
  `
}

/**
 * Demo
 */
console.log(
  generatePrompt({
    role: "Front-end Developer",
    context: "We're building a map component using Google Maps API.",
    prompt:
      "Currently, we have a map component that is not responsive. We need to make it responsive so that it can be used on mobile devices.",
  })
)
