var Painting =  require('../models/Painting');

/**
 * List paintings
 */
exports.list = (req, h) => {
  return Painting.find({}).exec().then((painting) => {

    return { painting: painting };

  }).catch((err) => {

    return { err: err };

  });
}

/**
 * Get painting by ID
 */
exports.get = (req, h) => {

  return Painting.findById(req.params.id).exec().then((painting) => {

    if(!painting) return { message: 'painting not Found' };

    return { painting: painting };

  }).catch((err) => {

    return { err: err };

  });
}


/**
 * POST a painting
 */
exports.create = (req, h) => {

  const paintingData = {
    name:req.payload.name,
    url: req.payload.url,
    techniques: req.payload.techniques
  };

  return Painting.create(paintingData).then((painting) => {

     return { message: "painting created successfully", painting: painting };

  }).catch((err) => {

    return { err: err };

  });
}

/**
 * PUT | Update painting by ID
 */
exports.update = (req, h) => {

  return Painting.findById(req.params.id).exec().then((painting) => {

    if (!painting) return { err: 'painting not found' };

    painting.name = req.payload.name;
    painting.url = req.payload.url;
    painting.techniques = req.payload.techniques;
  
    Painting.save(paintingData);

  }).then((data) => {

      return { message: "painting data updated successfully" };

  }).catch((err) => {

      return { err: err };

  });
}

/**
 * Delete painting by ID
 */
exports.remove = (req, h) => {

  return Painting.findById(req.params.id).exec(function (err, painting) {

    if (err) return { dberror: err };
    if (!painting) return { message: 'painting not found' };

    Painting.remove(function (err) {
      if (err) return { dberror: err };

      return { success: true };
    });
  });
}
