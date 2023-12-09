import { graph, connector, config, auth } from '@grafbase/sdk';

// Create a standalone graph
const g = graph.Standalone();

// MongoDB connector configuration
const mongo = connector.MongoDB('MongoDB', {
  apiKey: g.env('MONGODB_API_KEY'),
  url: g.env('MONGODB_API_URL'),
  dataSource: g.env('MONGODB_DATASOURCE'),
  database: g.env('MONGODB_DATABASE'),
})

// Register the MongoDB connector as a data source
g.datasource(mongo);

// Define the User model
mongo
  .model('User', {
    name: g.string(),
    email: g.string().unique(),
    avatarUrl: g.url(),
    description: g.string().optional(),
    githubUrl: g.url().optional(),
    linkedInUrl: g.url().optional(),
    // project: g.relation('Project').list().optional(), // Reference to Project model
  })
  .collection('users');

// Define the Project model
mongo
  .model('Project', {
    title: g.string(),
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    category: g.string(),
    // createdBy: g.relation('User'), // Reference to User model
  })
  .collection('project');

// JWT authentication configuration
const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET'),
});

// Configure Grafbase project
export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.public(), // Update as needed for your auth strategy
  },
});

