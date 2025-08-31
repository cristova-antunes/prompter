import PromptForm from "./components/features/PromptForm"
import { ThemeProvider } from "./components/features/ThemeProvider"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./components/ui/card"
import { H1 } from "./components/ui/typography"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="flex flex-col items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <H1>Scaffold LLM prompt</H1>
          </CardHeader>
          <CardContent>
            <PromptForm />
          </CardContent>
          <CardFooter>
            <Button>Create</Button>
          </CardFooter>
        </Card>
      </main>
    </ThemeProvider>
  )
}

export default App
