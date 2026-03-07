export default function Links() {
  return (
    <div className="font-[family-name:var(--font-geist-mono)] text-body leading-relaxed text-foreground/[0.58] space-y-8">
      <div className="hidden lg:block">
        <p>Press [N] to see notes</p>
        <p>
          Press [D] to{' '}
          <span className="dark:hidden">dim the lights</span>
          <span className="hidden dark:inline">turn on the lights</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <a href="https://linkedin.com/in/ahmed-z5645" className="hover:text-accent transition-colors">LinkedIn</a>
        <span className="opacity-50">•</span>
        <a href="mailto:ahmed.zafar5645@gmail.com" className="hover:text-accent transition-colors">Email</a>
        <span className="opacity-50">•</span>
        <a href="https://github.com/ahmed-z5645" className="hover:text-accent transition-colors">Github</a>
        <span className="opacity-50">•</span>
        <a href="https://music.apple.com/profile/_ahmed_" className="hover:text-accent transition-colors">Apple Music</a>
      </div>
    </div>
  );
}