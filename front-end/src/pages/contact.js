import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";

function ContactUs() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        name: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitState({
      isSubmitting: true,
      success: "",
      error: "",
    });

    try {
      const response = await axios.post("/api/contactus/sendContact", form);

      console.log("Server response:", response.data);

      setSubmitState({
        isSubmitting: false,
        success: "Your message has been sent successfully.",
        error: "",
      });

      setForm({
        name: user ? user.username || "" : "",
        email: user ? user.email || "" : "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Submission error:",
        error.response ? error.response.data : error.message
      );
      setSubmitState({
        isSubmitting: false,
        success: "",
        error: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
    <Head>
      <title>Contact Us - Kemet Travel</title>
      <meta name="description" content="Get in touch with Kemet Travel for personalized travel recommendations and support." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
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
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
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
                    value={user ? user.email : form.email}
                    disabled={user && user.email ? true : false} 
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
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
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
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
    </>
  );
}

export default ContactUs;
