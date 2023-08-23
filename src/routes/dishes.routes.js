const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ImageController = require("../controllers/ImageController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();
const imageController = new ImageController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post(
  "/",
  ensureAuthenticatedAdmin,
  upload.single("image"),
  dishesController.create
);

dishesRoutes.patch(
  "/image/:id",
  upload.single("image"),
  imageController.update
);

dishesRoutes.get("/", dishesController.index);

dishesRoutes.get("/:id", dishesController.show);

dishesRoutes.delete("/:id", ensureAuthenticatedAdmin, dishesController.delete);

dishesRoutes.put(
  "/:id",
  ensureAuthenticatedAdmin,
  upload.single("image"),
  dishesController.update
);

module.exports = dishesRoutes;
