import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DifficultySelector() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="flex-1">
          <h2 className="text-[32px] md:text-[40px] font-bold text-zinc-800 font-bricolage-grotesque leading-tight mb-4">
            Find Your Perfect Trek
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl">
            Choose Your Trek Difficulty that best matches your fitness level. If you are unsure, our Genie can help you decide.
          </p>
        </div>

        {/* <button className="flex items-center gap-2 border border-[#4EC5C1] text-[#4EC5C1] rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#4EC5C1]/5 transition-colors whitespace-nowrap">
          <Sparkles className="w-4 h-4" />
          Ask Trek Genie
        </button> */}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[400px]">
        {/* Left Side: Difficulty Cards Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Link href="/treks?difficulty=easy" className="group rounded-4xl bg-[#E8F5E9] p-6 relative overflow-hidden flex flex-col justify-end min-h-[190px]">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E7D32]">Easy</h3>
            <p className="text-[#4CAF50] font-medium text-sm mt-1">Beginner Friendly</p>
          </Link>

          <Link href="/treks?difficulty=moderate" className="group rounded-4xl bg-[#FFF3E0] p-6 relative overflow-hidden flex flex-col justify-end min-h-[190px]">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#FF9800]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E65100]">Moderate</h3>
            <p className="text-[#FF9800] font-medium text-sm mt-1">Some Experience</p>
          </Link>

          <Link href="/treks?difficulty=difficult" className="group rounded-4xl bg-[#FFEBEE] p-6 relative overflow-hidden flex flex-col justify-end min-h-[190px]">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#F44336]" />
            </div>
            <h3 className="text-2xl font-bold text-[#C62828]">Difficult</h3>
            <p className="text-[#F44336] font-medium text-sm mt-1">Experienced Trekkers</p>
          </Link>

          <Link href="/treks?difficulty=pro" className="group rounded-4xl bg-[#F3E5F5] p-6 relative overflow-hidden flex flex-col justify-end min-h-[190px]">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#9C27B0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#6A1B9A]">Pro</h3>
            <p className="text-[#9C27B0] font-medium text-sm mt-1">Expert Mountaineers</p>
          </Link>
        </div>

        {/* Right Side: Compare Treks Card */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-zinc-900 rounded-4xl p-8 relative overflow-hidden flex flex-col justify-center">
          {/* Background Illustration (Placeholder for SVG) */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
          </div>

          <h3 className="text-[32px] font-bold text-white font-bricolage-grotesque leading-tight mb-4 relative z-10">
            Compare <br />
            Treks based <br />
            on stats
          </h3>
          <p className="text-zinc-400 text-sm mb-8 max-w-[80%] relative z-10">
            Not sure which one to pick? Use our compare tool to view similarities and differences head-to-head.
          </p>

          <Link href="/compare">
            <button className="bg-[#4EC5C1] hover:bg-[#3EB0AD] text-white rounded-xl px-8 py-3.5 text-sm font-bold transition-colors w-max relative z-10">
              Compare Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
