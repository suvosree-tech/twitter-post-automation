import axios from "axios";

// Create an Axios instance with base URL
const publicapi = axios.create({
  baseURL: "https://twitter-post-automation.onrender.com",
});

// 1. Generate a tweet
export const generatepost = (data) => {
  return publicapi.post("/tweet/generate-tweet", data);
};

// 2. Post a tweet to Twitter by ID
export const posttweet = (id) => {
  return publicapi.post(`/tweet/post-tweet/${id}`);
};

// 3. Get all tweets (with optional query parameters)
export const getAllTweets = (params = {}) => {
  // params can include: posted (true/false), search (string), limit, offset
  return publicapi.get("/tweet/tweets", { params });
};

// 4. Update a tweet by ID
export const updateTweet = (id, data) => {
  // data should match Tweet_update schema (topic/content can be null or string)
  return publicapi.put(`/tweet/update/${id}`, data);
};
