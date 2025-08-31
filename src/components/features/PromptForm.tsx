import { useState } from "react"
import { generatePrompt, promptParts, role as roleList } from "@/lib/prompt"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  type ComboboxOptions,
} from "@/components/features/ComboBoxWithCreate"

const defaultOptions: ComboboxOptions[] = roleList.map((role) => {
  return {
    value: role,
    label: role,
  }
})

const PromptForm = () => {
  const [selectedRole, setSelectedRole] = useState<ComboboxOptions>()

  function handleSelect(option: ComboboxOptions) {
    console.log("handleSelect")
    console.log(option)
    setSelectedRole(option)
  }

  function handleAppendGroup(label: ComboboxOptions["label"]) {
    const newRole = {
      value: label,
      label,
    }
    defaultOptions.push(newRole)
    console.log("handleAppendGroup")
    console.log(newRole)
    handleSelect(newRole)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const roleExpertize = formData.get("role-expertize") as string
    const context = formData.get("context") as string
    const task = formData.get("task") as string

    const output = generatePrompt({
      role: {
        role: selectedRole?.value || "",
        expertize: roleExpertize,
      },
      context,
      task,
    })

    console.log(output)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" id="prompt-form">
      <fieldset className="flex flex-wrap gap-x-1 gap-y-2 items-center">
        {promptParts.role[0]}
        <Combobox
          options={defaultOptions}
          placeholder="Role"
          selected={selectedRole?.value ?? ""}
          onChange={handleSelect}
          onCreate={handleAppendGroup}
          className="w-fit"
        />
        {promptParts.role[1]}
        <Input id="role-expertize" name="role-expertize" type="text" />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="context" aria-label="Context">
          {promptParts.context[0]}
        </Label>
        <Input
          type="text"
          id="context"
          name="context"
          placeholder="Provide some context for the prompt"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="task" aria-label="Task">
          {promptParts.task[0]}
        </Label>
        <Textarea
          placeholder="Provide a task for the issue"
          id="task"
          name="task"
          className="w-full resize-y"
        />
      </fieldset>
      <div className="flex justify-end gap-3 sticky bg-card p-3 rounded-sm -bottom-4">
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button>Create</Button>
      </div>
    </form>
  )
}

export default PromptForm
