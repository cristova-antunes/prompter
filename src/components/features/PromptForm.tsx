import { flags, generatePrompt, role as roleList } from "@/lib/prompt"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  type ComboboxOptions,
} from "@/components/features/ComboBoxWithCreate"
import { toast } from "sonner"
import { Checkbox } from "../ui/checkbox"
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
import { Card, CardContent } from "../ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

const defaultRoleOptions: ComboboxOptions[] = roleList.map((role) => {
  return {
    value: role,
    label: role,
  }
})

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  roleExpertise: z.string().optional(),
  context: z.string().min(1, "Context is required"),
  instructions: z.string().min(1, "Task is required"),
  constraints: z.string().optional(),
  toneOfVoice: z.string().optional(),
  format: z.string().optional(),
  flags: z.object({
    general: z.object({
      chainOfThought: z.boolean(),
      assumptions: z.boolean(),
      options: z.boolean(),
    }),
    code: z.object({
      production: z.boolean(),
      accessibility: z.boolean(),
    }),
    ux: z.object({
      rationale: z.boolean(),
      bestPractices: z.boolean(),
      accessibility: z.boolean(),
    }),
    promptEngineering: z.object({
      optimization: z.boolean(),
    }),
  }),
})

const PromptForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      roleExpertise: "",
      context: "",
      instructions: "",
      constraints: "",
      toneOfVoice: "Consistent, informative, professional, avoid jargon",
      format: "",
      flags: {
        general: {
          chainOfThought: false,
          assumptions: true,
          options: true,
        },
        code: {
          production: true,
          accessibility: true,
        },
        ux: {
          rationale: false,
          bestPractices: false,
          accessibility: false,
        },
        promptEngineering: {
          optimization: false,
        },
      },
    },
  })

  const { setValue } = form

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const {
      role,
      roleExpertise,
      context,
      constraints,
      instructions,
      toneOfVoice,
      format,
      flags,
    } = data

    const output = generatePrompt({
      role: {
        role,
        expertise: roleExpertise,
      },
      context,
      instructions,
      constraints,
      toneOfVoice,
      format,
      flags,
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
        className="grid gap-6 lg:grid-cols-[1fr_25vw]"
        id="prompt-form"
      >
        <Card>
          <CardContent>
            <div className="grid gap-4">
              <fieldset className="flex flex-wrap gap-x-1 gap-y-2 items-center">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field, fieldState }) => (
                    <FormItem className="contents">
                      I want you to act as a Senior
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
                      . With expertise in
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
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-label="Context">Context</FormLabel>
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
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-label="Instructions">
                      Instructions
                    </FormLabel>
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
                name="toneOfVoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-label="Tone of Voice">
                      Tone of Voice
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Consistent, informative, professional, avoid jargon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-label="Format">Format</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. JSON, Markdown, HTML, (...)"
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
                    <FormLabel aria-label="Constraints">Constraints</FormLabel>
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
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <fieldset>
            <Card>
              <CardContent>
                <div className="mb-2">
                  <legend className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Flags
                  </legend>
                </div>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={Object.keys(flags)[0]}
                >
                  {Object.entries(flags).map(([category, categoryFlags]) => (
                    <AccordionItem value={category} key={category}>
                      <AccordionTrigger className="capitalize">
                        {category === "promptEngineering"
                          ? "Prompt Engineering"
                          : category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {Object.entries(categoryFlags).map(([flagKey]) => {
                            const fieldName = `flags.${category}.${flagKey}` as
                              | "flags.general.chainOfThought"
                              | "flags.general.assumptions"
                              | "flags.general.options"
                              | "flags.code.production"
                              | "flags.code.accessibility"
                              | "flags.ux.rationale"
                              | "flags.ux.bestPractices"
                              | "flags.ux.accessibility"
                              | "flags.promptEngineering.optimization"
                            return (
                              <FormField
                                key={flagKey}
                                control={form.control}
                                name={fieldName}
                                render={({ field }) => (
                                  <FormItem className="flex gap-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-1"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {
                                        categoryFlags[
                                          flagKey as keyof typeof categoryFlags
                                        ]
                                      }
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </fieldset>
        </div>
      </form>
      <div className="flex justify-end gap-3 sticky z-10 bottom-4">
        <Button type="submit">Generate prompt</Button>
      </div>
    </Form>
  )
}

export default PromptForm
