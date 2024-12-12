import { Router } from "express";
const router = Router();
import helpers from "../helpers/pranHelpers.js";
import { dishData } from "../data/index.js";
import { validateCuisineType } from "../helpers/validationHelper.js";

router.route("/").get(async (req, res) => {
  try {
    let dish = req.query.dish;
    let cuisine = req.query.cuisine;
    let location = req.query.location;
    let min = req.query.min;
    let max = req.query.max;
    let minPrice;
    let maxPrice;
    if (cuisine) {
      cuisine = helpers.checkString(cuisine, "cuisine");
      cuisine = validateCuisineType(cuisine);
    } else {
      cuisine = "";
    }

    if (!dish) dish = "";

    if (!location) location = "";

    if (min) {
      minPrice = helpers.validateFloats(min, 'Min Price')
    }

    if (max) {
      maxPrice = helpers.validateFloats(max, 'Max Price')
    }

    if (minPrice && maxPrice && minPrice > maxPrice) throw `Error: Min price cannot be greater than Max price`
    //location validation to be implemented

    // get data from data functions
    const data = await dishData.searchQuery(
      dish,
      cuisine,
      location,
      minPrice,
      maxPrice
    );
    if (!data) {
      res.status(404).json({ error: "No Data Found" });
    }
    return res.status(200).json({ status: "success", dishes: data });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
