import { catchAsyncError } from "../../middleware/catchAsyncError";
import { Request } from "express";
import { Apartment } from "../../models/appartment.model";
import { AppError } from "../../utils/AppError";
import mongoose from "mongoose";

interface UploadedFiles {
  images?: Express.Multer.File[];
}



//the functions in the website
const createApartment = catchAsyncError(async (req: Request, res, next) => {
  const { unitName, unitNumber, project, price, description, status } = req.body;

  const isExist = await Apartment.findOne({ unitNumber });
  if (isExist) {
    return next(new AppError(`Apartment with unit number "${unitNumber}" already exists.`, 400));
  }
  const files = req.files as UploadedFiles;
  if (!files?.images || files.images.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  req.body.images = files.images.map((obj) => obj.cloudinaryUrl);

  const result = new Apartment(req.body);
  await result.save();

  res.status(200).json({ message: "Apartment created successfully", result });
});

const getOneApartment = catchAsyncError(async (req: Request, res, next) => {
  const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid apartment ID format', 400));
    }

  const result = await Apartment.findById(id);

  !result && next(new AppError(`Apartment not found`, 404))
        result && res.status(200).json({ message: "success", result })

});
const deleteOneApartment = catchAsyncError(async (req: Request, res, next) => {
  const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid apartment ID format', 400));
    }

  const result = await Apartment.findByIdAndDelete(id);

  !result && next(new AppError(`Apartment not found`, 404))
        result && res.status(200).json({ message: "success", result })

});

const getAllApartments = catchAsyncError(async (req: Request, res, next) => {
  const { unitName, unitNumber, project } = req.query;
  const filter: any = {};
  if (unitName) filter.unitName = { $regex: unitName as string, $options: "i" };
  if (unitNumber) filter.unitNumber = { $regex: unitNumber as string, $options: "i" };
  if (project) filter.project = { $regex: project as string, $options: "i" };

  const result = await Apartment.find(filter);
  if (!result.length) {
    return res.status(200).json({ message: "no matches", result: [] });
  }
  res.status(200).json({ message: "success", result });
});

export { createApartment, getOneApartment,getAllApartments,deleteOneApartment };
