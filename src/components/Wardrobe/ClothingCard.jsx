import './ClothingCard.css';

export default function ClothingCard({ item, onDelete, onSelect, selected, onToggleFavorite, onGenerateWithItem }) {
    const categoryEmoji = {
        top: '👕',
        bottom: '👖',
        shoes: '👟',
        outerwear: '🧥',
        dress: '👗',
        suit: '🤵',
        accessory: '👜'
    };

    return (
        <div
            className={`clothing-card ${selected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="card-image-container">
                <img src={item.imageUrl} alt={item.description} className="card-image" />
                <div className="card-actions">
                    {onToggleFavorite && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite();
                            }}
                            className="action-btn favorite-btn"
                            title={item.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {item.favorite ? '⭐' : '☆'}
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="action-btn delete-btn"
                            title="Delete item"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <div className="card-content">
                <div className="card-category">
                    <span className="category-icon">{categoryEmoji[item.category] || '👔'}</span>
                    <span className="category-text">{item.category}</span>
                </div>

                {item.description && (
                    <p className="card-description">{item.description}</p>
                )}

                {item.colors && item.colors.length > 0 && (
                    <div className="card-colors">
                        {item.colors.map((color, idx) => (
                            <span key={idx} className="color-tag">{color}</span>
                        ))}
                    </div>
                )}

                {onGenerateWithItem && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerateWithItem();
                        }}
                        className="btn btn-secondary btn-sm generate-btn"
                    >
                        ✨ Generate Outfit
                    </button>
                )}
            </div>
        </div>
    );
}
