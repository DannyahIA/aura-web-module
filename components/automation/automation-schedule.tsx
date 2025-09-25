"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Lightbulb, Monitor, Thermometer } from "lucide-react"

interface ScheduleItem {
  id: string
  name: string
  time: string
  days: string[]
  action: "turn_on" | "turn_off" | "set_brightness" | "set_temperature"
  devices: string[]
  enabled: boolean
  icon: any
}

const mockSchedules: ScheduleItem[] = [
  {
    id: "1",
    name: "Morning Lights",
    time: "07:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    action: "turn_on",
    devices: ["Main Lights", "Bedroom Lights"],
    enabled: true,
    icon: Lightbulb,
  },
  {
    id: "2",
    name: "Work Computer",
    time: "08:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    action: "turn_on",
    devices: ["Main Computer"],
    enabled: true,
    icon: Monitor,
  },
  {
    id: "3",
    name: "Night Mode",
    time: "22:00",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    action: "turn_off",
    devices: ["Samsung TV", "Main Lights"],
    enabled: true,
    icon: Clock,
  },
  {
    id: "4",
    name: "Night Air Conditioner",
    time: "23:30",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    action: "turn_on",
    devices: ["Air Conditioner"],
    enabled: false,
    icon: Thermometer,
  },
]

export function AutomationSchedule() {
  const getActionText = (action: ScheduleItem["action"]) => {
    switch (action) {
      case "turn_on":
        return "Turn On"
      case "turn_off":
        return "Turn Off"
      case "set_brightness":
        return "Adjust Brightness"
      case "set_temperature":
        return "Adjust Temperature"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-montserrat">Scheduled Automations</CardTitle>
            <CardDescription>Automatic control based on time and days of the week</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`p-4 rounded-lg border transition-colors ${
                schedule.enabled ? "bg-muted/30" : "bg-muted/10 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      schedule.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <schedule.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{schedule.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{schedule.time}</span>
                      <span>•</span>
                      <span>{getActionText(schedule.action)}</span>
                      <span>•</span>
                      <span>{schedule.devices.length} device(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={schedule.enabled ? "default" : "secondary"}>
                    {schedule.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Days:</span>
                <div className="flex gap-1">
                  {schedule.days.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Devices:</span>
                <div className="flex flex-wrap gap-1">
                  {schedule.devices.map((device) => (
                    <Badge key={device} variant="secondary" className="text-xs">
                      {device}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {mockSchedules.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No automation configured</h3>
              <p className="text-muted-foreground mb-4">
                Create automations to control your devices automatically
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Automation
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
