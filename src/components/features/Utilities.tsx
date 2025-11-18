import z from "zod"
import { useForm } from "react-hook-form"
import { Card } from "../ui/card"
import { H2, H3 } from "../ui/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

export default function Utilities() {
  return (
    <>
      <H2>Utilities</H2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <H3>Code block</H3>
          <CodeBlock />
        </Card>
        <Card className="p-6">
          <H3>Tag block</H3>
          <TagBlock />
        </Card>
      </div>
    </>
  )
}

const codeSchema = z.object({
  tag: z.string(),
  content: z.string(),
})

function CodeBlock() {
  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      tag: "",
      content: "",
    },
  })

  async function onSubmit(data: z.infer<typeof codeSchema>) {
    const { tag, content } = data

    const output = `\`\`\`${tag}
${content}
\`\`\``

    try {
      await navigator.clipboard.writeText(output)
      toast.success("Code block copied to the clipboard")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please check logs in your console")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 h-full grid-rows-[1fr_auto]"
        id="code-form"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className="contents">
                <FormControl>
                  <Input placeholder="CSS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="contents">
                <FormControl>
                  <Textarea
                    placeholder={`.overlay {
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-right">
          <Button variant={"link"} type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  )
}

function TagBlock() {
  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      tag: "",
      content: "",
    },
  })

  async function onSubmit(data: z.infer<typeof codeSchema>) {
    const { tag, content } = data

    const output = `<${tag}>
${content}
</${tag}>
`

    try {
      await navigator.clipboard.writeText(output)
      toast.success("Tag block copied to the clipboard")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please check logs in your console")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-rows-[1fr_auto] h-full"
        id="tag-form"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className="contents">
                <FormControl>
                  <Input placeholder="article-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="contents">
                <FormControl>
                  <Textarea
                    placeholder={`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam modi qui sequi quis at, amet ipsam nemo aut eveniet beatae consectetur asperiores esse quia repudiandae quaerat! Temporibus accusantium voluptate quod!}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-right">
          <Button variant={"link"} type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  )
}
