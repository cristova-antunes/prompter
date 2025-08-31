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
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
import Snippets from "./Snippets"

const defaultOptions: ComboboxOptions[] = roleList.map((role) => {
  return {
    value: role,
    label: role,
  }
})

const PromptForm = () => {
  const [selectedRole, setSelectedRole] = useState<ComboboxOptions>()
  const [chainOfThoughtSelected, setChainOfThoughtSelected] =
    useState<boolean>(false)

  function handleSelect(option: ComboboxOptions) {
    setSelectedRole(option)
  }

  function handleAppendGroup(label: ComboboxOptions["label"]) {
    const newRole = {
      value: label,
      label,
    }
    defaultOptions.push(newRole)
    handleSelect(newRole)
  }

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    setChainOfThoughtSelected(checked === true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const roleExpertise = formData.get("role-expertise") as string
    const context = formData.get("context") as string
    const constraints = formData.get("constraints") as string
    const task = formData.get("task") as string

    const output = generatePrompt({
      role: {
        role: selectedRole?.value || "",
        expertise: roleExpertise,
      },
      context,
      task,
      constraints,
      enableChainOfThought: chainOfThoughtSelected,
    })

    try {
      await navigator.clipboard.writeText(output)
      toast.success("Prompt copied to the clipboard")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please check logs in your console")
    }

    console.log(`
      DEBUG
      
      ${output}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" id="prompt-form">
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
        <Input
          id="role-expertise"
          name="role-expertise"
          type="text"
          placeholder="e.g. Accessibility, CSS Grid, Intersection Observer, Figma, (...)"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="goal" aria-label="Goal">
          {promptParts.goal[0]}
        </Label>
        <Input
          type="text"
          id="goal"
          name="goal"
          placeholder="e.g., Create an User-story, Debug an error, (...)"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="context" aria-label="Context">
          {promptParts.context[0]}
        </Label>
        <Input
          type="text"
          id="context"
          name="context"
          placeholder="e.g., We are building an e-commerce checkout flow, in React typescript with ShadCN as UI library"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="task" aria-label="Task">
          {promptParts.task[0]}
        </Label>
        <Textarea
          placeholder="e.g., Suggest a better user flow for the checkout process., Write a user story for the new mobile app feature."
          id="task"
          name="task"
          required
          className="w-full resize-y"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <Label htmlFor="constraints" aria-label="Constraints">
          {promptParts.constraints[0]}
        </Label>
        <Textarea
          placeholder="e.g., Use only typescript, Focus on accessibility (WCAG 2.1)., The solution must be responsive for mobile."
          id="constraints"
          name="constraints"
          required
          className="w-full resize-y"
        />
      </fieldset>
      <fieldset className="grid w-full items-center gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="chain-of-thought"
            name="chain-of-thought"
            checked={chainOfThoughtSelected}
            onCheckedChange={handleCheckedChange}
          />
          <Label htmlFor="chain-of-thought">Ask to think step by step</Label>
        </div>
      </fieldset>
      <div className="flex justify-end gap-3 sticky bg-card p-3 rounded-sm -bottom-4">
        <Snippets />
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <Button>Generate prompt</Button>
      </div>
    </form>
  )
}

export default PromptForm
