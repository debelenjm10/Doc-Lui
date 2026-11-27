import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import consultation from "../../assets/consultation.jpg";
import surgery from "../../assets/surgery.jpg";
import grooming from "../../assets/pet-grooming.jpg";
import ultrasound from "../../assets/ultrasound.jpg";
import { createAppointmentId, readAppointments, writeAppointments } from "../appointments";
import { readAccess } from "../access";

const services = [
  { title: "Major and minor surgeries", image: surgery, alt: "Major and minor veterinary surgery" },
  { title: "Pet grooming and pet boarding", image: grooming, alt: "Pet grooming and boarding" },
  { title: "Check-ups and consultation", image: consultation, alt: "Pet check-up and consultation" },
  { title: "Laboratory, blood test, and ultrasound", image: ultrasound, alt: "Veterinary laboratory and ultrasound" }
];

const emptyForm = {
  ownerName: "",
  phone: "",
  email: "",
  petName: "",
  petType: "",
  service: "",
  appointmentDate: "",
  appointmentTime: "9:00 AM",
  notes: ""
};

function loadBookingState(editingId, selectedService, access) {
  try {
    const appointments = readAppointments();
    const existing = editingId ? appointments.find(item => item.id === editingId) : null;
    return {
      appointments,
      form: existing
        ? { ...emptyForm, ...existing }
        : {
          ...emptyForm,
          email: access?.role === "client" ? access.email : "",
          service: services.some(item => item.title === selectedService) ? selectedService : ""
        },
      error: ""
    };
  } catch (error) {
    return {
      appointments: [],
      form: { ...emptyForm, service: services.some(item => item.title === selectedService) ? selectedService : "" },
      error: `Unable to load saved appointments: ${error.message}`
    };
  }
}

function todayString() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function RequiredMarker({ value }) {
  return value.trim() ? null : <span className="required-marker" aria-hidden="true">*</span>;
}

function PhoneRequiredMarker({ value }) {
  return /^09\d{9}$/.test(value) ? null : <span className="required-marker" aria-hidden="true">*</span>;
}

function NotesRequiredMarker({ value }) {
  return value.trim().length >= 10 ? null : <span className="required-marker" aria-hidden="true">*</span>;
}

function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editingId = searchParams.get("edit");
  const requestedService = searchParams.get("service");
  const access = readAccess();
  const [initialState] = useState(() => loadBookingState(editingId, requestedService, access));
  const [appointments, setAppointments] = useState(initialState.appointments);
  const [form, setForm] = useState(initialState.form);
  const [storageError, setStorageError] = useState(initialState.error);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const selectedService = services.find(item => item.title === form.service) ?? services[2];

  useEffect(() => {
    if (!saved) return undefined;
    const timer = window.setTimeout(() => navigate("/requests.html"), 700);
    return () => window.clearTimeout(timer);
  }, [saved, navigate]);

  const updateField = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    setFormError("");
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!/^09\d{9}$/.test(form.phone)) {
      setFormError("Enter exactly 11 digits starting with 09.");
      event.currentTarget.elements.phone.focus();
      return;
    }
    if (form.notes.trim().length < 10) {
      setFormError("Please enter at least 10 characters in Notes.");
      event.currentTarget.elements.notes.focus();
      return;
    }

    const id = editingId || createAppointmentId();
    const previous = appointments.find(item => item.id === id);
    const record = {
      ...form,
      email: form.email.trim().toLowerCase(),
      id,
      status: previous?.status || "Pending",
      createdAt: previous?.createdAt || new Date().toISOString()
    };
    const updatedAppointments = editingId
      ? appointments.map(item => item.id === id ? record : item)
      : [...appointments, record];

    try {
      writeAppointments(updatedAppointments);
      setAppointments(updatedAppointments);
      setStorageError("");
      setSaved(true);
    } catch (error) {
      setStorageError(`Unable to save the appointment: ${error.message}`);
    }
  };

  const inputClass = "booking-input mt-2 w-full rounded-xl border px-3 py-3 font-normal outline-none focus:border-green-500";

  return (
    <main className="booking-page mx-auto max-w-6xl px-5 py-9">
      <div className="booking-card grid overflow-hidden rounded-[2rem] soft-shadow lg:grid-cols-[.72fr_1.28fr]">
        <aside className="relative hidden min-h-[560px] overflow-hidden lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={selectedService.image}
            alt={selectedService.alt}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-950/20 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">Appointment request</span>
            <h2 className="mt-3 text-3xl font-black">Let us care for your pet.</h2>
            <p className="mt-2 text-sm leading-6 text-green-50">
              Share the details below. Your request will be saved and available in your appointment list.
            </p>
          </div>
          {saved && (
            <div className="booking-side-loader" role="status" aria-live="polite">
              <div className="booking-spinner" />
              <p className="text-sm font-bold">Saving appointment...</p>
            </div>
          )}
        </aside>

        <section className="p-6 sm:p-8">
          <p className="booking-eyebrow text-xs font-black uppercase tracking-[.2em]">Online booking</p>
          <h1 className="booking-title mt-2 text-3xl font-black">
            {editingId ? "Update appointment" : "Schedule a visit"}
          </h1>
          <p className="booking-help mt-2 text-sm">Fields marked with * are required.</p>

          {storageError && (
            <p className="booking-error mt-4 rounded-xl px-4 py-3 text-sm font-bold" role="alert">
              {storageError}
            </p>
          )}
          {formError && (
            <p className="booking-error mt-4 rounded-xl px-4 py-3 text-sm font-bold" role="alert">
              {formError}
            </p>
          )}
          {saved && (
            <p className="booking-success mt-4 rounded-xl px-4 py-3 text-sm font-bold" role="status">
              Appointment saved successfully!
            </p>
          )}

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm font-bold">
              Owner name <RequiredMarker value={form.ownerName} />
              <input className={inputClass} name="ownerName" placeholder="Juan Dela Cruz" value={form.ownerName} onChange={updateField} required />
            </label>
            <label className="text-sm font-bold">
              Phone number <PhoneRequiredMarker value={form.phone} />
              <input
                className={inputClass}
                name="phone"
                type="tel"
                placeholder="09XX XXX XXXX"
                pattern="09[0-9]{9}"
                title="Enter exactly 11 digits starting with 09"
                value={form.phone}
                onChange={updateField}
                required
              />
            </label>
            <label className="text-sm font-bold">
              Email address <RequiredMarker value={form.email} />
              <input
                className={inputClass}
                name="email"
                type="email"
                placeholder="juan.delacruz@gmail.com"
                value={form.email}
                onChange={updateField}
                readOnly={access?.role === "client"}
                required
              />
            </label>
            <label className="text-sm font-bold">
              Pet name <RequiredMarker value={form.petName} />
              <input className={inputClass} name="petName" placeholder="Example: Brownie" value={form.petName} onChange={updateField} required />
            </label>
            <label className="text-sm font-bold">
              Pet type <RequiredMarker value={form.petType} />
              <select className={inputClass} name="petType" value={form.petType} onChange={updateField} required>
                <option value="" disabled>Select</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-sm font-bold">
              Service <RequiredMarker value={form.service} />
              <select className={inputClass} name="service" value={form.service} onChange={updateField} required>
                <option value="" disabled>Select a service</option>
                {services.map(service => <option key={service.title}>{service.title}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-bold">
                Date <RequiredMarker value={form.appointmentDate} />
                <input className={inputClass} name="appointmentDate" type="date" min={todayString()} value={form.appointmentDate} onChange={updateField} required />
              </label>
              <label className="text-sm font-bold">
                Time <RequiredMarker value={form.appointmentTime} />
                <select className={inputClass} name="appointmentTime" value={form.appointmentTime} onChange={updateField} required>
                  {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map(time => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-sm font-bold sm:col-span-2">
              Notes <NotesRequiredMarker value={form.notes} />
              <textarea
                className={inputClass}
                name="notes"
                rows="3"
                minLength="10"
                placeholder="Symptoms, grooming preferences, or special requests..."
                value={form.notes}
                onChange={updateField}
                required
              />
            </label>

            <div className="flex items-center gap-3 sm:col-span-2">
              <button
                className="booking-submit rounded-xl px-5 py-3 text-sm font-bold disabled:opacity-70"
                type="submit"
                disabled={saved || Boolean(storageError)}
              >
                {saved ? "Request saved" : editingId ? "Save changes" : "Request appointment"}
              </button>
              <Link className="booking-requests-link text-sm font-bold" to="/requests.html">View requests</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Booking;
