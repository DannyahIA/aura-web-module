"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UpcomingBillsWidget() {
  const upcomingBills = [
    { name: "Electricity", amount: "R$ 245.00", date: "01/15", status: "pending" },
    { name: "Internet", amount: "R$ 89.90", date: "01/18", status: "pending" },
    { name: "Credit Card", amount: "R$ 1,250.00", date: "01/20", status: "pending" },
  ]

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-montserrat">Upcoming Bills</CardTitle>
        <CardDescription className="text-xs">Bills due in the next few days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingBills.map((bill, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">{bill.name}</p>
              <p className="text-xs text-muted-foreground">Due on {bill.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{bill.amount}</p>
              <Badge variant="destructive" className="text-xs">
                Pending
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  )
}
