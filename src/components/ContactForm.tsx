"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alert";

const defaultServices = [
  "Modern Kitchen Renovation",
  "Luxury Bathroom Remodeling",
  "Custom Architectural Woodwork",
  "Bespoke Wardrobes & Cabinetry",
  "Full Home Interior Renovation",
  "Hardwood Flooring & Parquet",
  "False Ceiling & Architectural Lighting",
  "Other / Bespoke Renovation Consultation",
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const isQuote = searchParams.get("type") === "quote";
  const quoteMessage = "I would like to get a quote for my home renovation project.";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: initialService,
    message: isQuote ? quoteMessage : "",
  });

  const [serviceOptions, setServiceOptions] = useState<string[]>(defaultServices);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Load published services from backend to populate dropdown options
  useEffect(() => {
    let isMounted = true;

    async function loadServiceOptions() {
      try {
        const data = await apiFetch("/api/services");
        if (isMounted && Array.isArray(data.services) && data.services.length > 0) {
          const names: string[] = data.services
            .filter((s: { status?: string }) => !s.status || s.status === "published")
            .map((s: { title?: string; name?: string }) => s.title || s.name || "")
            .filter(Boolean);

          if (names.length > 0) {
            const combined = Array.from(
              new Set([...names, "Other / Bespoke Renovation Consultation"])
            );
            setServiceOptions(combined);
          }
        }
      } catch {
        // Keep default services on error
      }
    }

    loadServiceOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    // Validate fields
    if (!formData.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setFormError("Please provide a valid email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setFormError("Please enter your contact phone number.");
      return;
    }

    if (!formData.service.trim()) {
      setFormError("Please select the service you are interested in.");
      return;
    }

    if (!formData.message.trim()) {
      setFormError("Please enter your message or project requirements.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        service: formData.service.trim(),
        message: formData.message.trim(),
      };

      const res = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        showSuccess(res.message || "Thank you! Your inquiry has been sent.");
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        throw new Error(res.message || "Failed to submit message.");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setFormError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(25,53,50,0.04)] hover:shadow-[0_12px_36px_rgba(25,53,50,0.08)] hover:border-accent/40 transition-all duration-500 animate-fade-up">
      {/* Header Area */}
      <div className="mb-6 border-b border-border pb-4 animate-fade-up">
        <h2 className="text-2xl font-semibold tracking-tight text-brand">
          Send Us a Message
        </h2>
        <p className="mt-1 text-sm text-muted">
          Fill out the details below and an architectural consultant will be in touch within 24 hours.
        </p>
      </div>

      {submitted && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900 animate-fade-up">
          <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-950">Inquiry Received!</p>
            <p className="mt-0.5 text-emerald-800">
              Thank you for reaching out to Dwellora. Our specialists have received your request and will contact you shortly.
            </p>
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 animate-fade-up">
          <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <p className="text-sm font-medium">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up delay-100" noValidate>
        {/* Name and Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email Address <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="hello@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Phone and Service */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="form-label">
              Phone Number <span className="text-accent">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+880 1712-345678"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="service" className="form-label">
              Service Interested <span className="text-accent">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              disabled={loading}
              required
              className="form-input cursor-pointer bg-surface"
            >
              <option value="" disabled>
                Select a service or project type
              </option>
              {serviceOptions.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="form-label">
            Your Message / Project Details <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about your home, location, timeline, preferred materials, or specific renovation goals..."
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
            required
            className="form-input resize-y"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary group w-full sm:w-auto shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <span>Sending Message...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Submit Inquiry</span>
                <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
