import { generatePrompt, promptParts, role as roleList } from "@/lib/prompt"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  type ComboboxOptions,
} from "@/components/features/ComboBoxWithCreate"
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
import Snippets from "./Snippets"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const defaultRoleOptions: ComboboxOptions[] = roleList.map((role) => {
  return {
    value: role,
    label: role,
  }
})

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  roleExpertise: z.string().optional(),
  goal: z.string().optional(),
  context: z.string().min(1, "Context is required"),
  task: z.string().min(1, "Task is required"),
  constraints: z.string().optional(),
  enableChainOfThought: z.boolean(),
})

const PromptForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      roleExpertise: "",
      goal: "",
      context: "",
      task: "",
      constraints: "",
      enableChainOfThought: false,
    },
  })

  const { setValue } = form

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const {
      role,
      roleExpertise,
      context,
      constraints,
      task,
      goal,
      enableChainOfThought,
    } = data

    const output = generatePrompt({
      role: {
        role,
        expertise: roleExpertise,
      },
      context,
      task,
      goal,
      constraints,
      enableChainOfThought,
    })

    try {
      await navigator.clipboard.writeText(output)
      toast.success("Prompt copied to the clipboard")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please check logs in your console")
    }
  }

  function handleSelect(option: ComboboxOptions) {
    setValue("role", option.value)
  }

  function handleAppendGroup(label: ComboboxOptions["label"]) {
    const newRole = {
      value: label,
      label,
    }
    defaultRoleOptions.push(newRole)
    handleSelect(newRole)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6"
        id="prompt-form"
      >
        <fieldset className="flex flex-wrap gap-x-1 gap-y-2 items-center">
          <FormField
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <FormItem className="contents">
                {promptParts.role[0]}
                <Combobox
                  options={defaultRoleOptions}
                  placeholder="Role"
                  selected={field.value ?? ""}
                  onChange={handleSelect}
                  onCreate={handleAppendGroup}
                  className={`w-fit ${
                    fieldState.error ? "ring ring-destructive" : ""
                  }`}
                />
                {promptParts.role[1]}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleExpertise"
            render={({ field }) => (
              <FormItem className="contents">
                <FormControl>
                  <Input
                    placeholder="e.g. Accessibility, CSS Grid, Intersection Observer, Figma, (...)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-label="Goal">{promptParts.goal[0]}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Create an User-story, Debug an error, (...)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-label="Context">
                {promptParts.context[0]}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., We are building an e-commerce checkout flow, in React typescript with ShadCN as UI library"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-label="Task">{promptParts.task[0]}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Suggest a better user flow for the checkout process., Write a user story for the new mobile app feature."
                  className="w-full resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="constraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-label="Constraints">
                {promptParts.constraints[0]}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Use only typescript, Focus on accessibility (WCAG 2.1)., The solution must be responsive for mobile."
                  className="w-full resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enableChainOfThought"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Ask to think step by step
              </FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 sticky bg-card p-3 rounded-sm -bottom-4">
          <Snippets />
          <Button type="reset" variant="secondary">
            Reset
          </Button>
          <Button type="submit">Generate prompt</Button>
        </div>
      </form>
    </Form>
  )
}

export default PromptForm
