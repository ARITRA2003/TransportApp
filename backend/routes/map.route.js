import express from "express"
import * as mapController from "../controllers/map.controller.js"
import {authUser} from "../middleware/auth.middleware.js"
import {query} from "express-validator"

const router = express.Router();

router.get("/get-coordinates",
    [
        query('address').isString().isLength({min:3})
    ],
    authUser,
    mapController.getCoordinate
);

router.get("/get-distance-time",[
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3})
],
    authUser,
    mapController.getDistanceTime
)

router.get("/get-suggestions",[
    query('input').isString().isLength({min:3})
],
    authUser,
    mapController.getAutoCompleteSuggestions
)

export default router;