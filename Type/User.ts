export interface User {
  _id: string;
  name: string;
  email: string;
  created_at: string; // Assuming this is a date string
  phone_number: string;
  isLogedIn: boolean;
}
