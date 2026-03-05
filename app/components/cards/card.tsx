import Link from 'next/link';
import Image from 'next/image';

/**
 * ProjectCard Component
 * Displays a project title (Newsreader), description (Geist Mono 15px), 
 * and media (Image or Video) with sharp corners and tight vertical spacing.
 */
export default function ProjectCard({ project }) {
  const CardContent = (
    /* Column-break-inside-avoid is essential for the masonry layout in the parent */
    <div className="flex flex-col mb-8 break-inside-avoid group cursor-pointer">
      
      {/* MEDIA CONTAINER 
          To round corners again: Add 'rounded-xl' to the className below.
      */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/10">
        {project.video ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            /* To round corners again: Add 'rounded-xl' to the className below. */
            className="w-full h-auto rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
          >
            <source src={project.video} type="video/mp4" />
          </video>
        ) : project.image ? (
          <Image 
            src={project.image} 
            alt={project.title}
            width={1200} 
            height={800} 
            /* To round corners again: Add 'rounded-xl' to the className below. */
            className="w-full h-auto rounded-xl transition-transform duration-700 group-hover:scale-[1.02] object-cover"
          />
        ) : (
          /* Fallback for projects without media */
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      {/* TEXT CONTENT 
          mt-1.5 pulls the text up so it's practically touching the media.
      */}
      <div className="mt-1.5">
        <h3 className="font-[family-name:var(--font-newsreader)] text-[18px] leading-[1.2] text-[#32404F] dark:text-[#FAFCFD]">
          {project.title}
        </h3>
        
        {project.description && (
          <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-[15px] leading-tight text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58]">
            {project.description}
          </p>
        )}
      </div>
      
    </div>
  );

  /* Wrap in Next.js Link if a URL is provided in the JSON data */
  return project.link ? (
    <Link href={project.link} className="block">
      {CardContent}
    </Link>
  ) : (
    <div className="block">
      {CardContent}
    </div>
  );
}