import PromptForm from "./components/features/PromptForm"
import { ThemeProvider } from "./components/features/ThemeProvider"

import { Card, CardContent, CardHeader } from "./components/ui/card"
import { H1 } from "./components/ui/typography"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="flex flex-col items-center justify-center h-screen container mx-auto">
        <Card className="w-container-responsive">
          <CardHeader>
            <H1>LLM prompt helper</H1>
          </CardHeader>
          <CardContent>
            <PromptForm />
          </CardContent>
        </Card>
      </main>
    </ThemeProvider>
  )
}

export default App
