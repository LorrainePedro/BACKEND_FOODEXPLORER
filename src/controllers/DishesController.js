const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;

    let image = null;
    let filename = null;

    const diskStorage = new DiskStorage();

    const checkDish = await knex("dishes").where({ title }).first();

    if (checkDish) {
      throw new AppError("Não é possível criar pratos repetidos.");
    }

    if (request.file) {
      image = request.file.filename;
      filename = await diskStorage.saveFile(image);
      console.log(image);
    }

    const [dishes_id] = await knex("dishes").insert({
      title,
      description,
      category,
      price,
      image: image ? filename : null,
    });

    const ingredientsInsert = ingredients.map((ingredients) => {
      return {
        dishes_id,
        name: ingredients,
      };
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, category, price } = request.body;
    const imageFile = request.file;
    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where("id", id).first();

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.category = category ?? dish.category;
    dish.price = price ?? dish.price;

    if (imageFile) {
      const imageFilename = imageFile.filename;

      const newFilename = await diskStorage.saveFile(imageFilename);

      dish.image = newFilename;
    }

    await knex("dishes").where("id", id).update({
      title: dish.title,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      image: dish.image,
    });

    return response.json(dish);
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dishes_id: id })
      .orderBy("name");

    return response.json({
      ...dish,
      ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, ingredients } = request.query;
    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .whereLike("dishes.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
        .orderBy("dishes.title");
    } else {
      dishes = await knex("dishes")
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const dishesIngredients = await knex("ingredients");
    const dishesWithIngredients = dishes.map((dish) => {
      const dishIngredients = dishesIngredients.filter(
        (ingredient) => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishIngredients,
      };
    });

    return response.json(dishesWithIngredients);
  }
}

module.exports = DishesController;
