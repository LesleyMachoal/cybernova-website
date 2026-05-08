export function GalleryCard({ item }) {
  return (
    <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: '100%',
          height: '180px',
          objectFit: 'cover',
          display: 'block',
        }}
        onError={(e) => {
          if (e.currentTarget.dataset.fallbackApplied) return;
          e.currentTarget.dataset.fallbackApplied = '1';
          e.currentTarget.src = '/assets/default-placeholder.svg';
        }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item.title}</h3>
        {item.description && (
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '8px' }}>
            {item.description}
          </p>
        )}
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
          {item.category}
        </p>
      </div>
    </div>
  );
}