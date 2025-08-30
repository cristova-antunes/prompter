import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { role as roleList, type Role } from "@/lib/prompt"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const PromptForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const role = formData.get("role") as Role
    const context = formData.get("context") as string
    const prompt = formData.get("prompt") as string
    console.log(role, context, prompt)
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roleList.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>
      <fieldset className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="context">Context</Label>
        <Input
          type="text"
          id="context"
          placeholder="Provide some context for the prompt"
        />
      </fieldset>
      <fieldset className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea placeholder="Provide a prompt for the issue" id="prompt" />
      </fieldset>
    </form>
  )
}

export default PromptForm
