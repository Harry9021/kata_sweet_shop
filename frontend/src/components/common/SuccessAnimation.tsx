import React, { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  message?: string;
  color?: string;
  size?: number;
  onComplete?: () => void;
  duration?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  message = "Success!",
  color = "#20bf6b",
  size = 80,
  onComplete,
  duration = 2000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);

  return (
    <div className="success-container">
      <div className="success-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 52 52" className={`checkmark ${isVisible ? 'active' : ''}`}>
          <circle
            className="checkmark-circle"
            cx="26" cy="26" r="25"
            fill="none"
            style={{ stroke: color }}
          />
          <path
            className="checkmark-check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            style={{ stroke: color }}
          />
        </svg>
      </div>
      {message && <h3 className="success-message" style={{ color: color }}>{message}</h3>}

      <style>{`
        .success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: fade-in 0.3s ease-out;
        }

        .success-message {
          margin-top: 16px;
          font-size: 1.5rem;
          font-weight: 600;
          opacity: 0;
          animation: slide-up 0.5s ease-out 0.3s forwards;
        }

        .checkmark {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px ${color};
          animation: scale .3s ease-in-out .9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke-miterlimit: 10;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;
