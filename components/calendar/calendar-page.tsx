"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { CalendarGrid } from "./calendar-grid"
import { EventFilters } from "./event-filters"
import { AddEventDialog } from "./add-event-dialog"
import { usePageConfig } from "@/hooks/use-page-config"

const mockEvents = [
  {
    id: "1",
    title: "Work Meeting",
    date: "2024-01-15",
    time: "14:00",
    type: "work",
    calendar: "Work",
    color: "blue",
  },
  {
    id: "2",
    title: "Netflix Payment",
    date: "2024-01-15",
    time: "00:00",
    type: "bill",
    calendar: "Financial",
    color: "red",
    amount: 29.9,
  },
  {
    id: "3",
    title: "Uber Purchase",
    date: "2024-01-14",
    time: "18:30",
    type: "expense",
    calendar: "Financial",
    color: "orange",
    amount: 25.5,
  },
  {
    id: "4",
    title: "Medical Appointment",
    date: "2024-01-16",
    time: "10:00",
    type: "personal",
    calendar: "Personal",
    color: "green",
  },
  {
    id: "5",
    title: "Credit Card Payment",
    date: "2024-01-20",
    time: "00:00",
    type: "bill",
    calendar: "Financial",
    color: "red",
    amount: 1250.0,
  },
]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedFilters, setSelectedFilters] = useState({
    work: true,
    personal: true,
    bills: true,
    expenses: true,
  })
  const [showAddDialog, setShowAddDialog] = useState(false)

  usePageConfig({
    page: "calendar",
    title: "Calendar",
    subtitle: "Manage events, appointments and financial reminders"
  })

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const filteredEvents = mockEvents.filter((event) => {
    switch (event.type) {
      case "work":
        return selectedFilters.work
      case "personal":
        return selectedFilters.personal
      case "bill":
        return selectedFilters.bills
      case "expense":
        return selectedFilters.expenses
      default:
        return true
    }
  })

  const monthNames = [
    "January",
    "February",
    "March", 
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-cyan-500" />
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-cyan-500 hover:bg-cyan-600">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <EventFilters filters={selectedFilters} onFiltersChange={setSelectedFilters} />
          </div>
        </CardHeader>
        <CardContent>
          <CalendarGrid currentDate={currentDate} events={filteredEvents} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents
                .filter((event) => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${event.color}-500`} />
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString("en-US")} at {event.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.amount && (
                        <Badge variant="outline" className="text-red-600">
                          ${event.amount.toFixed(2)}
                        </Badge>
                      )}
                      <Badge variant="secondary">{event.calendar}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Bills to Pay</p>
                  <p className="text-sm text-red-600">3 pending bills</p>
                </div>
                <p className="text-lg font-bold text-red-600">$1,309.90</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Monthly Expenses</p>
                  <p className="text-sm text-orange-600">15 transactions</p>
                </div>
                <p className="text-lg font-bold text-orange-600">$2,450.30</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Income</p>
                  <p className="text-sm text-green-600">Salary + extras</p>
                </div>
                <p className="text-lg font-bold text-green-600">$8,500.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEventDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
