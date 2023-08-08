const knex = require("../database/knex");
const AppError = require("../utils/AppError");

async function ensureAuthenticatedAdmin(request, response, next) {
  const user_id = request.user.id;

  const user = await knex("users").where({ id: user_id }).first();

  if (!user.isAdmin) {
    throw new AppError("Somente para usuário administrador", 401);
  }

  next();
}

module.exports = ensureAuthenticatedAdmin;
