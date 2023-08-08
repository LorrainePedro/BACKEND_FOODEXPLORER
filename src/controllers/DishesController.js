const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;

    const checkDishExists = await knex("plates").where("title", title).first();

    if (checkDishExists) {
      throw new AppError("Esse prato já existe.");
    }

    if (!title || !description || !category || !price) {
      throw new AppError("Por favor, verifique e preencha todos os campos.");
    }

    const [dishes_id] = await knex("dishes").insert({
      title,
      description,
      category,
      price,
    });

    if (ingredients) {
      const ingredientsInsert = ingredients.map((ingredient) => {
        return {
          name: ingredient,
          dishes_id,
        };
      });

      await knex("ingredients").insert(ingredientsInsert);
    }

    return response.status(201).json(dishes_id);
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, category, price } = request.body;
    const imageFile = request.file;

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
    return response.json({ dish });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .orderBy("name");

    return response.json({
      ...dish,
      ingredients,
    });
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
        .whereLike("dishes.title"`%${title}`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .orderBy("ingredients.name");
    } else {
      dishes = await knex("dishes")
        .whereLike("title", `%${title}`)
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
