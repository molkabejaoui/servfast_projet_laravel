export default function TestimonialBanner() {
  return (
    <section className="bg-gray-900 text-white px-16 py-18 grid grid-cols-2 gap-18 items-center">
      <div>
        <div className="text-xs text-red-600 font-bold tracking-widest uppercase mb-4">Testimonials</div>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Built for the world's most ambitious teams
        </h2>
      </div>
      <div className="bg-white/5 rounded-2xl p-8 border-l-4 border-red-700">
        <p className="text-gray-300 text-sm leading-loose italic mb-6">
          "ServiceHub has completely transformed how we source enterprise talent.
          The vetting process is rigorous, and the speed at which we find top-tier
          experts is unparalleled. It's our go-to platform for every critical enterprise solution."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-700 flex items-center justify-center font-extrabold text-base shrink-0">T</div>
          <div>
            <div className="font-bold text-sm">Thomas Anderson</div>
            <div className="text-xs text-gray-400">CTO at Nexus Enterprises</div>
          </div>
        </div>
      </div>
    </section>
  );
}