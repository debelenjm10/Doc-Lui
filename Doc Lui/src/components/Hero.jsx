import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cat from "../../assets/cat.jpg";
import dog from "../../assets/dog.jpg";
import logo from "../../assets/logo.jpg";

const slides = [
  { image: cat, imageAlt: "Cat receiving veterinary care", caption: "Veterinary consultations" },
  { image: dog, imageAlt: "Puppy receiving gentle care", caption: "Comfortable grooming care" },
  { image: logo, imageAlt: "Doc Lui veterinary clinic logo", caption: "Medicine, care, and compassion" }
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent(value => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const move = step => {
    setCurrent(value => (value + step + slides.length) % slides.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Compassionate care for every companion</span>
        <h1>Healthy pets.<br /><span>Happy families.</span></h1>
        <p>Trusted veterinary care, surgery, diagnostics, and grooming for your beloved companions.</p>
        <Link className="primary-button" to="/booking.html">Book a Visit</Link>

        <div className="carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous slide">←</button>
          <span>{String(current + 1).padStart(2, "0")} / 03</span>
          <button type="button" onClick={() => move(1)} aria-label="Next slide">→</button>
          <div className="carousel-dots">
            {slides.map((item, index) => (
              <button
                key={item.caption}
                type="button"
                className={index === current ? "active" : ""}
                onClick={() => setCurrent(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <img key={slide.image} src={slide.image} alt={slide.imageAlt} />
        <div className="hero-caption">
          <div>
            <small>Today at Doc Lui</small>
            <strong>{slide.caption}</strong>
          </div>
          <img src={logo} alt="" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
