import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { H2, H3 } from "../ui/typography"

function Snippets() {
  return (
    <Sheet>
      <SheetTrigger>Snippets</SheetTrigger>
      <SheetContent className="w-full max-w-[50vw]">
        <SheetHeader>
          <SheetTitle>
            <H2>Snippets</H2>
          </SheetTitle>
        </SheetHeader>
        <section className="grid gap-4 px-4">
          <H3>Code examples</H3>
          <p>
            Example-driven guidance: Provide an example of the desired output
            format.
          </p>
          <p className="font-bold">Syntax</p>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <div className="text-muted-foreground mb-2">CSS</div>
            <pre className="whitespace-pre-wrap">
              <span className="block">```</span>
              {`.overlay {
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
}`}
              <span className="block">```</span>
            </pre>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  )
}
export default Snippets
