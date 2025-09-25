"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

export function CalendarWidget() {
  const upcomingEvents = [
    { title: "Work meeting", time: "14:00", date: "Today" },
    { title: "Doctor appointment", time: "10:00", date: "Tomorrow" },
    { title: "Netflix payment", time: "00:00", date: "01/15" },
  ]

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-montserrat">
          <Calendar className="h-4 w-4" />
          Upcoming Events
        </CardTitle>
        <CardDescription className="text-xs">Schedule for the next days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {event.date} at {event.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  )
}
