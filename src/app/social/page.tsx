import { Metadata } from "next"
import { Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Social Hub",
  description: "Follow Ink2Screen LLC Publishing on social media.",
}

export default function SocialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Social Hub</h1>
      <Card>
        <CardContent className="py-16 text-center">
          <Globe className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Social media integration coming in Phase 2.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            YouTube, Instagram, TikTok, and Twitter feeds will be aggregated
            here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
