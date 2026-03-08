import Link from 'next/link';
import Image from 'next/image';

/**
 * ProjectCard Component
 * Displays a project title (Newsreader), description (Geist Mono 15px), 
 * and media (Image or Video) with sharp corners and tight vertical spacing.
 */
export default function ProjectCard({ project }: { project: Record<string, string | undefined> }) {
  const CardContent = (
    /* Column-break-inside-avoid is essential for the masonry layout in the parent */
    <div className="flex flex-col mb-8 break-inside-avoid group cursor-pointer">
      
      {/* MEDIA CONTAINER */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/10">
        {project.video ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            /* Removed: transition-transform duration-700 group-hover:scale-[1.02] */
            className="w-full h-auto object-cover"
          >
            <source src={project.video} type="video/mp4" />
          </video>
        ) : project.image ? (
          <Image
            src={project.image!}
            alt={project.title ?? ""}
            width={1200}
            height={800}
            /* Removed: transition-transform duration-700 group-hover:scale-[1.02] */
            className="w-full h-auto object-cover"
          />
        ) : (
          /* Fallback for projects without media */
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800" />
        )}

        {/* =========================================
            NEW HOVER OVERLAY
            ========================================= */}
        {/* 'bg-white/30' creates the translucent white shade. 
            'opacity-0 group-hover:opacity-100' handles the fade logic.
            'pointer-events-none' ensures clicks still register on the parent/link.
        */}
        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      </div>

      {/* TEXT CONTENT 
          mt-1.5 pulls the text up so it's practically touching the media.
      */}
      <div className="mt-1.5">
        <h3 className="font-[family-name:var(--font-newsreader)] text-card leading-[1.2] text-foreground">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-body leading-tight text-foreground/[0.58]">
            {project.description}
          </p>
        )}

        {project.note && (
          <div className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mt-1.5 italic text-accent">
            ↳ {project.note}
          </div>
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