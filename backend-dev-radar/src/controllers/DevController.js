const axios = require('axios');
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
/**
 * index(mostrar lista de recurso)
 * show(mostrar um único recurso)
 * store(criar um recurso)
 * update(atualizar um recurso)
 * destroy(deletar um recurso)
 */

module.exports = {

  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      // Api de usuários do GitHub
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      /**
       * Filtra as conexões num raio de no máximo 10 km,
       * além do novo dev ter pelo menos uma das tecnologias filtradas
       */

      const sendSocketMesageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMesageTo, 'new-dev', dev);

    }

    return response.json(dev);
  }
}