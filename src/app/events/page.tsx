import { Metadata } from "next"
import { Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events from Ink2Screen LLC Publishing.",
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Events</h1>
      <Card>
        <CardContent className="py-16 text-center">
          <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Event management is coming in Phase 2, powered by ASP.NET Core.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Book signings, author talks, and community events will be listed
            here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
