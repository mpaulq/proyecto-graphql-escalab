const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
require('dotenv').config();
const { authCheckMiddleware } = require('./helpers/auth');
const cors = require('cors');
// const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');

// express server
const app = express()

// db conection
const db = async () => {
    try {
        const mongoDB = process.env.MONGO_DB || 'mongodb://localhost:27017/gql-react-node';
        const success = await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log('DB connected');
    } catch (err) {
        console.error('DB connection error', err);
    }
};

// exec db connection
db();

// middlewares
app.use(cors());
// app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));

// typedefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typedefs')));
// resolvers
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

// graphql server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => ({req, res})
});

// vinculation Apollo Server with Express framework
apolloServer.applyMiddleware({ app });

// server
const httpServer = http.createServer(app);

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// example endpoint
app.get('/rest', authCheckMiddleware, function(req, res) {
    res.json({
        data: 'Rest endpoint successful!',
    })
});

// upload cloudinary
app.post("/uploadimages", authCheckMiddleware, (req, res) => {
    cloudinary.uploader.upload(
      req.body.image,
      (result) => {
        console.log(result);
        res.send({
          url: result.secure_url,
          public_id: result.public_id
        });
      },
      {
        public_id: `${Date.now()}`, // public name
        resource_type: "auto" // JPEG, PNG
      }
    )
    .then((callback) => callback());
  });

// remove images
app.post('/removeimage', authCheckMiddleware, (req, res) => {
    let image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (error, result) => {
        if (error) return res.json({ success: false, error });
        res.send({ success: true });
    });
});

// port
const port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log(`server is ready at http://localhost:${port}`);
    console.log(`graphql server is ready at http://localhost:${port}${apolloServer.graphqlPath}`);
})