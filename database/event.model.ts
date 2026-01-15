import mongoose, { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must have at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must have at least one item',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook for slug generation and date/time normalization
EventSchema.pre('save', function (next) {
  // Generate slug only if title is new or modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Normalize date to YYYY-MM-DD format if modified (timezone-safe)
  if (this.isModified('date')) {
    // Strict regex for YYYY-MM-DD format
    const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const match = this.date.match(dateRegex);
    
    if (!match) {
      return next(new Error('Date must be in YYYY-MM-DD format'));
    }
    
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    
    // Validate date is actually valid (e.g., not Feb 30)
    const testDate = new Date(year, month - 1, day);
    if (
      testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day
    ) {
      return next(new Error('Date must be a valid date'));
    }
    
    // Store normalized YYYY-MM-DD string
    this.date = `${year}-${match[2]}-${match[3]}`;
  }

  // Normalize time to HH:MM format if modified
  if (this.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(this.time)) {
      // Try to parse and reformat common time formats
      try {
        const timeParts = this.time.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          const hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
            this.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          } else {
            throw new Error('Invalid time');
          }
        } else {
          throw new Error('Invalid time format');
        }
      } catch (error) {
        return next(new Error('Time must be in HH:MM format'));
      }
    }
  }

  next();
});

// Create unique index on slug
EventSchema.index({ slug: 1 });

// Use existing model if available (for hot reloading), otherwise create new one
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
