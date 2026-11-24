const appointmentKey = "docLuiAppointments";

export function readAppointments() {
  try {
    const saved = localStorage.getItem(appointmentKey);
    if (saved === null) return [];

    const appointments = JSON.parse(saved);
    if (!Array.isArray(appointments)) {
      throw new Error("Saved appointments are not in the expected format.");
    }

    return appointments;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unable to read saved appointments."
    );
  }
}

export function writeAppointments(appointments) {
  localStorage.setItem(appointmentKey, JSON.stringify(appointments));
}

export function createAppointmentId() {
  return globalThis.crypto?.randomUUID?.() ?? String(Date.now());
}
