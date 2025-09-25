"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export function AISuggestionsWidget() {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-montserrat">
          <Lightbulb className="h-4 w-4 text-accent" />
          AI Suggestions
        </CardTitle>
        <CardDescription className="text-xs">Personalized insights based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="text-sm font-semibold text-accent mb-1">💰 Detected Savings</h4>
            <p className="text-xs text-muted-foreground">
              You spent 15% less on delivery this month. Keep it up to save R$ 200!
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-1">📊 Spending Analysis</h4>
            <p className="text-xs text-muted-foreground">
              Your transportation expenses increased by 20%. Consider using public transport more often.
            </p>
          </div>
        </div>
      </CardContent>
    </>
  )
}
