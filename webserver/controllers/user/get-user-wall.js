"use strict";

const PostModel = require("../../../models/post-model");
const WallModel = require("../../../models/wall-model");

// Busco con esta funcion => getUserWall; que me devuelva el post de aforo. Dicho post puede ser modificado, pero siempre será un único post, no un array de distintos post.

async function getPostById(postId) {
  /*
  Cast to ObjectId failed for value "{ posts: [ 5c86b84550628640c414831b ] }" at path "_id" for model "Post"
  */
  const filter = {
    _id: {
      $in: postId
    },
    deletedAt: null
  };

  const projection = {
    __v: 0,
    deletedAt: 0
  };

  const post = await PostModel.find(filter, projection).lean();

  return post;
}

async function getUserWall(req, res, next) {
  const { uuid } = req.claims;

  const filter = {
    uuid
  };

  const projection = {
    _id: 0,
    post: 1
  };

  try {
    const wall = await WallModel.findOne(filter, projection).lean();

    if (!wall) {
      return {
        data: ""
      };
    }
    console.log("hasta aqui va en get-user-wall"); // ¿por qué no va lo de abajo?
    // const post = await getPostById(wall.post);

    // const response = {
    //   data: post
    // };
    return res.send(); // hay un response dentro del parentesis
  } catch (e) {
    return res.status(500).send(e.message); // 500 Internal Server Error - HTTP
  }
}

module.exports = getUserWall;
