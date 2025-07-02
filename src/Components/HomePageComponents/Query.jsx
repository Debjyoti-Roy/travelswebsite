import React, { useEffect, useState } from "react";
import side from "./../../assets/queryImage.jpg";
import { useDispatch, useSelector } from "react-redux";
import { sendPrivateQuery, sendPublicQuery } from "../../Redux/store/querySlice";
import TicketModalComponent from "../ModalComponent/TicketModalComponent";
import toast from "react-hot-toast";

const Query = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(false);
  const [contact, setContact] = useState("");
  const [error2, setError2] = useState("");
  const [name, setName] = useState("");
  const [Subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tokenModal, setTokenModal] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [submittedOn, setSubmittedOn] = useState("");
  const [category, setCategory] = useState("");
  const [response, setResponse] = useState("");
  const [priority, setPriority] = useState("");
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.query);

  useEffect(() => {
    const handleTokenUpdate = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (newToken) {
        setLoggedIn(true);
        const cookies = document.cookie.split("; ");
        const userDataCookie = cookies.find((row) =>
          row.startsWith("userData=")
        );

        if (userDataCookie) {
          const value = userDataCookie.split("=")[1];
          const decoded = JSON.parse(decodeURIComponent(value));
          console.log(decoded);
          setName(decoded.name);
          if (decoded.phoneNumber && decoded.phoneNumber !== "") {
            setContact(decoded.phoneNumber);
          } else {
            setContact(decoded.email);
          }
        } else {
          console.log("userData cookie not found");
        }
      } else {
        console.log("0");
        setContact("");
        setName("");
        setLoggedIn(false);
      }
    };

    // Listen for custom event
    window.addEventListener("tokenUpdated", handleTokenUpdate);

    // Also run once on mount (in case already logged in/out)
    handleTokenUpdate();

    return () => window.removeEventListener("tokenUpdated", handleTokenUpdate);
  }, []);

  const validateContact = () => {
    if (contact.includes("@")) {
      // Email check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        setError2("Please enter a valid email address.");
        return false;
      }
    } else {
      // Phone number check (example: 10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(contact)) {
        setError2("Please enter a valid 10-digit phone number.");
        return false;
      }
    }
    setError2(""); // Valid
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loggedIn) {
      if (validateContact()) {
        const token = localStorage.getItem("token");
        if (token) {
          const push = await dispatch(
            sendPrivateQuery({ token, subject: Subject, message: message })
          );
          console.log(push.payload?.status);
          if (push.payload?.status == 201) {
            setTokenModal(true);
            const ticket = push.payload?.data;
            setTicketId(ticket.ticketId);
            const rawTime = ticket.updatedAt;
            const fixedTime = rawTime.replace(/;/g, ":");
            const dateObj = new Date(fixedTime);

            // Get individual parts
            const options = { month: "short" };
            const month = new Intl.DateTimeFormat("en-US", options).format(
              dateObj
            ); // "Jul"
            const day = dateObj.getDate(); // 3
            const year = dateObj.getFullYear(); // 2025

            // Get hours and minutes with leading zeros
            const hours = dateObj.getHours().toString().padStart(2, "0");
            const minutes = dateObj.getMinutes().toString().padStart(2, "0");

            const formatted = `${month} ${day}, ${year} • ${hours}:${minutes}`;
            setSubmittedOn(formatted);
            setCategory(ticket.queryType);
            const res =
              ticket.queryType === "GENERIC"
                ? "Within 24 Hours"
                : "Within 12 Hours";
            setResponse(res);
            const pr =
              ticket.queryType === "GENERIC" ? "STANDARD" : "IMPORTANT";
            setPriority(pr);
          } else {
            // console.log(push.payload.message)
            toast.error(push.payload.message, {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        }
      }
    } else {
      const push = await dispatch(
        sendPublicQuery({
          subject: Subject,
          message: message,
          name: name,
          contact: contact,
        })
      );

      if (sendPublicQuery.fulfilled.match(push)) {
        // console.log("Status:", push.payload.status);
        // console.log("Data:", push.payload.data);
        setTokenModal(true);
        const ticket = push.payload?.data;
            setTicketId(ticket.ticketId);
            const rawTime = ticket.createdAt;
            const fixedTime = rawTime.replace(/;/g, ":");
            const dateObj = new Date(fixedTime);

            // Get individual parts
            const options = { month: "short" };
            const month = new Intl.DateTimeFormat("en-US", options).format(
              dateObj
            ); // "Jul"
            const day = dateObj.getDate(); // 3
            const year = dateObj.getFullYear(); // 2025

            // Get hours and minutes with leading zeros
            const hours = dateObj.getHours().toString().padStart(2, "0");
            const minutes = dateObj.getMinutes().toString().padStart(2, "0");

            const formatted = `${month} ${day}, ${year} • ${hours}:${minutes}`;
            setSubmittedOn(formatted);
            setCategory(ticket.queryType);
            const res =
              ticket.queryType === "GENERIC"
                ? "Within 24 Hours"
                : "Within 12 Hours";
            setResponse(res);
            const pr =
              ticket.queryType === "GENERIC" ? "STANDARD" : "IMPORTANT";
            setPriority(pr);
      } else {
        console.log("Error:", push.error);
        toast.error(push.payload.message, {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
      }
    }
  };
  return (
    <>
      <div className="flex flex-col gap-[50px] justify-center items-center min-h-screen bg-blue-50 p-4">
        <div className="w-[80vw] flex flex-col justify-center">
          <p className="text-bold text-4xl flex justify-center">
            Get in touch!
          </p>
          <p className="text-light text-md text-center text-gray-500">
            Have questions about our destinations or need help planning your
            perfect trip? Our travel experts are here to help.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full md:max-w-[60%]">
          {/* Left side: Contact Info */}
          <div className="w-full md:w-[50%] h-60 md:h-auto">
            <img
              src={side}
              alt="Query illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side: Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 md:pt-16 w-full h-full justify-center gap-[20px] flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

            <div className="flex flex-col gap-[15px] md:flex-row md:space-x-4">
              <input
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="border border-gray-300 rounded-md p-3 mb-4 md:mb-0 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <div className="flex flex-col gap-[0px]"> */}
              <div className="relative inline-block">
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onBlur={validateContact}
                  placeholder="Contact"
                  className={`border ${
                    error2 ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 mb-2 focus:outline-none focus:ring-2 ${
                    error2 ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {error2 && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                    {error2}
                  </div>
                )}
              </div>
              {/* </div> */}
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={Subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Message"
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-300 rounded-md p-3 mb-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      {tokenModal && (
        <TicketModalComponent
          ticketId={ticketId}
          submittedOn={submittedOn}
          category={category}
          priority={priority}
          response={response}
          onClose={() => setTokenModal(false)}
        />
      )}
    </>
  );
};

export default Query;
