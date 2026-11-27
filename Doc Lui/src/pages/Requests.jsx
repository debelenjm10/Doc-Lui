import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import cat from "../../assets/cat.jpg";
import dog from "../../assets/dog.jpg";
import { readAppointments, writeAppointments } from "../appointments";
import { readAccess } from "../access";

function loadRequests() {
  try {
    return { appointments: readAppointments(), error: "" };
  } catch (error) {
    return { appointments: [], error: `Unable to load saved appointments: ${error.message}` };
  }
}

function todayString() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function Requests() {
  const access = readAccess();
  const [initialState] = useState(loadRequests);
  const [appointments, setAppointments] = useState(initialState.appointments);
  const [error, setError] = useState(initialState.error);
  const [search, setSearch] = useState("");
  const [rescheduleTimes, setRescheduleTimes] = useState({});
  if (!access) return <Navigate to="/login.html" replace />;
  const isAdmin = access.role === "admin";
  const roleAppointments = isAdmin
    ? appointments
    : appointments.filter(item => String(item.email ?? "").trim().toLowerCase() === access.email);
  const visibleAppointments = roleAppointments.filter(item =>
    `${item.ownerName ?? ""} ${item.petName ?? ""} ${item.petType ?? ""} ${item.service ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateAppointment = (id, changes) => {
    const next = appointments.map(item => item.id === id ? { ...item, ...changes } : item);
    try {
      writeAppointments(next);
      setAppointments(next);
      setError("");
    } catch (saveError) {
      setError(`Unable to update the appointment: ${saveError.message}`);
    }
  };

  const deleteAppointment = id => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this appointment?")) return;
    const next = appointments.filter(item => item.id !== id);
    try {
      writeAppointments(next);
      setAppointments(next);
      setError("");
    } catch (saveError) {
      setError(`Unable to delete the appointment: ${saveError.message}`);
    }
  };

  const decideAppointment = (appointment, status) => {
    const message = status === "Accepted"
      ? "Your appointment request has been accepted."
      : "This appointment request could not be accepted. Please contact the clinic to choose another time.";
    updateAppointment(appointment.id, { status, adminMessage: message });
  };

  const rescheduleAppointment = appointment => {
    const slot = rescheduleTimes[appointment.id] ?? {
      date: appointment.appointmentDate,
      time: appointment.appointmentTime
    };
    if (!slot.date || !slot.time || slot.date < todayString()) {
      setError("Choose a valid date and time before rescheduling.");
      return;
    }
    if (slot.date === appointment.appointmentDate && slot.time === appointment.appointmentTime) {
      setError("Choose a different date or time before rescheduling.");
      return;
    }
    updateAppointment(appointment.id, {
      appointmentDate: slot.date,
      appointmentTime: slot.time,
      status: "Rescheduled",
      adminMessage: "The clinic has rescheduled your visit to the date and time shown."
    });
  };

  if (!isAdmin && !access.email) return <Navigate to="/login.html" replace />;

  return (
    <main className="requests-page mx-auto w-full max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="requests-eyebrow text-xs font-black uppercase tracking-[.2em]">
            {isAdmin ? "Admin / owner" : "Client portal"}
          </p>
          <h1 className="requests-title mt-2 text-3xl font-black">
            {isAdmin ? "Appointment requests" : "My appointment requests"}
          </h1>
        </div>
        <input
          className="requests-search w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-green-500 sm:w-64"
          placeholder="Search pet, owner, service"
          value={search}
          onChange={event => setSearch(event.target.value)}
          aria-label="Search appointments"
        />
      </div>

      {error && <p className="requests-error mt-5 rounded-xl px-4 py-3 text-sm font-bold" role="alert">{error}</p>}

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {visibleAppointments.map((appointment, index) => {
          const petType = String(appointment.petType ?? "").trim().toLowerCase();
          const petImage = petType === "cat" ? cat : petType === "dog" ? dog : null;
          const status = appointment.status || "Pending";
          const rescheduleSlot = rescheduleTimes[appointment.id] ?? {
            date: appointment.appointmentDate,
            time: appointment.appointmentTime
          };
          return (
            <article
              className="request-card overflow-hidden rounded-2xl border soft-shadow"
              key={appointment.id}
            >
              <div className="grid sm:grid-cols-[120px_1fr]">
                {petImage ? (
                  <img
                    className="request-pet-image h-36 w-full object-cover sm:h-full sm:min-h-[220px]"
                    src={petImage}
                    alt={`${petType} named ${appointment.petName}`}
                  />
                ) : (
                  <div className="request-pet-placeholder flex h-36 items-center justify-center text-4xl sm:h-full sm:min-h-[220px]" aria-label={`${appointment.petType} pet`}>
                    🐾
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="request-service text-xs font-bold uppercase tracking-wider">{appointment.service}</p>
                      <h2 className="request-card-title mt-1 text-lg font-bold">Request #{index + 1}</h2>
                    </div>
                    <span className={`request-status status-${status.toLowerCase()} rounded-full px-2.5 py-1 text-xs font-bold`}>{status}</span>
                  </div>
                  <div className="request-details mt-2 space-y-1 text-sm">
                    <p><strong>Owner:</strong> {appointment.ownerName}</p>
                    <p><strong>Pet:</strong> {appointment.petName}</p>
                    <p><strong>Pet type:</strong> {appointment.petType}</p>
                    <p>{appointment.appointmentDate} at {appointment.appointmentTime}</p>
                    {isAdmin && <p><strong>Email:</strong> {appointment.email}</p>}
                    {appointment.notes && (
                      <p className="request-notes mt-2 rounded-lg px-3 py-2 leading-5">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  {!isAdmin && appointment.adminMessage && (
                    <p className="request-client-message mt-3 rounded-lg px-3 py-2 text-sm" role="status">
                      {appointment.adminMessage}
                    </p>
                  )}
                  {isAdmin ? (
                    <div className="request-admin-actions mt-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="request-accept rounded-lg px-3 py-2 text-xs font-bold"
                          type="button"
                          onClick={() => decideAppointment(appointment, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="request-decline rounded-lg px-3 py-2 text-xs font-bold"
                          type="button"
                          onClick={() => decideAppointment(appointment, "Declined")}
                        >
                          Decline
                        </button>
                        <button
                          className="request-delete rounded-lg px-3 py-2 text-xs font-bold"
                          type="button"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                        <label className="text-xs font-bold">
                          New date
                          <input
                            className="request-reschedule-input mt-1 w-full rounded-lg border px-2 py-2"
                            type="date"
                            min={todayString()}
                            value={rescheduleSlot.date ?? ""}
                            onChange={event => setRescheduleTimes(current => ({
                              ...current,
                              [appointment.id]: { ...rescheduleSlot, date: event.target.value }
                            }))}
                          />
                        </label>
                        <label className="text-xs font-bold">
                          New time
                          <select
                            className="request-reschedule-input mt-1 w-full rounded-lg border px-2 py-2"
                            value={rescheduleSlot.time ?? ""}
                            onChange={event => setRescheduleTimes(current => ({
                              ...current,
                              [appointment.id]: { ...rescheduleSlot, time: event.target.value }
                            }))}
                          >
                            {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map(time => (
                              <option key={time}>{time}</option>
                            ))}
                          </select>
                        </label>
                        <button
                          className="request-reschedule rounded-lg px-3 py-2 text-xs font-bold"
                          type="button"
                          onClick={() => rescheduleAppointment(appointment)}
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ) : (
                    appointment.status === "Pending" || !appointment.status ? (
                      <div className="mt-4">
                        <Link
                          className="request-edit rounded-lg border px-3 py-2 text-xs font-bold hover:border-green-500"
                          to={`/booking.html?edit=${encodeURIComponent(appointment.id)}`}
                        >
                          Edit request
                        </Link>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {visibleAppointments.length === 0 && !error && (
          <div className="requests-empty rounded-2xl border border-dashed p-8 text-center md:col-span-2">
            <p className="requests-empty-title font-bold">
              {roleAppointments.length ? "No matching appointments" : "No appointments yet"}
            </p>
            <p className="requests-empty-message mt-1 text-sm">
              {roleAppointments.length
                ? "Try a different search."
                : isAdmin
                  ? "Client booking requests will appear here."
                  : "Book a visit with this email address to see your requests here."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Requests;
