'use strict';
const User = use('App/Models/User');

class UserController {
  async store({ request, reponse }) {
    const data = request.only(['cpf', 'password']);
    const user = await User.create(data);

    return user;
  }
}

module.exports = UserController;
