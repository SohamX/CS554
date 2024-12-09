import { Router } from 'express';
const router = Router();
import helpers from '../helpers/pranHelpers.js';
import { validateCuisineType, validateCost, checkisValidImageArray, validateId, validateUniqueDishesPerCook, checkDishDesc, checkisValidBoolean, errorMsg } from '../helpers/validationHelper.js';
import { dishData } from '../data/index.js';

router
    .route('/')
    .post(async (req, res) => {
        const dishFormData = req.body;
        let {
            cookId,
            name,
            description,
            cuisineType,
            cost
            // ,images
        } = dishFormData;

        try {
            if (!cookId || !name || !description || !cuisineType || !cost) {//|| !images
                throw "All fields need to be supplied";
            }
            cookId = validateId(cookId, 'cookId');
            name = helpers.checkString(name, 'dish name');
            description = checkDishDesc(description, 'description');
            cuisineType = helpers.checkString(cuisineType, 'cuisineType');
            cuisineType = validateCuisineType(cuisineType);
            //validate cost
            cost = validateCost(parseFloat(cost), 'cost');
            //images = checkisValidImageArray(images, 'images');

            //check if dish already present for this cook
            await validateUniqueDishesPerCook(cookId, name);

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const dishAdded = await dishData.addDish(cookId,
                name,
                description,
                cuisineType,
                cost
                // ,
                // images
            );
            if (dishAdded) {
                res.status(200).json({ status: "success", dish: dishAdded });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
    })


router
    .route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dish = await dishData.getDishById(req.params.id);
            res.status(200).json({ status: "success", dish: dish });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })
    .patch(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        const dishFormData = req.body;
        let {
            cookId,
            name,
            description,
            cuisineType,
            cost,
            images,
            isAvailable } = dishFormData;

        try {
            cookId = validateId(cookId, 'cookId');

            if (name) {
                name = helpers.checkString(name, 'dish name');
                //check if dish already present for this cook
                validateUniqueDishesPerCook(cookId, name);
            }

            if (description) {
                description = checkDishDesc(description, 'description');
            }

            if (cuisineType) {
                cuisineType = helpers.checkString(cuisineType, 'cuisineType');
                cuisineType = validateCuisineType(cuisineType);
            }
            if (cost) {
                //validate cost
                cost = validateCost(parseFloat(cost), 'cost');
            }

            if (images) {
                images = checkisValidImageArray(images, 'images');
            }
            if (isAvailable) {
                isAvailable = checkisValidBoolean(Boolean(isAvailable));
            }

        } catch (e) {
            return res.status(400).json(errorMsg(e))
        }


        try {
            const dishUpdated = await dishData.updateDish(req.params.id,
                cookId,
                name,
                description,
                cuisineType,
                cost,
                images,
                isAvailable);
            if (dishUpdated) {
                res.status(200).json({ status: "success", dish: dishUpdated });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }

        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }

    })
    .delete(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dishDeleted = await dishData.deleteDish(req.params.id);
            res.status(200).json({ status: "success", dish: dishDeleted });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })

router
    .route('/cook/:cookId')
    .get(async (req, res) => {
        try {
            req.params.cookId = validateId(req.params.cookId, 'cookId URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const dishes = await dishData.getAllDishesByCookId(req.params.cookId);
            res.status(200).json({ status: "success", dishes: dishes });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    })

export default router;