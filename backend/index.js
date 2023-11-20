const { ApolloServer } = require("@apollo/server");
const { GraphQLError, GraphQLScalarType } = require("graphql");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { pool } = require("./config");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const dateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

const typeDefs = `
    scalar Date
    type Count {
        count: String
    }
   
    type Token {
        value: String!
    }
    type Note {
        note_id: ID!
        user_id:ID!
        username: String
        content: String!
        is_important: Boolean!
        is_public:Boolean!
        created_at: Date!
    }
    type User {
        user_id: ID!
        username: String!
        email: String!
        password: String!
        created_at: Date!
        is_admin: Boolean
        suspended: Boolean
    }
    type Mutation {
        addNote(
            user_id: ID
            content: String!
            is_important: Boolean!
            is_public: Boolean!
        ): [Note]
        login(
            username: String!
            password: String!
          ): Token
        createUser(
            username: String!
            password: String!
            email: String!
        ): [User]
        editNote(
          note_id: ID!
          is_important: Boolean!
        ):[Note]
    }
    type Query {
        allNotes: [Note!]!
        noteCount: [Count]!
        me: User
    }
`;

const resolvers = {
  Date: dateScalar,
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    allNotes: async () => {
      try {
        const data = await pool.query(
          "SELECT n.note_id, n.user_id, n.content, n.is_public, n.is_important, n.created_at, u.username FROM notes n join users u on n.user_id = u.user_id WHERE n.is_public=true ORDER BY n.created_at DESC;"
        );

        if (data.rowCount == 0) {
          return res.status(404).send("No note exists");
        }
        return data.rows;
      } catch (error) {
        throw new GraphQLError("Retrieve users failure", {
          extensions: {
            code: "Retrieve User error",
            error,
          },
        });
      }
    },
    noteCount: async () => {
      try {
        const data = await pool.query("SELECT Count(*) from notes;");
        console.log(data.rows);
        return data.rows;
      } catch (error) {
        throw new GraphQLError("Note count failure", {
          extensions: {
            code: "Note count error",
            error,
          },
        });
      }
    },
  },
  Mutation: {
    addNote: async (root, args, context) => {
      const { content, is_important, is_public } = args;
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("User not Authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const addNoteQuery =
          "insert into notes (user_id, content, is_important, is_public) values ($1, $2,$3, $4) returning *;";
        const noteValues = [
          currentUser.user_id,
          content,
          is_important,
          is_public,
        ];
        const data = await pool.query(addNoteQuery, noteValues);
        return [{ ...data.rows[0], username: currentUser.username }];
      } catch (error) {
        throw new GraphQLError("Add Note failure", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    editNote: async (root, args, context) => {
      const currentUser = context.currentUser;
      const { note_id, is_important } = args;
      if (!currentUser) {
        throw new GraphQLError("User not Authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const editNoteQuery =
          "UPDATE notes set is_important = $2 where note_id = $1 returning *;";
        const editValues = [note_id, !is_important];
        const data = await pool.query(editNoteQuery, editValues);

        return [data.rows[0]];
      } catch (error) {
        throw new GraphQLError("Add Note failure", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const { username, email, password } = args;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      try {
        const addUserQuery =
          "INSERT INTO users (username, email, password) values ($1, $2, $3) returning *;";
        const userValues = [username, email, passwordHash];
        const data = await pool.query(addUserQuery, userValues);
        console.log("USER ROWS", data.rows);

        return data.rows;
      } catch (error) {
        throw new GraphQLError("Add User failure", {
          extensions: {
            code: "Failed to add user",
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const { username, password } = args;
      const query = "SELECT * FROM users WHERE username=$1;";
      const value = [username];

      try {
        const data = await pool.query(query, value);

        if (data.rowCount == 0) {
          return res.status(404).send("User does not exist");
        }
        const user = data.rows[0];

        console.log("USER", user);

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
          throw new GraphQLError("wrong credentials", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        if (user.suspended) {
          throw new GraphQLError("suspended user", {
            extensions: {
              code: "USER_SUSPENDED",
            },
          });
        }

        const userForToken = {
          username: user.username,
          id: user.user_id,
        };

        return {
          value: jwt.sign(userForToken, process.env.SECRET),
        };
      } catch (error) {
        throw new GraphQLError("Find User failure", {
          extensions: {
            code: "Failed to find user",
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const query = "SELECT * FROM users WHERE user_id=$1;";
      const value = [decodedToken.id];

      try {
        const data = await pool.query(query, value);
        const currentUser = data.rows[0];
        return { currentUser };
      } catch (error) {
        throw new GraphQLError("Find User failure", {
          extensions: {
            code: "Failed to find user",
            error,
          },
        });
      }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
