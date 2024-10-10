import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement("script");
      script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${
        import.meta.env.VITE_PAYPAL_CLIENT_ID
      }&currency=GBP`;
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load PayPal SDK script.");
        setErrorMessage("Failed to load PayPal SDK script.");
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();

    const fetchEventDetails = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "Events", id));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          setErrorMessage("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setErrorMessage("Error fetching event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handlePaymentSuccess = async (details) => {
    try {
      const registrationsRef = collection(db, "Registrations");
      const userRegistrationQuery = query(
        registrationsRef,
        where("eventId", "==", id),
        where("userId", "==", user.uid)
      );
      const registrationSnapshot = await getDocs(userRegistrationQuery);

      if (registrationSnapshot.empty) {
        await addDoc(collection(db, "Registrations"), {
          eventId: id,
          userId: user.uid,
          eventTitle: event.title,
          registrationDate: new Date(),
          paymentStatus: "completed",
        });

        const userDocRef = doc(db, "Users", user.uid);
        await updateDoc(userDocRef, {
          eventsRegistered: arrayUnion(id),
        });

        alert("Payment successful! You are now registered for the event.");
        navigate(`/events/${id}`);
      } else {
        alert("You are already registered for this event.");
      }
    } catch (error) {
      console.error("Error saving registration:", error);
      setErrorMessage(
        "Payment successful but failed to save registration. Please contact support."
      );
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setErrorMessage("Payment failed. Please try again.");
  };

  if (loading) {
    return <div className="loading-text">Loading payment details...</div>;
  }
  if (errorMessage) {
    return <div className="error-text">{errorMessage}</div>;
  }
  if (!event) {
    return <div className="loading-text">Event not found.</div>;
  }

  return (
    <div className="payment-page-container flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Payment for {event.title}</h2>

      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="event-image mb-4 rounded-md"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}

      <div className="event-details mb-4 text-center">
        <p className="event-location">Location: {event.location}</p>
        <p className="event-datetime">
          Start: {event.startDateTime.toDate().toString()} <br />
          End: {event.endDateTime.toDate().toString()}
        </p>
        <p className="event-price">Price: £{event.price}</p>
      </div>

      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "GBP",
                  value: event.price.toFixed(2),
                },
                description: event.title,
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          await actions.order.capture().then(handlePaymentSuccess);
        }}
        onError={handlePaymentError}
      />

      {errorMessage && <div className="error-text">{errorMessage}</div>}
    </div>
  );
};


export default PaymentPage;
