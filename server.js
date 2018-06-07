const hapi = require('hapi');
const {graphqlHapi, graphiqlHapi} = require('apollo-server-hapi');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');
const PaintingController = require('./controllers/PaintingController');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


const server = hapi.server({
  port:4000,
  host:'localhost'
});


server.route({
  method:'GET',
  path:'/',
  handler:function(request, reply){
    return '<h1>Hello ..</h1>';
  }
});

server.route({
  method:'GET',
  config:{
    description:'Get a specific painting',
    tags:['api','v1','painting']
  },
  path:'/api/v1/paintings',
  handler: PaintingController.list
});

server.route({
  method:'POST',
  path:'/api/v1/paintings',
  config:{
    description:'Create a painting',
    tags:['api','v1','painting']
  },
  handler: PaintingController.create
});


(async () => {
  try {
    await server.register({
      plugin: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions:{
          endpointURL:'/graphql'
        },
        route:{
          cors:true
        }
      }
    });

    await server.register({
      plugin: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions:{
          schema
        },
        route:{
          cors:true
        }
      }
    });


    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'Paintings API Documentation',
            version: Pack.version
          }
        }
      }
    ]);

    await server.start();
    // Once started, connect to Mongo through Mongoose
    mongoose.connect('mongodb://admin:admin123@ds149501.mlab.com:49501/mongoose-database-do-not-use-this-on-production')
    mongoose.connection.once('open',()=>{
      console.log('connected to database');
    });

    console.log(`Server running at: ${server.info.uri}`);
  }
  catch (err) {
    console.log(err)
  }
})();
