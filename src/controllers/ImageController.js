const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class ImageController {
  async update(request, response) {
    const dish_id = request.params.id;
    const imageFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (!dish) {
      throw new AppError(
        "O prato selecionado para fazer o upload da imagem não existe. Tente novamente.",
        401
      );
    }

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFilename);
    dish.image = filename;

    await knex("dishes").update(dish).where({ id: dish_id });

    return response.json(dish);
  }
}

module.exports = ImageController;
