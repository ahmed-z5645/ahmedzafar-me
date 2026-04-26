import jobs from "../../data/jobs.json";

export default function Info() {
  return (
    <div className="space-y-2 font-sans">
      <h1 className="lg:hidden font-[family-name:var(--font-geist-mono)] text-[20px]">
        Work Experience:
      </h1>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="relative isolate grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_2fr_3fr] gap-x-3 gap-y-0.5 lg:gap-4 lg:gap-y-0 items-start group transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] has-[:checked]:mb-8 has-[:checked]:mt-6"
        >
          {/* 1. Hidden Checkbox */}
          <input
            type="checkbox"
            id={`toggle-${job.id}`}
            className="accordion-toggle peer absolute opacity-0 pointer-events-none"
          />

          {/* 2. Frosted Glass Background */}
          <div className="absolute -inset-x-4 -inset-y-3 z-[-1] rounded-2xl bg-foreground/5 backdrop-blur-md border border-transparent [.show-notes_&]:bg-transparent [.show-notes_&]:backdrop-blur-none [.show-notes_&]:border-foreground/20 [.show-notes_&]:border-dashed opacity-0 peer-checked:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none" />
          {/* 3. Absolute Label */}
          <label
            htmlFor={`toggle-${job.id}`}
            className="absolute -inset-x-4 -inset-y-3 z-0 cursor-pointer"
            aria-label={`View details for ${job.role}`}
          />

          {/* Column 1: Date */}
          <div className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] group-hover:text-accent transition-colors pointer-events-none relative z-10">
            {job.date}
          </div>

          {/* Column 2: Company */}
          <div className="relative z-20 w-fit">
            <a
              href={job.link}
              className="cursor-pointer text-body text-foreground hover:text-accent transition-colors"
            >
              {job.company}
            </a>
          </div>

          {/* Column 3: Role & Chevron */}
          <div className="col-span-2 lg:col-span-1 mt-0.5 lg:mt-0 relative z-10 pointer-events-none flex justify-between items-center w-full lg:w-[90%] text-body text-foreground/[0.58] group-hover:text-accent transition-colors">
            <h4>{job.role}</h4>
            <span className="text-xs transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-has-[:checked]:rotate-180">
              ▼
            </span>
          </div>

          {/* Dropdown Container */}
          <div className="col-span-2 lg:col-start-3 lg:col-span-1 accordion-wrapper relative z-20 pointer-events-auto">
            <div className="accordion-content">
              <ul className="accordion-inner list-disc ml-4 space-y-0 text-foreground/[0.58] text-body leading-snug">
                {job.description.map((bulletPoint, index) => (
                  <li key={index} className="pl-1">
                    {bulletPoint}
                  </li>
                ))}
                {job.note && (
                  <li className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mt-1 italic text-accent pl-1">
                    {job.note}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}