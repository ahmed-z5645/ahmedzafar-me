import Link from "next/link";

export default function Header() {
    return (
        <div id="header">
            <Link href="/">Experience</Link>
            <Link href="/fun">Fun</Link>
            <Link href="/about">About</Link>
            <a href="/Ahmed_Zafar_Resume.pdf">Resume</a>
        </div>
    )
}