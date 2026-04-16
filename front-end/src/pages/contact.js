import { useState } from "react";

function ContactUs() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    success: "",
    error: "",
  });

  const contactEmail = "kemet3003@gmail.com";
  const facebookPageUrl = "https://www.facebook.com/profile.php?id=61584789544926";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildMailtoLink = () => {
    const mailSubject = encodeURIComponent(
      form.subject || `New Contact Message from ${form.fullName || "Website Visitor"}`,
    );
    const mailBody = encodeURIComponent(
      `Name: ${form.fullName}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );

    return `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitState({
      isSubmitting: true,
      success: "",
      error: "",
    });

    try {
      const mailtoUrl = buildMailtoLink();
      window.location.href = mailtoUrl;

      setSubmitState({
        isSubmitting: false,
        success: "Your email draft has been prepared successfully.",
        error: "",
      });
    } catch (error) {
      setSubmitState({
        isSubmitting: false,
        success: "",
        error: "Something went wrong while opening your email client.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8 lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">
              Contact Us
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Let’s build your next Egypt journey.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Share your inquiry and our team will guide you with personalized recommendations.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                <span>Direct Email</span>
                <span className="text-slate-500">{contactEmail}</span>
              </div>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50"
              >
                <span>Gmail DM</span>
                <span className="text-slate-500">Open Gmail</span>
              </a>

              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50"
              >
                <span>Facebook Page</span>
                <span className="text-slate-500">Send a message</span>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Fill in the form and submit. We will respond as soon as possible.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  placeholder="Write your message..."
                />
              </div>

              {submitState.success && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {submitState.success}
                </p>
              )}

              {submitState.error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submitState.error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitState.isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitState.isSubmitting ? "Submitting..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;
