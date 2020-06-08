const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {

  async index(request, response) {

    const { latitude, longitude, techs } = request.query;

    const techsArray = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray, // Dentro 'de'
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // Em metros (10km)
        },
      },
    });

    return response.json({ devs });
  },

  async update(request, response) {

    const devId = request.params.id;

    const { techs, name, avatar_url, bio, latitude, longitude } = request.body;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

    const dev = await Dev.findByIdAndUpdate(
      devId,
      {
        techs: techsArray,
        name,
        avatar_url,
        bio,
        location
      },
      { new: true }
    );
    return response.json({ dev });
  },

  async destroy(request, response) {
    const devId = request.params.id;

    const dev = await Dev.findByIdAndRemove(devId);

    return response.json({ dev });
  },

};