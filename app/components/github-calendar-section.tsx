"use client";

import dynamic from "next/dynamic";

const GithubCalendar = dynamic(() => import("./github-calendar"), {
  ssr: false,
});

export default function GithubCalendarSection() {
  return <GithubCalendar />;
}
