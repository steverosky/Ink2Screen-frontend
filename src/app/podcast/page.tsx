import type { Metadata } from "next"
import { getContent } from "@/lib/cms"
import { PodcastClient } from "./podcast-client"
import type { Track } from "./podcast-client"

export const metadata: Metadata = {
  title: "Podcast & Audio",
  description:
    "Listen to conversations, audiobook samples, and insights from Sterling R. Smith and the world of Ink2Screen LLC Publishing.",
  openGraph: {
    title: "Podcast & Audio — Ink2Screen LLC Publishing",
    description:
      "Listen to conversations, audiobook samples, and author insights from Ink2Screen LLC Publishing.",
    url: "https://www.ink2screenllc.com/podcast",
    images: [{ url: "/images/book-spotlight.png", width: 1200, height: 630, alt: "Ink2Screen Podcast" }],
  },
  alternates: { canonical: "https://www.ink2screenllc.com/podcast" },
}

const PLACEHOLDER_TRACKS: Track[] = [
  {
    title: "The Writing Process",
    description:
      "Sterling R. Smith breaks down his approach to storytelling, publishing, and engineering narratives that resonate.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    label: "PODCAST",
    duration: "3:28",
  },
  {
    title: "Raison D\u2019etre \u2014 Chapter 1",
    description:
      "Hear the opening chapter of the debut novel read by the author himself. An intimate first look.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    label: "AUDIOBOOK SAMPLE",
    duration: "4:11",
  },
  {
    title: "Ink & Indulgence: The Vision",
    description:
      "A behind-the-scenes conversation about the cultural event series and what it means for the community.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    label: "INTERVIEW",
    duration: "5:02",
  },
  {
    title: "On Screen Adaptation",
    description:
      "How Sterling approaches taking a story from page to screen, and what gets lost (and found) in translation.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    label: "PODCAST",
    duration: "6:44",
  },
  {
    title: "Raison D\u2019etre \u2014 Chapter 2",
    description: "The story continues. Dive deeper into the world of Ink2Screen\u2019s debut novel.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    label: "AUDIOBOOK SAMPLE",
    duration: "4:55",
  },
  {
    title: "Building Ink2Screen",
    description:
      "From concept to company \u2014 the origin story of Ink2Screen LLC Publishing told by its founder.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    label: "INTERVIEW",
    duration: "7:18",
  },
]

export default async function PodcastPage() {
  const content = await getContent("podcast")
  const a = content.podcast?.audio || {}

  const cmsTracks: Track[] = [
    { title: a.ep1_title, description: a.ep1_desc, src: a.ep1_src, duration: a.ep1_duration, label: a.ep1_label },
    { title: a.ep2_title, description: a.ep2_desc, src: a.ep2_src, duration: a.ep2_duration, label: a.ep2_label },
    { title: a.ep3_title, description: a.ep3_desc, src: a.ep3_src, duration: a.ep3_duration, label: a.ep3_label },
    { title: a.ep4_title, description: a.ep4_desc, src: a.ep4_src, duration: a.ep4_duration, label: a.ep4_label },
    { title: a.ep5_title, description: a.ep5_desc, src: a.ep5_src, duration: a.ep5_duration, label: a.ep5_label },
    { title: a.ep6_title, description: a.ep6_desc, src: a.ep6_src, duration: a.ep6_duration, label: a.ep6_label },
  ]

  const hasCmsContent = cmsTracks.some((t) => t.src)
  const tracks: Track[] = hasCmsContent
    ? cmsTracks
        .filter((t) => t.src)
        .map((t, i) => ({
          title: t.title || PLACEHOLDER_TRACKS[i]?.title || `Episode ${i + 1}`,
          description: t.description || PLACEHOLDER_TRACKS[i]?.description || "",
          src: t.src!,
          duration: t.duration || "",
          label: t.label || "PODCAST",
        }))
    : PLACEHOLDER_TRACKS

  return (
    <PodcastClient
      tracks={tracks}
      hasCmsContent={hasCmsContent}
      title={a.page_title || "LISTEN IN"}
      description={
        a.page_description ||
        "Conversations, audiobook samples, and insights from the world of Ink2Screen."
      }
      youtubeUrl={a.youtube_url || "https://youtube.com/@Ink2ScreenLLC"}
      spotifyUrl={a.spotify_url || ""}
      appleUrl={a.apple_url || ""}
    />
  )
}
