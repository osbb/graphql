import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';
import Promise from 'bluebird';
import seneca from 'seneca';
import winston from 'winston';

const senecaClient = seneca()
  .client({
    host: process.env.USERS_PORT_10101_TCP_ADDR,
    port: process.env.USERS_PORT_10101_TCP_PORT,
  });

const act = Promise.promisify(senecaClient.act, { context: senecaClient });

import { userType } from './types/user';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          _id: { type: GraphQLString },
        },
        resolve(_, query) {
          const { _id } = query;
          return act({ role: 'users', cmd: 'find', _id });
        },
      },
    },
  }),
});

express()
  .use('/graphql', graphqlHTTP({ schema, pretty: true }))
  .listen(3000, () => winston.info('GraphQL server running on http://localhost:3000/graphql'));
