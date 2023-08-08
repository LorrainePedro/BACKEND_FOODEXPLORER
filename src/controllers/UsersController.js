const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdmin } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Por favor, verifique e preencha todos os campos.");
    }

    const checkUserExists = await knex("users").where("email", email).first();
    if (checkUserExists) {
      throw new AppError("E-mail já cadastrado");
    }

    const hashedPassword = await hash(password, 8); //cryptografia e salt(complexidade)

    await knex("users").insert({
      name,
      email,
      password: hashedPassword, //ja no bcrypt
      isAdmin,
    });

    return response.status(201).json();
  }
}

module.exports = UsersController;
