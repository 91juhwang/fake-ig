let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");
let Pusher = require("pusher");
let bodyParser = require("body-parser");
let Multipart = require("connect-multiparty");

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type User {
    id : String!
    nickname : String!
    avatar : String!
  }
  type Post {
      id: String!
      user: User!
      caption : String!
      image : String!
  }
  type Query{
    user(id: String) : User!
    post(user_id: String, post_id: String) : Post!
    posts(user_id: String) : [Post]
  }
`);

// Maps id to User object
let userslist = {
  a: {
    id: "a",
    nickname: "James",
    avatar: "https://via.placeholder.com/30"
  },
  b: {
    id: "b",
    nickname: "OG",
    avatar:
      "https://via.placeholder.com/30"
  }
};

let postslist = {
  a: {
    a: {
      id: "a",
      user: userslist["a"],
      caption: "Moving the community!",
      image: "https://drive.google.com/open?id=1uIUzf239Jn7KsC-y1WvIXgYqBFD-BaTQ"
    },
    b: {
      id: "b",
      user: userslist["a"],
      caption: "Angular Book :)",
      image:
        "https://drive.google.com/open?id=1c2j-09wK7Elkt3nw_pX_MnW8L51mRcI-"
    },
    c: {
      id: "c",
      user: userslist["a"],
      caption: "Me at Frontstack.io",
      image: "https://drive.google.com/open?id=15mpAQ_ZePg2MnH744FGXvMU9K_lKyzBH"
    },
    d: {
      id: "d",
      user: userslist["a"],
      caption: "Moving the community!",
      image: "https://drive.google.com/open?id=0Byxeja4jYwq4bTFYVmp4d04xbGs"
    }
  }
};

// The root provides a resolver function for each API endpoint
let root = {
  user: function({ id }) {
    return userslist[id];
  },
  post: function({ user_id, post_id }) {
    return postslist[user_id][post_id];
  },
  posts: function({ user_id }) {
    return Object.values(postslist[user_id]);
  }
};

// Configure Pusher client
let pusher = new Pusher({
  app_id = "770238",
  key = "63ff6cee753f69383227",
  secret = "30aa46d4c14188e2893e",
  cluster = "us2",
  encrypted: true
});

// create express app
let app = express();
app.use(cors());
app.use(bodyParser.json());

let multipartMiddleware = new Multipart();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

// trigger add a new post
app.post('/newpost', multipartMiddleware, (req,res) => {
  // create a sample post
  let post = {
    user : {
      nickname : req.body.name,
      avatar : req.body.avatar
    },
    image : req.body.image,
    caption : req.body.caption
  }

  // trigger pusher event
  pusher.trigger("posts-channel", "new-post", {
    post
  });

  return res.json({status : "Post created"});
});


app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
