function ServiceCard({ title, summary, image, onSelect }) {
  return (
    <article
      className="service-card"
      role="button"
      tabIndex="0"
      onClick={onSelect}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <img src={image} alt={title} />
      <div>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </article>
  );
}

export default ServiceCard;
