function SkeletonBlock({ className = "" }) {
  return <div className={`skeleton-block ${className}`} />;
}

function PageSkeleton({ pathname }) {
  const page = pathname === "/services.html"
    ? "services"
    : pathname === "/booking.html"
      ? "booking"
      : pathname === "/requests.html"
        ? "requests"
        : pathname === "/contact.html"
          ? "contact"
          : pathname === "/login.html"
            ? "login"
          : "home";

  return (
    <div className={`react-page-skeleton skeleton-${page}`} role="status" aria-label={`Loading ${page} page`}>
      <div className="skeleton-content" aria-hidden="true">
        {page === "home" && (
          <>
            <div className="skeleton-home-hero">
              <div className="skeleton-home-copy">
                <SkeletonBlock className="skeleton-eyebrow" />
                <SkeletonBlock className="skeleton-heading" />
                <SkeletonBlock className="skeleton-line" />
                <SkeletonBlock className="skeleton-line skeleton-line-short" />
                <SkeletonBlock className="skeleton-button" />
              </div>
              <SkeletonBlock className="skeleton-home-image" />
            </div>
            <div className="skeleton-section-heading">
              <SkeletonBlock className="skeleton-eyebrow" />
              <SkeletonBlock className="skeleton-heading-small" />
            </div>
            <div className="skeleton-card-grid skeleton-card-grid-two">
              <SkeletonBlock className="skeleton-home-card" />
              <SkeletonBlock className="skeleton-home-card" />
            </div>
          </>
        )}

        {page === "services" && (
          <>
            <div className="skeleton-page-heading">
              <div>
                <SkeletonBlock className="skeleton-eyebrow" />
                <SkeletonBlock className="skeleton-heading-small" />
              </div>
              <SkeletonBlock className="skeleton-search" />
            </div>
            <div className="skeleton-card-grid skeleton-card-grid-four">
              {Array.from({ length: 4 }, (_, index) => <SkeletonBlock className="skeleton-service-card" key={index} />)}
            </div>
          </>
        )}

        {page === "booking" && (
          <div className="skeleton-booking">
            <SkeletonBlock className="skeleton-booking-image" />
            <div className="skeleton-booking-form">
              <SkeletonBlock className="skeleton-eyebrow" />
              <SkeletonBlock className="skeleton-heading-small" />
              <div className="skeleton-form-grid">
                {Array.from({ length: 8 }, (_, index) => (
                  <div className="skeleton-field" key={index}>
                    <SkeletonBlock className="skeleton-label" />
                    <SkeletonBlock className="skeleton-input" />
                  </div>
                ))}
                <SkeletonBlock className="skeleton-textarea" />
                <SkeletonBlock className="skeleton-button" />
              </div>
            </div>
          </div>
        )}

        {page === "requests" && (
          <>
            <div className="skeleton-page-heading">
              <div>
                <SkeletonBlock className="skeleton-eyebrow" />
                <SkeletonBlock className="skeleton-heading-small" />
              </div>
              <SkeletonBlock className="skeleton-search" />
            </div>
            <div className="skeleton-card-grid skeleton-card-grid-two">
              {Array.from({ length: 2 }, (_, index) => <SkeletonBlock className="skeleton-request-card" key={index} />)}
            </div>
          </>
        )}

        {page === "contact" && (
          <div className="skeleton-contact">
            <SkeletonBlock className="skeleton-contact-card" />
            <SkeletonBlock className="skeleton-faq-card" />
          </div>
        )}

        {page === "login" && (
          <div className="skeleton-login">
            <SkeletonBlock className="skeleton-eyebrow" />
            <SkeletonBlock className="skeleton-heading-small" />
            <div className="skeleton-card-grid skeleton-card-grid-two">
              <SkeletonBlock className="skeleton-login-card" />
              <SkeletonBlock className="skeleton-login-card" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageSkeleton;
