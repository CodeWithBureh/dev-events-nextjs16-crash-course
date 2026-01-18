"use client"

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.action";
import posthog from 'posthog-js';


const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success } = await createBooking( {eventId, slug, email} )

        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            console.error("Booking failed:");
            posthog.captureException("Booking failed:");
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="success-message">Thank you for booking! A confirmation email has been sent to {email}.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>

                </form>


            )}
        </div>
    )


}

export default BookEvent;