import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020a20] text-white pt-10 flex flex-col justify-center">
      <div className="md:w-full flex justify-center">
        <div className="w-full md:w-[60%] mx-auto px-6">
          <div className="flex flex-col md:flex-row flex-wrap justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">INO Travels</h2>
              <p className="mb-4 text-gray-300">
                Creating unforgettable travel experiences since 2010. Your
                journey is our passion.
              </p>
              <div className="flex space-x-3 mb-3">
                {[
                  FaFacebookF,
                  FaInstagram,
                  FaTwitter,
                  FaLinkedinIn,
                  FaYoutube,
                ].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2 rounded-full bg-blue-800 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 text-blue-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
              <p className="text-gray-400 text-sm">Payment Partner Razor Pay</p>
            </div>

            {/* Column 2 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Quick Links</h2>
              <ul className="space-y-2">
                {["Home", "About", "Contact Us"].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Contact Information</h2>
              <div className="mb-3">
                <h3 className="font-semibold">Office</h3>
                <p className="text-gray-300">
                  123 Travel Street, Wanderlust City, India
                </p>
              </div>
              <div className="mb-3">
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-300">+91 9876543210</p>
                <p className="text-gray-300">+91 9123456789</p>
                <p className="text-gray-300">+91 9988776655</p>
              </div>
              <div className="mb-3">
                <h3 className="font-semibold">Email Address</h3>
                <p className="text-gray-300">info@inotravels.com</p>
                <p className="text-gray-300">support@inotravels.com</p>
                <p className="text-gray-300">booking@inotravels.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-gray-300">
                  Monday to Friday: 10:00 am - 6:00 pm
                </p>
              </div>
            </div>

            {/* Column 4 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Legal</h2>
              <ul className="space-y-2">
                {["Terms and Condition", "Privacy Policy", "Cookie Policy"].map(
                  (link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white transition-all duration-300 transform hover:translate-x-1"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Divider Line */}
      <div className="md:w-full flex justify-center md:mt-5">

      <div
  className="mt-10 w-[60%] h-px mx-auto"
  style={{
      background: "linear-gradient(to right, transparent, #1d4ed8, transparent)",
    }}
></div>
    </div>


      <div className="md:w-full flex justify-center">
        <div className="md:w-[60%] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-300">Download our mobile app</p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-blue-700 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition-all duration-300"
            >
              Download Android App
            </a>
            <a
              href="#"
              className="bg-blue-700 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition-all duration-300"
            >
              Download iOS App
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
