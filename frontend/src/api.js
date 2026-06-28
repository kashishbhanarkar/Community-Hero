import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllIssues = () => API.get("/api/issues");

export const createIssue = (issueData) =>
  API.post("/api/issues", issueData);

export const registerUser = (userData) =>
  API.post("/api/users/register", userData);

export const loginUser = (credentials) =>
  API.post("/api/users/login", credentials);

export const getUserById = (id) =>
  API.get(`/api/users/${id}`);

export const updateIssueStatus = (id,status) =>
    API.put(`/api/issues/${id}/status`, {
        status
    });

export const analyzeWithGemini = async (description, category) => {
  const response = await fetch("http://localhost:8080/api/gemini/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        description: description,
        category: category
      }),

  });

 const text = await response.text();

console.log("Backend Response:", text);

if (!response.ok) {
  throw new Error(text);
}

return typeof text === "string"
  ? JSON.parse(text)
  : text;
};