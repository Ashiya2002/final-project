// import { GraphQLClient } from "graphql-request";

// import {
//   createProjectMutation,
//   createUserMutation,
//   deleteProjectMutation,
//   updateProjectMutation,
//   getProjectByIdQuery,
//   getProjectsOfUserQuery,
//   getUserQuery,
//   projectsQuery,
//   allProject,
// } from "@/graphql";
// import { ProjectForm } from "@/common.types";

// const isProduction = process.env.NODE_ENV === "production";
// const apiUrl = isProduction
//   ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
//   : "http://127.0.0.1:4000/graphql";
// const apiKey = isProduction
//   ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
//   : "letmein";
//   const serverUrl = isProduction
//   ? process.env.NEXT_PUBLIC_SERVER_URL
//   : "http://localhost:3000";

// const client = new GraphQLClient(apiUrl);

// export const fetchToken = async () => {
//   try {
//     const response = await fetch(`${serverUrl}/api/auth/token`);
//     return response.json();
//   } catch (error) {
//     throw error;
//   }
// };

// export const uploadImage = async (imagePath: string) => {
//   try {
//     const response = await fetch(`${serverUrl}/api/upload`, {
//       method: "POST",
//       body: JSON.stringify({
//         path: imagePath
//       }),
//     });
//     return response.json();
//   } catch (error) {
//     throw error;
//   }
// };

// const makeGraphQLRequest = async (query: string, variables = {}) => {
//   try {
//     return await client.request(query, variables);
//   } catch (error) {
//     throw error;
//   }
// };

// export const fetchAllProjects = async (category?: string, endcursor?: string) => {
//   client.setHeader("x-api-key", apiKey);
//   if (!category) return makeGraphQLRequest(allProject, { endcursor });
//   else return makeGraphQLRequest(projectsQuery, { category, endcursor });
// }

// export const createNewProject = async (
//   form: ProjectForm,
//   creatorId: string,
//   token: string
// ) => {
//   const imageUrl = await uploadImage(form.image);

//   if(imageUrl.url) {
//     client.setHeader("Authorization", `Bearer ${token}`);

//     const variables = {
//       input: {
//         ...form,
//         image: imageUrl.url,
//         createdBy: {
//           link: creatorId,
//         }
//       }
//     };

//     return makeGraphQLRequest(createProjectMutation, variables);
//   }
// };

// export const updateProject = async (
//   form: ProjectForm,
//   projectId: string,
//   token: string
// ) => {
//   function isBase64DataURL(value: string) {
//     const base64Regex = /^data:image\/[a-z]+;base64,/;
//     return base64Regex.test(value);
//   }

//   let updatedForm = { ...form };

//   const isUploadingNewImage = isBase64DataURL(form.image);

//   if (isUploadingNewImage) {
//     const imageUrl = await uploadImage(form.image);

//     if (imageUrl.url) {
//       updatedForm = { ...updatedForm, image: imageUrl.url };
//     }
//   }

//   client.setHeader("Authorization", `Bearer ${token}`);

//   const variables = {
//     id: projectId,
//     input: updatedForm,
//   };

//   return makeGraphQLRequest(updateProjectMutation, variables);
// };

// export const deleteProject = (id: string, token: string) => {
//   client.setHeader("Authorization", `Bearer ${token}`);
//   return makeGraphQLRequest(deleteProjectMutation, { id });
// };

// export const getProjectDetails = async (id: string) => {
//   client.setHeader("x-api-key", apiKey);
//   return makeGraphQLRequest(getProjectByIdQuery, { id });
// };

// export const createUser = (name: string, email: string, avatarUrl: string) => {
//   client.setHeader("x-api-key", apiKey);

//   const variables = {
//     input: {
//       name: name,
//       email: email,
//       avatarUrl: avatarUrl,
//     },
//   };

//   return makeGraphQLRequest(createUserMutation, variables);
// };

// export const getUserProjects = (id: string, last?: number) => {
//   client.setHeader("x-api-key", apiKey);
//   return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
// };

// export const getUser = (email: string) => {
//   client.setHeader("x-api-key", apiKey);
//   return makeGraphQLRequest(getUserQuery, { email });
// };


import { MongoClient, ObjectId, Db } from 'mongodb';

// MongoDB connection URI and database name
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'myDatabase';

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectDB(): Promise<Db> {
  await client.connect();
  return client.db(dbName);
}

// Define interfaces for your data models
interface Project {
  // Define project model properties here
  category?: string;
  createdBy?: string;
  // ... other properties
}

interface User {
  // Define user model properties here
  email: string;
  // ... other properties
}

export const fetchAllProjects = async (category?: string): Promise<Project[]> => {
  const db = await connectDB();
  const query = category ? { category } : {};
  return await db.collection<Project>('project').find(query).toArray();
};

export const getProjectDetails = async (id: string): Promise<Project | null> => {
  const db = await connectDB();
  return await db.collection<Project>('project').findOne({ _id: new ObjectId(id) });
};

export const createNewProject = async (projectData: Project): Promise<void> => {
  const db = await connectDB();
  await db.collection<Project>('project').insertOne(projectData);
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<void> => {
  const db = await connectDB();
  await db.collection<Project>('project').updateOne({ _id: new ObjectId(id) }, { $set: projectData });
};

export const deleteProject = async (id: string): Promise<void> => {
  const db = await connectDB();
  await db.collection<Project>('project').deleteOne({ _id: new ObjectId(id) });
};

export const createUser = async (userData: User): Promise<void> => {
  const db = await connectDB();
  await db.collection<User>('user').insertOne(userData);
};

export const getUser = async (email: string): Promise<User | null> => {
  const db = await connectDB();
  return await db.collection<User>('user').findOne({ email });
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const db = await connectDB();
  return await db.collection<Project>('project').find({ createdBy: userId }).toArray();
};

// Remember to close the MongoDB connection when your app is terminating
process.on('exit', () => client.close());

