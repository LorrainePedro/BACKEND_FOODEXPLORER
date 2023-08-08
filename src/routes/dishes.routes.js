const { Router, response, request } = require("express");
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

dishesRoutes.post("/", ensureAuthenticatedAdmin, dishesController.create);

dishesRoutes.patch(
  "/image/:id",
  ensureAuthenticatedAdmin,
  upload.single("image"),
  imageController.update
);

// dishesRoutes.patch(
//   "/image/:id",
//   upload.single("image"),
//   imageController.update
// );

dishesRoutes.delete("/:id", ensureAuthenticatedAdmin, dishesController.delete);

dishesRoutes.put(
  "/:id",
  ensureAuthenticatedAdmin,
  upload.single("image"),
  dishesController.update
);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.get("/", dishesController.index);

module.exports = dishesRoutes;
