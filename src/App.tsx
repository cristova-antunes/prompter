import PromptForm from "./components/features/PromptForm"
import Utilities from "./components/features/Utilities"
import { ThemeProvider } from "./components/features/ThemeProvider"

import { H1 } from "./components/ui/typography"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="container mx-auto px-4 lg:px-0 py-8 grid gap-6 lg:gap-8">
        <H1>LLM prompt helper</H1>
        <PromptForm />
        <Utilities />
      </main>
    </ThemeProvider>
  )
}

export default App
