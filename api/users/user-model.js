const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {

  const userPosts = await db("posts as p")
    .leftJoin("users as u", "p.user_id", "u.id")
    .select("p.id as post_id", "contents", "username")
    .where("user_id", user_id);
  return userPosts;

  /*

    Implement so it resolves this structure:
select 
p.id as post_id,
contents,
username
from posts as p
left join users as u
on p.user_id = u.id;
    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */

}

async function find() {
  const found = await db("users as u")
    .leftJoin("posts as p", "u.id", "p.user_id")
    .select("u.id as user_id", "username")
    .count("p.id as postcount")
    .groupBy("user_id");
  return found;
  /*
  select 
u.id as user_id,
username,
count(p.user_id) as postcount
from users as u 
left join posts as p
on u.id = p.user_id
group by p.user_id
order by postcount desc;
    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const foundById = await db("users as u")
    .leftJoin("posts as p", "u.id", "p.user_id")
    .select("u.id as user_id", "username", "contents", "p.id as post_id")
    .where('u.id',id);

  const posts = [];
  for (let key of foundById) {
    if (key.contents) {
      posts.push({
        post_id: key.post_id,
        contents: key.contents
      })
    }
  }
  const returnObj = {
    user_id: foundById[0].user_id,
    username: foundById[0].username,
    posts: posts
  }
  return returnObj;
  /*
    Improve so it resolves this structure:
select 
u.id as user_id,
username,
contents
from users as u left join 
posts as p 
on u.id = p.user_id
where u.id = 1;
    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}













/*
async function findPosts(user_id) {

  const rows = await db("posts as p")
    .select("p.id as post_id", "contents", "username")
    .join("users as u", "p.user_id", "=", "u.id")
    .where('u.id', user_id)
  return rows;
  /*
  select 
p.id as post_id,
contents,
username
from posts as p
left join users as u
on p.user_id = u.id;
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
/*
}

async function find() {
  const users = await db("users as u")
    .select("u.id as user_id", "username")
    .leftJoin("posts as p", "u.id", "=", "p.user_id")
    .count("p.id as post_count")
    .groupBy("u.id");
  return users;

  /*
    Improve so it resolves this structure:
select 
count(p.id) as post_count,
u.id as user_id,
username
from 
users as u left join posts as p
 on u.id = p.user_id
group by u.id;
    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
/*
}

async function findById(id) {
 const unStructuredData = await db("users as u")
   .leftJoin("posts as p", "u.id", "p.user_id")
   .select(
     "u.id as user_id",
     "username",
     "contents",
     "p.id as post_id"
   )
   .where({ user_id: id });
 const posts = [];
 for (let key of unStructuredData) {
     posts.push(
       {
         post_id: key.post_id,
         contents: key.contents,
       }
     )
 }
 const returnObj = {
   user_id: unStructuredData[0].user_id,
   username: unStructuredData[0].username,
   posts: posts,
 }
 return returnObj;
 /*
   Improve so it resolves this structure:
select 
u.id as user_id,
username,
contents,
p.id as post_id
from 
users as u left join posts as p
on u.id = p.user_id
where u.id = 1;
   {
     "user_id": 2,
     "username": "socrates"
     "posts": [
       {
         "post_id": 7,
         "contents": "Beware of the barrenness of a busy life."
       },
       etc
     ]
   }
 */
/*
}
*/


