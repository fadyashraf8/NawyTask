import mongoose, { Document, Schema } from "mongoose";

export interface Apartment extends Document {
  unitNumber: string;
  unitName: string;
  project: string;
  price: number;
  description: string;
  status: "available" | "rented" | "maintenance";
  images: string[];
}

const apartmentSchema = new Schema<Apartment>({
  unitNumber: {
    type: String,
    required: true,
    unique: true,
  },
  unitName: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "rented", "maintenance"],
    default: "available",
  },
  images: {
    type: [String],
    default: [],
  },
},{timestamps: true});

export const Apartment = mongoose.model<Apartment>(
  "Apartment",
  apartmentSchema
);
