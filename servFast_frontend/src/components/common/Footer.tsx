const footerCols = [
  { title: "Solutions", links: ["Enterprise", "Freelance", "Social", "Blog"] },
  { title: "Support",   links: ["Pricing", "Docs", "Guides", "API Status"] },
  { title: "Company",   links: ["About", "Blog", "Jobs", "Press"] },
  { title: "Legal",     links: ["Privacy", "Terms", "Cookie", "Licenses"] },
];

export default function Footer() {
  return (
    <footer className="bg-red-50 border-t border-red-100 px-16 pt-12 pb-0">
      <div className="grid grid-cols-5 gap-12 pb-10">
        <div className="col-span-2">
          <div className="font-extrabold text-xl text-red-700 mb-3">ServiceHub</div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            The premium marketplace for elite professionals. Quality, efficiency,
            and professional reliability at your fingertips.
          </p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title}>
            <div className="font-bold text-sm text-gray-900 mb-3">{col.title}</div>
            {col.links.map((link) => (
              <a key={link} href="#" className="block text-gray-400 text-sm mb-2 no-underline hover:text-red-700 transition-colors">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-red-100 py-4 text-center text-xs text-gray-300">
        © 2024 ServiceHub Inc. All rights reserved.
      </div>
    </footer>
  );
}