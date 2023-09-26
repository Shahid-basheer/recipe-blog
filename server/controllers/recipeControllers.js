require("../models/database");
const Recipe = require("../models/recipe");
const Category = require("../models/category");

// ========== GET HOMEPAGE ===========
exports.homePage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const thai = await Recipe.find({ "category": "Thai" }).limit(limitNumber);
        const american = await Recipe.find({ "category": "American" }).limit(limitNumber);
        const chinese = await Recipe.find({ "category": "Chinese" }).limit(limitNumber);
        const food = { latest, thai, american, chinese }
        res.status(200).render("index", { title: "Home", categories, food })

    } catch (e) {

        res.status(500).json(e)
    }
}
// ============ GET CATEGORIES ============
exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.status(200).render("categories", { title: "Categories", categories });
    } catch (e) {
        res.status(500).send(e);
    }
}

// =========== GET CATEGORIES BY ID =============

exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ "category": categoryId }).limit(limitNumber);
        res.status(200).render("categories", { title: "Categories", categoryById })
    } catch (e) {
        res.status(500).send(e)
    }
}


// ========== GET RECIPES ById ============

exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.status(200).render("recipe", { title: "Recipe", recipe })
    } catch (e) {
        res.status(500).send(e)
    }
}

// =========== POST SEARCH  ===========

exports.searchRecipe = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.status(200).render("search", { title: "Home", recipe })
    } catch (e) {
        res.status(500).send(e)
    }
}

// =========== GET EXPLORE RECIPE LATEST =============


exports.exploreLatest = async (req, res) => {

    try {

        const limitNumber = 20;
        const latestRecipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
        res.status(200).render("explore-latest", { title: "Explore Latest", recipe: latestRecipe })
    } catch (e) {
        res.status(500).send(e)
    }

}

// ===========  GET RANDOM RECIPE ==========

exports.exploreRandom = async (req, res) => {
    try {
        const count = await Recipe.find().countDocuments()
        const random = Math.floor(Math.random() * count);
        const randomRecipe = await Recipe.findOne().skip(random).exec();
        res.status(200).render("explore-random", { title: "Explore Random", recipe:randomRecipe });
    } catch (e) {
        res.status(500).send(e)
    }
}

// ============ GET SUBMIT RECIPE PAGE =============

exports.submitRecipe = async (req,res)=>{
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    res.status(200).render("submit-recipe",{title:"Submit Recipe",infoErrorsObj,infoSubmitObj});
}

// ========== SUBMIT RECIPE =================
exports.submitRecipeOnPost = async (req,res)=>{
    try{
    let imageUploadFile;
    let newImageName;
    let uploadPath;
    
    if(!req.files || Object.keys(req.files).length == 0){
        console.log("No files where uploaded!");
    }else{
        imageUploadFile = req.files;
        newImageName = Date.now() + imageUploadFile.image.name;
        uploadPath = require("path").resolve('./') + "/public/uploads/" + newImageName;
        imageUploadFile.image.mv(uploadPath,(e)=>{
          if(e) res.status(500).send(e)
        })

    }
    
    const newRecipe = await Recipe({
        name:req.body.name,
        description:req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
    })
    await newRecipe.save();
    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
    }catch(e){
        console.log(e,'error');
        req.flash('infoErrors', e);
        res.redirect('/submit-recipe');
    }
}