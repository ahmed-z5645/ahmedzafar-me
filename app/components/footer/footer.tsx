export default function Footer() {
  return (
    <footer className="w-full py-12 mt-8 flex flex-col items-center justify-center border-t border-[#32404F]/10 dark:border-[#FAFCFD]/10">
        <p className="font-[family-name:var(--font-geist-mono)] text-[15px] text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58]">
           All code written, produced and arranged by Ahmed Zafar 
        </p>
        <br />
        <p className="font-[family-name:var(--font-geist-mono)] text-[15px] text-[#32404F]/[0.58] dark:text-[#FAFCFD]/[0.58]">
            © {new Date().getFullYear()} Ahmed Zafar
        </p>
    </footer>
  );
}