import express from "express";
import {getDestListings,getDestinationDetail,getHotelListings,getHotelDetail,
    getTransportListings,getTransportDetail,getGuideListings,getGuideDetail} from "../controllers/publicController.js";

const publicRouter=express.Router();
publicRouter.get("/destinations",getDestListings);
publicRouter.get("/destinations/:id",getDestinationDetail);
publicRouter.get("/hotels",getHotelListings);
publicRouter.get("/hotels/:id",getHotelDetail);
publicRouter.get("/transports",getTransportListings);
publicRouter.get("/transports/:id",getTransportDetail);
publicRouter.get("/guides",getGuideListings);
publicRouter.get("/guides/:id",getGuideDetail);

export default publicRouter;