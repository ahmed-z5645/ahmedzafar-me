import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({ project }) {
  // We define the card layout once so we don't duplicate code
  const CardContent = (
    <div className="
      flex flex-col overflow-hidden rounded-2xl 
      border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 
      transition-all hover:shadow-xl dark:hover:border-neutral-700 
      break-inside-avoid mb-6 /* Crucial for Masonry grids! */
    ">
      
      {/* MEDIA CONTAINER: No forced height or aspect ratio */}
      <div className="relative w-full bg-neutral-100 dark:bg-neutral-800">
        
        {project.video ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
          >
            <source src={project.video} type="video/mp4" />
          </video>
        ) : project.image ? (
          <Image 
            src={project.image} 
            alt={project.title}
            // Next.js requires these numbers, but CSS w-full/h-auto overrides 
            // them to let the browser scale it naturally.
            width={1200} 
            height={800} 
            className="w-full h-auto transition-transform duration-700 group-hover:scale-105 object-cover"
          />
        ) : null}

      </div>

      {/* TEXT CONTENT */}
      <div className="p-6">
        <h3 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>
      </div>
      
    </div>
  );

  // If the JSON includes a link, make the whole card clickable.
  // Otherwise, just render the static card.
  return project.link ? (
    <Link href={project.link} className="block group">
      {CardContent}
    </Link>
  ) : (
    <div className="group block">
      {CardContent}
    </div>
  );
}