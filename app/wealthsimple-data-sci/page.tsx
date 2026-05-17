import type { Metadata } from "next";
import VideoSubmission from "../components/video-submission";

// Paste the YouTube video ID here (the part after watch?v= or youtu.be/).
const YOUTUBE_ID = "S4v2lZL9yJ4";

// Paste the full video transcript here. Line breaks are preserved.
// Revealed on the page only when notes are toggled on (press N).
const TRANSCRIPT = `Hi, my name is Ahmed. Although I’ve shipped production code in a few different projects during my past co ops in industry, the project that I’m actually most proud of is the one that I built this past year as the software lead for the McMaster Biomedical Engineering Technical Team. The team is a little over fifty people. So, that means a lot of my job had to do with building the architecture and orchestrating different software sub teams throughout the organization. However, it was super important to me that I still owned a technical vertical. So, I took on what I thought to be the hardest one: a gate segmentation model for a wearable knee rehabilitation system that tracks how  ACL patients recovery at home.

I built a bidirectional temporal convolutional neural network that combines 8 channels of data. Now, I know that sounds really complicated, but all that it really means is I was able to build a neural network that analyzed data that changed with time, and the specific model architecture that I made looked at the past and the future to make its decisions. As a result, I was able to build a model with 96.5% accuracy. 

What the project really taught me, though, is how to work with messy sequential data. Raw data is super messy. Channels desync and gate cycles that we segment, and label, are not the same length between patients or even between steps. So getting a model that finds a real trend through all the noise and figuring out the difference between what's a trend and what's an artifact was the biggest data science skill that I learned and one that I'm excited to keep learning. 

In terms of impact, we ended up placing seventh nationally in the competition. And the judges mentioned that this segmentation model was a big part of why. More than that though, it taught me that owning a technical problem end-to-end while leading a team is where I do my best work. Thank you.`;

export const metadata: Metadata = {
  title: "Wealthsimple Data Science Submission — Ahmed Zafar",
  description: "Video submission for the Wealthsimple Data Science internship.",
  robots: { index: false, follow: false },
};

export default function WealthsimpleDataSci() {
  return (
    <VideoSubmission
      role="Data Science"
      youtubeId={YOUTUBE_ID}
      transcript={TRANSCRIPT}
    />
  );
}
