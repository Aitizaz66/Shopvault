import { useState } from "react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards (Visa, Mastercard), as well as PayPal and Shop Pay. All payments are processed securely through Stripe.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days. Express shipping is available at checkout for 1-2 business day delivery. You will receive a tracking number once your order ships.",
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free standard shipping on all orders over $50. For orders under $50, shipping is calculated at checkout based on your location.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund. Items must be unused and in original packaging.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you will receive an email with a tracking number. You can also track your order by logging into your account and viewing your order history.",
    },
    {
      question: "Can I change or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. Please contact our support team immediately if you need to make changes. Once an order is processed for shipping, it cannot be cancelled.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship to all 50 United States. International shipping is coming soon! Please check back later or subscribe to our newsletter for updates.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@shopvault.com, by phone at +1 (555) 123-4567, or through our Contact Us page. We are available Monday through Friday, 9 AM to 6 PM EST.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to the most common questions about shopping, shipping,
          and returns.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md mb-4 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
              <span className="text-lg font-semibold text-gray-800">
                {faq.question}
              </span>
              <span className="text-2xl text-blue-600 flex-shrink-0 ml-4">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed border-t pt-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Have Questions? */}
      <div className="text-center mt-12 bg-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Still Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Contact Us
          </a>
          <a
            href="mailto:support@shopvault.com"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
