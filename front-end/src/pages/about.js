

import { useLanguage } from "@/i18n/LanguageContext";

function AboutUs() {
  const { t } = useLanguage();
  const values = [
    {
      title: t("about.missionTitle"),
      description: t("about.missionDesc"),
    },
    {
      title: t("about.visionTitle"),
      description: t("about.visionDesc"),
    },
  ];

  const highlights = [
    t("about.highlight1"),
    t("about.highlight2"),
    t("about.highlight3"),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">
            {t("about.eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("about.title")}
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("about.p1")}
          </p>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t("about.p2")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {values.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-3xl bg-gradient-to-b from-[#0b1f46] via-[#123c7a] to-[#0b1f46] p-6 text-slate-100 shadow-md sm:p-10 lg:p-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("about.whyTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {t("about.whyDesc")}
          </p>

          <ul className="mt-6 space-y-3">
            {highlights.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/10 p-3 text-sm sm:text-base"
              >
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-slate-100">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
