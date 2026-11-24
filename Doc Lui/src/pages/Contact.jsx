import { useState } from "react";
import cat from "../../assets/cat.jpg";

const questions = [
  {
    question: "Do I need an appointment?",
    answer: "Appointments are recommended so our team can prepare the right amount of care time for your pet."
  },
  {
    question: "Which pets can you groom?",
    answer: "We provide grooming services for suitable dogs and cats. Availability may depend on coat, size, and temperament."
  },
  {
    question: "What should I bring?",
    answer: "Bring previous vaccination records, current medication information, and any laboratory or clinic notes when available."
  }
];

function Contact() {
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <section className="contact-card overflow-hidden rounded-[2rem] bg-green-800 text-white soft-shadow">
          <div className="grid sm:grid-cols-2">
            <img className="h-64 w-full object-cover sm:h-full" src={cat} alt="Clinic cat" />
            <div className="p-7">
              <p className="text-xs font-black uppercase tracking-[.2em] text-green-200">Visit Doc Lui</p>
              <h1 className="mt-2 text-3xl font-black">We’re here for your pets.</h1>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="font-bold text-green-200">Address</p>
                  <p className="mt-1">Door 103, JPAD Building<br />Zone 2, Conception Grande<br />Naga Branch</p>
                </div>
                <div>
                  <p className="mt-1">San Juan Ave.<br />Brgy. North Centro<br />Sipocot Branch</p>
                </div>
                <div>
                  <p className="font-bold text-green-200">Contact</p>
                  <p className="mt-1">0991 565 2323<br />Doc Lui Veterinary Clinic</p>
                </div>
                <div>
                  <p className="font-bold text-green-200">Owner / Veterinarian</p>
                  <p className="mt-1">Dr. Louie T. Escamillas, DVM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="contact-faq rounded-[2rem] p-7 soft-shadow">
          <h2 className="contact-faq-title text-xl font-black">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {questions.map(({ question, answer }) => {
              const isOpen = openQuestion === question;
              return (
                <div key={question}>
                  <button
                    className="contact-faq-question flex w-full items-center justify-between py-4 text-left text-sm font-bold"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenQuestion(isOpen ? null : question)}
                  >
                    {question}
                    <span className="contact-faq-icon" aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && <p className="contact-faq-answer pb-4 text-sm leading-6">{answer}</p>}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Contact;
