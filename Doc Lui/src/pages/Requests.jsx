import { useState } from "react";
import { Link } from "react-router-dom";
import cat from "../../assets/cat.jpg";
import dog from "../../assets/dog.jpg";
import { readAppointments, writeAppointments } from "../appointments";

function loadRequests() {
  try {
    return { appointments: readAppointments(), error: "" };
  } catch (error) {
    return { appointments: [], error: `Unable to load saved appointments: ${error.message}` };
  }
}

function Requests() {
  const [initialState] = useState(loadRequests);
  const [appointments, setAppointments] = useState(initialState.appointments);
  const [error, setError] = useState(initialState.error);
  const [search, setSearch] = useState("");
  const visibleAppointments = appointments.filter(item =>
    `${item.ownerName ?? ""} ${item.petName ?? ""} ${item.petType ?? ""} ${item.service ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const deleteAppointment = id => {
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

  return (
    <main className="requests-page mx-auto w-full max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="requests-eyebrow text-xs font-black uppercase tracking-[.2em]">Manage requests</p>
          <h1 className="requests-title mt-2 text-3xl font-black">Appointments</h1>
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
                    <span className="request-status rounded-full px-2.5 py-1 text-xs font-bold">{appointment.status}</span>
                  </div>
                  <div className="request-details mt-2 space-y-1 text-sm">
                    <p><strong>Owner:</strong> {appointment.ownerName}</p>
                    <p><strong>Pet:</strong> {appointment.petName}</p>
                    <p><strong>Pet type:</strong> {appointment.petType}</p>
                    <p>{appointment.appointmentDate} at {appointment.appointmentTime}</p>
                    {appointment.notes && (
                      <p className="request-notes mt-2 rounded-lg px-3 py-2 leading-5">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      className="request-edit rounded-lg border px-3 py-2 text-xs font-bold hover:border-green-500"
                      to={`/booking.html?edit=${encodeURIComponent(appointment.id)}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="request-delete rounded-lg px-3 py-2 text-xs font-bold"
                      type="button"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {visibleAppointments.length === 0 && !error && (
          <div className="requests-empty rounded-2xl border border-dashed p-8 text-center md:col-span-2">
            <p className="requests-empty-title font-bold">
              {appointments.length ? "No matching appointments" : "No appointments yet"}
            </p>
            <p className="requests-empty-message mt-1 text-sm">
              {appointments.length ? "Try a different search." : "Create your first booking to see it here."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Requests;
