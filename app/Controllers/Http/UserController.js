'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with users
 */
class UserController {

  async register({ request, response }) {
    const rules = {
      nome: 'required',
      email: 'required|email|unique:users,email',
      senha: 'required',
    }

    const messages = {
      'nome.required': 'O campo nome é obrigatório',
      'email.required': 'O campo email é obrigatório',
      'email.email': 'O dado informado não é um e-mail',
      'email.unique': 'Esse e-mail já está cadastrado',
      'senha.required': 'O campo senha é obrigatório',
    }

    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      return response.status(401).send({ message: validation.messages() })
    }

    const dataUser = request.only(['nome', 'email', 'senha']);

    const user = await User.create(dataUser);

    return user;
  }

  async login({ request, auth }) {
    const { email, senha } = request.all();

    const token = await auth.attempt(email, senha);

    return token;
  }
}

module.exports = UserController
