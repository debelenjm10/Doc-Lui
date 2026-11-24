import { useState } from "react";
import { Link } from "react-router-dom";
import surgery from "../../assets/surgery.jpg";
import grooming from "../../assets/pet-grooming.jpg";
import consultation from "../../assets/consultation.jpg";
import ultrasound from "../../assets/ultrasound.jpg";

const services = [
  {
    category: "Surgery",
    title: "Major and minor surgeries",
    description: "Safe surgical care for major and minor procedures, with guidance throughout recovery.",
    image: surgery
  },
  {
    category: "Grooming & boarding",
    title: "Pet grooming and pet boarding",
    description: "Professional pet grooming and comfortable boarding for dogs and cats.",
    image: grooming
  },
  {
    category: "Wellness",
    title: "Check-ups and consultation",
    description: "Physical examinations, health assessment, and personalized veterinary advice.",
    image: consultation
  },
  {
    category: "Diagnostics",
    title: "Laboratory, blood test, and ultrasound",
    description: "Laboratory testing, blood tests, and ultrasound imaging to support diagnosis and treatment.",
    image: ultrasound
  }
];

function Services() {
  const [search, setSearch] = useState("");
  const visibleServices = services.filter(service =>
    `${service.category} ${service.title} ${service.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="services-page mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="services-eyebrow text-xs font-black uppercase tracking-[.2em]">What we do</p>
          <h1 className="services-title mt-2 text-3xl font-black">Clinic &amp; grooming services</h1>
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="absolute left-3 top-3 text-slate-400" aria-hidden="true">⌕</span>
          <input
            className="services-search w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-500"
            placeholder="Search services"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {visibleServices.map(service => (
          <article
            className="service-page-card overflow-hidden rounded-2xl soft-shadow"
            key={service.title}
          >
            <img className="h-44 w-full object-cover" src={service.image} alt={service.title} />
            <div className="p-5">
              <span className="service-page-category text-xs font-bold">{service.category}</span>
              <h2 className="service-page-title mt-1 text-lg font-black">{service.title}</h2>
              <p className="service-page-description mt-2 text-sm leading-6">{service.description}</p>
              <Link
                className="service-page-link mt-4 inline-block rounded-lg px-4 py-2 text-sm font-bold"
                to={`/booking.html?service=${encodeURIComponent(service.title)}`}
              >
                Book this service
              </Link>
            </div>
          </article>
        ))}
        {visibleServices.length === 0 && (
          <p className="service-page-empty text-sm md:col-span-2 lg:col-span-4" role="status">
            No services match your search.
          </p>
        )}
      </div>
    </main>
  );
}

export default Services;
