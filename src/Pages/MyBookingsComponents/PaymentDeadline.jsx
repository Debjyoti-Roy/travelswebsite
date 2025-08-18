import { useEffect, useState } from "react";

const PaymentDeadline = ({ expiredAt }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(expiredAt) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [expiredAt]);

  if (!timeLeft) {
    return (
      <strong className="break-all text-red-800">
        ⚠️ The payment deadline has passed.
      </strong>
    );
  }

  return (
    <strong className="break-all text-red-800">
      Kindly complete your payment within:{" "}
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </strong>
  );
};

export default PaymentDeadline;
