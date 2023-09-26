const express = require("express");
const router = express.Router();
const recipeControllers  = require("../controllers/recipeControllers");

// App Router

router.get("/",recipeControllers.homePage);
router.get("/categories",recipeControllers.exploreCategories);
router.get("/categories/:id",recipeControllers.exploreCategoriesById);
router.get("/recipe/:id",recipeControllers.exploreRecipe);
router.post("/search",recipeControllers.searchRecipe);
router.get("/explore-latest",recipeControllers.exploreLatest);
router.get("/explore-random",recipeControllers.exploreRandom);
router.get("/submit-recipe",recipeControllers.submitRecipe);
router.post("/submit-recipe",recipeControllers.submitRecipeOnPost);
module.exports = router;