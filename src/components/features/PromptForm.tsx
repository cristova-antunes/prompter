import {
  flags,
  generateJSONPrompt,
  generatePrompt,
  role as roleList,
} from "@/lib/prompt"
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
import type { UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "../ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { encode } from "@toon-format/toon"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const defaultRoleOptions: ComboboxOptions[] = roleList.map((role) => {
  return {
    value: role,
    label: role,
  }
})

const exportOptions = ["xml", "json", "toon"] as const

type ExportMode = (typeof exportOptions)[number]
const defaultExportMode: ExportMode = "toon"

function isExportMode(value: unknown): value is ExportMode {
  return (
    typeof value === "string" &&
    (exportOptions as readonly string[]).includes(value)
  )
}

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  roleExpertise: z.string().optional(),
  context: z.string().min(1, "Context is required"),
  task: z.string().min(1, "Task is required"),
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
      onlyReturnCode: z.boolean(),
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
  exportMode: z.enum(exportOptions),
})

const PromptForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      roleExpertise: "",
      context: "",
      task: "",
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
          onlyReturnCode: false,
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
      exportMode: defaultExportMode,
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
      toneOfVoice,
      format,
      flags,
      exportMode,
    } = data

    let output = ""

    if (exportMode === "json") {
      const data = generateJSONPrompt({
        role: {
          role,
          expertise: roleExpertise,
        },
        context,
        task,
        constraints,
        toneOfVoice,
        format,
        flags,
      })

      output = JSON.stringify(data, null, 2)
    } else if (exportMode === "toon") {
      const data = generateJSONPrompt({
        role: {
          role,
          expertise: roleExpertise,
        },
        context,
        task,
        constraints,
        toneOfVoice,
        format,
        flags,
      })

      output = encode(data)
    } else {
      output = generatePrompt({
        role: {
          role,
          expertise: roleExpertise,
        },
        context,
        task,
        constraints,
        toneOfVoice,
        format,
        flags,
      })
    }

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
        className="rounded-xl shadow-sm p-4 bg-form-foreground grid gap-4 border"
        id="prompt-form"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_clamp(250px,25vw,360px)] ">
          <MainFormCard
            form={form}
            defaultRoleOptions={defaultRoleOptions}
            handleSelect={handleSelect}
            handleAppendGroup={handleAppendGroup}
          />

          <div className="space-y-6">
            <FlagsCard form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-6 sticky z-10 bottom-4">
          <ToggleGroup
            type="single"
            className="border"
            defaultValue={defaultExportMode}
            aria-label="Export Mode"
            onValueChange={(value) => {
              if (isExportMode(value)) {
                setValue("exportMode", value)
              }
            }}
          >
            <ToggleGroupItem value="json">JSON</ToggleGroupItem>
            <ToggleGroupItem value="toon">Toon</ToggleGroupItem>
            <ToggleGroupItem value="xml">XML</ToggleGroupItem>
          </ToggleGroup>
          <Button type="submit">Generate prompt</Button>
        </div>
      </form>
    </Form>
  )
}

function MainFormCard({
  form,
  defaultRoleOptions,
  handleSelect,
  handleAppendGroup,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
  defaultRoleOptions: ComboboxOptions[]
  handleSelect: (option: ComboboxOptions) => void
  handleAppendGroup: (label: ComboboxOptions["label"]) => void
}) {
  return (
    <Card>
      <CardContent>
        <div className="grid gap-5">
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
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-label="task">Task</FormLabel>
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
                <FormLabel aria-label="Tone of Voice">Tone of Voice</FormLabel>
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
  )
}

function FlagsCard({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) {
  return (
    <fieldset>
      <Card>
        <CardContent>
          <div className="mb-2">
            <legend className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Flags
            </legend>
          </div>
          <Accordion type="multiple" defaultValue={[...Object.keys(flags)]}>
            {Object.entries(flags).map(([categoryKey, categoryObj]) => {
              const label =
                "label" in categoryObj
                  ? categoryObj.label
                  : "labels" in categoryObj
                  ? categoryObj.labels
                  : categoryKey
              const flagEntries = Object.entries(categoryObj.flags)
              return (
                <AccordionItem value={categoryKey} key={categoryKey}>
                  <AccordionTrigger className="capitalize">
                    {label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {flagEntries.map(([flagKey, flagObj]) => {
                        const validFieldNames = [
                          "flags.general.chainOfThought",
                          "flags.general.assumptions",
                          "flags.general.options",
                          "flags.code.production",
                          "flags.code.accessibility",
                          "flags.code.onlyReturnCode",
                          "flags.ux.rationale",
                          "flags.ux.bestPractices",
                          "flags.ux.accessibility",
                          "flags.promptEngineering.optimization",
                        ] as const
                        const fieldName =
                          `flags.${categoryKey}.${flagKey}` as (typeof validFieldNames)[number]
                        if (!validFieldNames.includes(fieldName)) return null
                        return (
                          <FormField
                            key={flagKey}
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                              <FormItem className="flex gap-3 items-center">
                                <FormControl>
                                  <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {flagObj.label || flagKey}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </fieldset>
  )
}

export default PromptForm
