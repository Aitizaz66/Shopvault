import { useState } from "react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "What payment methods do you accept?", answer: "Cash on Delivery is currently available. No online payment is collected at checkout. All store prices are in USD." },
    { question: "How much is shipping?", answer: "Shipping is $5 and is free when the item subtotal is above $50. Tax is 10% of the item subtotal. Your complete total is shown before you place the order." },
    { question: "How do I check my order?", answer: "Sign in and open My Orders to see the current status and saved order details." },
    { question: "Can I cancel my order?", answer: "Contact support with your order number. The store can cancel unpaid orders while they are Pending or Processing. Shipped and delivered orders cannot be cancelled through checkout." },
    { question: "What if checkout reports an error?", answer: "Check your cart quantities and refresh the order total. If your connection dropped, check My Orders first. Retrying the same checkout request will return the existing order when it was already saved." },
    { question: "How do I ask about delivery, returns, or shipping locations?", answer: "Contact support before ordering to confirm delivery availability, timing, and return arrangements." },
    { question: "How do I contact support?", answer: "Use Contact Us to prepare an email, or email support@shopvault.com. Include your order number when asking about an order." },
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
