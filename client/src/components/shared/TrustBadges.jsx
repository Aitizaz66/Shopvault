const TrustBadges = ({ variant = "grid" }) => {
  const badges = [
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ];

  if (variant === "row") {
    return (
      <div className="flex flex-wrap justify-center gap-6 py-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {badge.title}
              </p>
              <p className="text-xs text-gray-500">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {badges.map((badge, index) => (
        <div key={index} className="text-center">
          <span className="text-3xl block mb-2">{badge.icon}</span>
          <p className="text-sm font-semibold text-gray-800">{badge.title}</p>
          <p className="text-xs text-gray-500">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
