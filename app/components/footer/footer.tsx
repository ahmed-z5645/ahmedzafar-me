export default function Footer() {
  return (
    <footer className="w-full py-12 flex flex-col items-center justify-center border-t border-foreground/10">
        <p className="font-[family-name:var(--font-geist-mono)] text-body text-center text-foreground/[0.58]">
           All code written, produced and arranged by Ahmed Zafar
        </p>
        <p className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mb-4 italic text-accent text-center">
           (^^ Do you get the reference?)
        </p>
        <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
            © {new Date().getFullYear()} Ahmed Zafar
        </p>
    </footer>
  );
}