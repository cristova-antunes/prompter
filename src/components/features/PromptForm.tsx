import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { promptParts, role as roleList, type Role } from "@/lib/prompt"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

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
    <form onSubmit={handleSubmit} className="grid gap-4">
      <fieldset className="flex flex-wrap gap-x-1 gap-y-2 items-center">
        {promptParts.role[0]}
        <Select>
          <SelectTrigger className="w-max">
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
        {promptParts.role[1]}
        <Input />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="context" aria-label="Context">
          {promptParts.context[0]}
        </Label>
        <Input
          type="text"
          id="context"
          placeholder="Provide some context for the prompt"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="prompt" aria-label="Prompt">
          {promptParts.prompt[0]}
        </Label>
        <Textarea
          placeholder="Provide a prompt for the issue"
          id="prompt"
          className="w-full resize-y"
        />
      </fieldset>
      <div className="flex justify-end gap-3">
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button>Create</Button>
      </div>
    </form>
  )
}

export default PromptForm
