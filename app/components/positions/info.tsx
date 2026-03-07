import jobs from "../../data/jobs.json";

export default function Info() {
  return(
    <div className="space-y-8 font-sans">
      <h1 className="lg:hidden font-[family-name:var(--font-geist-mono)] text-[20px]">Work Experience:</h1>
      {jobs.map((job) => (
        <div key={job.id} className="grid grid-cols-1 lg:grid-cols-[100px_220px_1fr] gap-4 md:gap-6 items-start">

          {/* Column 1: Date */}
          <div className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
            {job.date}
          </div>

          {/* Column 2: Company */}
          <div>
            <a href={job.link} className="cursor-pointer text-body text-foreground hover:text-accent transition-colors">
              {job.company}
            </a>
          </div>

          {/* Column 3: Role & Description */}
          <div>
            <h4 className="text-body text-foreground/[0.58]">
              {job.role}
            </h4>
            <ul className="list-disc ml-5 mt-1 space-y-0 text-foreground/[0.58] text-body leading-snug">
              {job.description.map((bulletPoint, index) => (
                <li key={index} className="pl-1">{bulletPoint}</li>
              ))}
              {job.note && <li className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mt-1 italic text-accent pl-1">{job.note}</li>}
            </ul>
          </div>

        </div>
      ))}
    </div>
  )
}