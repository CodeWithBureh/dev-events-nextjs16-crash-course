import mongoose, { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // RFC 5322 compliant email regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate that the referenced event exists
BookingSchema.pre('save', async function () {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        throw new Error('Referenced event does not exist');
      }
    } catch (error) {
      throw new Error('Error validating event reference');
    }
  }
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Compound index for efficient queries by event and email
BookingSchema.index({ eventId: 1, email: 1 });

// Use existing model if available (for hot reloading), otherwise create new one
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
