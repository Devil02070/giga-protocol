'use client'
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
export default function Footer (){
    return(
        <section className="py-5 border-t border-zinc-800 text-zinc-400 bg-black">
            <div className="container m-auto">
                <p className="text-center text-sm">@copyright-2025 | Giga Protocol</p>
                <div className="socials flex items-center justify-center gap-5 mt-4">
                <FaXTwitter className="border border-zinc-400 rounded-full p-1 text-2xl hover:text-white hover:border-white cursor-pointer"/>
                <FaDiscord className="border border-zinc-400 rounded-full p-1 text-2xl hover:text-white hover:border-white cursor-pointer"/>
                </div>
            </div>
        </section>
    )
}