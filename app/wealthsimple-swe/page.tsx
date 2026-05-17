import type { Metadata } from "next";
import VideoSubmission from "../components/video-submission";

// Paste the YouTube video ID here (the part after watch?v= or youtu.be/).
const YOUTUBE_ID = "EB_agytJCYU";

// Paste the full video transcript here. Line breaks are preserved.
// Revealed on the page only when notes are toggled on (press N).
const TRANSCRIPT = `Hi, my name is Ahmed, and the project I’m most proud of is definitely the one I was working on during my co op at Arche Biotechnologies. But, it’s for a bit of an unorthodox reason, we’ll get to that! 

The  system I was working on was patient monitoring for their medical device. The entire backend architecture was micro services and I was assigned a specific micro service handling patient records in MongoDB.

My internship project happened to do with database queries and making them more efficient. At the time, the read paths were slow and only getting slower as the patient count grew at the emerging start up. So, I redesigned the schema, and I restructured how records were indexed and retrieved.

This resulted in the average query length going down from 2.5 seconds to ~around 50 ms. But, what I’m proud of isn’t that statistic; it’s what happened next.

When I was profiling the system end-to-end, I noticed the real bottleneck for the user wasn't actually the database or the queries. It was at one point, but now the frontend dashboard was polling the backend over HTTP on a fixed interval. The data felt sluggish and slow even when the queries were running faster. It wasn't my ticket, but it was the thing that was actually hurting the experience.

So I scoped a fix, made a case to the team, and replaced the polling layer with WebSockets end-to-end. Data transfer latency dropped by 94%.

The takeaway for me was the work I was assigned and the work that actually mattered weren't the same thing. I am proud of myself as an engineer for realizing that caring for the person on the other end of the screen is what makes you a good engineer. Thank you!`;

export const metadata: Metadata = {
  title: "Wealthsimple Software Engineering Submission — Ahmed Zafar",
  description: "Video submission for the Wealthsimple Software Engineering internship.",
  robots: { index: false, follow: false },
};

export default function WealthsimpleSwe() {
  return (
    <VideoSubmission
      role="Software Engineering"
      youtubeId={YOUTUBE_ID}
      transcript={TRANSCRIPT}
    />
  );
}
