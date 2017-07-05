
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString} = require('graphql');
const {createGraphQLFormHandlerMutation} = require('graphql-form-handler');
const express = require('express');
const expressGraphQL = require('express-graphql');
const path = require('path');

const app = express();

const mutationConfig = {
  mailgun: {
    apiKey: 'key-70a23f018e14888a6a53b4b50884ed28',
    domain: 'sandbox211cd09460474297b0cf95137d28243d.mailgun.org',
    from: 'EBNM Automated Email <no-reply@ebnm.com>',
    to: 'mlynam@iteamnm.com',
    subject: 'Contact Request from Customer',
  },
  template: `
    <html>
      <body>
        <p>Here's a form submission!</p>
        {{{formData}}}
      </body>
    </html>`,
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'test',
    fields: {
      hello: { type: GraphQLString }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'emailForm',
    fields: () => ({
      formHandler: createGraphQLFormHandlerMutation(mutationConfig)
    })
  })
});

app.use('/graphql', expressGraphQL((request) => ({
  schema,
  graphiql: true,
  rootValue: {request},
})));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(3000);
