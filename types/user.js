import { GraphQLObjectType, GraphQLString } from 'graphql';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: { type: GraphQLString },
    profile: {
      type: new GraphQLObjectType({
        name: 'UserProfile',
        fields: {
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
        },
      }),
    },
  },
});
