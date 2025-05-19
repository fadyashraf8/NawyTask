import express from "express";
import { createApartment, deleteOneApartment, getAllApartments, getOneApartment } from "./apartment.controller";
import { uploadFields } from "../../middleware/fileUpload";
import { get } from "http";

const apartmentRouter = express.Router();


//to call the apis from the controller
apartmentRouter
  .route("/")
  .post(uploadFields([{ name: "images", maxCount: 10 }], "apartments"),createApartment)
  .get(getAllApartments)

apartmentRouter
.route("/:id")
.get(getOneApartment)
.delete(deleteOneApartment)

export default apartmentRouter;
