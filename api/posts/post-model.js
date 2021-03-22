const db = require("../../data/db-config.js");

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};

async function get() {
  const sql = await db("post").toString();
  console.log(sql);
  const post = await db("posts");
  return post;
}

async function getById(id) {
  const [post] = await db("posts").where({ id });
  return post;
}

async function create(data) {
  const [postId] = await db("posts").insert(data);
  const newPost = await getById(postId);
  return newPost;
}

async function update(id, changes) {
  const count = await db("posts").where({ id }).update(changes);
  return count;
}

async function remove(id) {
  const resultCount = await db('posts').where({ id }).del();
  return resultCount;
}
