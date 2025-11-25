import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaDiscord } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const data = {
      access_key: "2751a99e-8295-4fd8-9a63-af664af25a43",
      name: form.name,
      email: form.email,
      message: form.message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        alert("Your complaint has been filed successfully! 🎉");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        alert("Failed to send your message. Try again.");
      }
    } catch {
      setStatus("error");
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-gray-800 py-20 px-6 transition-all">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-xl p-10 md:p-16 border border-[#8FABD4]/30 dark:border-[#8FABD4]/20"
      >
        <h1 className="text-5xl font-bold text-center mb-4 text-black dark:text-white">
          <span className="bg-gradient-to-r from-[#4A70A9] via-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
            Get In Touch
          </span>
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          We’re here to help! Whether you have questions, suggestions, or just want to connect,
          feel free to reach out. We usually respond within 24 hours.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-gray-800 dark:text-gray-300"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Feel free to contact us through any of the following ways:
              </p>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-xl text-[#4A70A9] dark:text-[#8FABD4]" />
              <span>support@mvp.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-xl text-[#4A70A9] dark:text-[#8FABD4]" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-xl text-[#4A70A9] dark:text-[#8FABD4]" />
              <span>New Delhi, India</span>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-[#4A70A9] dark:text-[#8FABD4] text-2xl hover:scale-110 transition-transform">
                <FaInstagram />
              </a>
              <a href="#" className="text-[#4A70A9] dark:text-[#8FABD4] text-2xl hover:scale-110 transition-transform">
                <FaDiscord />
              </a>
            </div>
          </motion.div>

          {/* Right Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="grid gap-6"
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FABD4] transition-all"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FABD4] transition-all"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="6"
              required
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FABD4] transition-all"
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300"
            >
              {loading ? "Sending..." : "Send Message →"}
            </motion.button>

            {status === "success" && <p className="text-green-600 text-center">Message Sent Successfully 🎉</p>}
            {status === "error" && <p className="text-red-500 text-center">Failed to send message</p>}
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
