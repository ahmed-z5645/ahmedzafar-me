import jobs from "../../data/jobs.json";

export default function Info() {
  return(
    <div className="space-y-8 font-sans">
      <h1 className="lg:hidden font-[family-name:var(--font-geist-mono)] text-[20px]">Work Experience:</h1>
      {jobs.map((job) => (
        <div key={job.id} className="grid grid-cols-1 lg:grid-cols-[100px_220px_1fr] gap-4 md:gap-6 items-start">
          
          {/* Column 1: Date */}
          <div className="font-[family-name:var(--font-geist-mono)] text-[15px] text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58]">
            {job.date}
            {job.note && <div className="font-[family-name:var(--font-geist-sans)] note-annotation text-[15px] mt-1 italic text-[#1E5B1A]">{job.note}</div>}
          </div>
          
          {/* Column 2: Company */}
          <div>
            <h3 className="text-[15px] text-[#32404F] dark:text-[#FAFCFD]">
              {job.company}
            </h3>
          </div>

          {/* Column 3: Role & Description */}
          <div>
            <h4 className="text-[15px] text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58]">
              {job.role}
            </h4>
            <ul className="list-disc ml-5 mt-1 space-y-0 text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58] text-[15px] leading-snug">
              {job.description.map((bulletPoint, index) => (
                <li key={index} className="pl-1">{bulletPoint}</li>
              ))}
            </ul>
          </div>

        </div>
      ))}
    </div>
  )
}