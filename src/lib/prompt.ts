export const role = [
  "Front-end Developer",
  "UX Writer",
  "UI Designer",
  "Prompt Engineer",
] as const;
export type Role = (typeof role)[number];

type Prompt = {
  role: {
    role: string;
    expertise?: string;
  };
  goal?: string;
  context: string;
  instructions: string;
  constraints?: string;
  enableChainOfThought?: boolean;
};

export function generatePrompt(prompt: Prompt) {
  const expertiseStr = `${
    prompt.role.expertise
      ? `. With expertise in ${prompt.role.expertise}.`
      : "."
  }`;

  const roleStr = `<role>I want you to act as a Senior ${prompt.role.role}${expertiseStr}</role>`;

  const goalStr = `${
    prompt.goal && prompt.goal !== "" ? `<goal>${prompt.goal}</goal>` : ""
  }`;

  const constraintsStr = `${
    prompt.constraints && prompt.constraints !== ""
      ? `<constraints>${prompt.constraints}</constraints>`
      : ""
  }`;

  const output = `
${roleStr}

${goalStr}
       
<context>${prompt.context}</context>

  
<instructions>${prompt.instructions}</instructions>

${constraintsStr}

${prompt.enableChainOfThought ? "Lets think step by step." : ""}
If you don't know the answer, just say "Unknown".
`;

  return output.trim();
}
