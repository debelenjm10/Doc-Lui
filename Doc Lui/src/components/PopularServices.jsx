import { useState } from "react";
import ServiceCard from "./ServiceCard";
import consultation from "../../assets/consultation.jpg";
import grooming from "../../assets/pet-grooming.jpg";

const services = [
  {
    title: "Check-ups and consultation",
    summary: "Physical examinations, health assessments, and personalized veterinary advice.",
    image: consultation
  },
  {
    title: "Pet grooming",
    summary: "Professional bathing, grooming, nail care, and coat maintenance.",
    image: grooming
  }
];

function PopularServices() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section className="services-section">
        <div className="section-heading">
          <small>Our care</small>
          <h2>Popular services</h2>
        </div>
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard
              key={service.title}
              {...service}
              onSelect={() => setSelected(service)}
            />
          ))}
        </div>
      </section>

      {selected && (
        <div
          className="service-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={() => setSelected(null)}
        >
          <div className="modal-card" onClick={event => event.stopPropagation()}>
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close service preview"
            >
              ×
            </button>
            <img src={selected.image} alt={selected.title} />
            <div>
              <h3 id="service-modal-title">{selected.title}</h3>
              <p>{selected.summary}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PopularServices;
