import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";

interface FormData {
  name: string;
  summary: string;
  transit: string;
  house_rules: string;
  host_id: string;
  street: string;
  smart_location: string;
  country: string;
  latitude: string;
  longitude: string;
  room_type: string;
  bathRooms: string;
  bedRooms: string;
  beds: string;
  price: string;
  weekly_price: string;
}

const BASE_URL = "http://localhost:5000";

const AddRoomForm: React.FC = () => {
  const initialFormData: FormData = {
    name: "Cozy Apartment in Downtown",
    summary:
      "A cozy and well-furnished apartment located in the heart of the city. Close to all major attractions.",
    transit:
      "5-minute walk to the metro station, and various bus stops are nearby.",
    house_rules: "No smoking, no pets, no parties or events.",
    host_id: "", // This should be a valid host ID from your database
    street: "123 Main St",
    smart_location: "Downtown, CityName",
    country: "CountryName",
    latitude: "40.712776", // Example latitude for New York City
    longitude: "-74.005974", // Example longitude for New York City
    room_type: "Entire place",
    bathRooms: "1",
    bedRooms: "2",
    beds: "2",
    price: "150",
    weekly_price: "900",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [images, setImages] = useState<File[]>([]);
  const [user, setUser] = useState<any>();
  const [token, setToken] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages([...images, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    formData.host_id = user?._id;
    try {
      const roomResponse = await axios.post(
        BASE_URL + "/room/addRoom",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (roomResponse.data.status === "SUCCESS") {
        const roomId = roomResponse.data.room._id;

        for (const image of images) {
          const imageFormData = new FormData();
          imageFormData.append("image", image);
          imageFormData.append("room_id", roomId);

          const imageResponse = await axios.post(
            BASE_URL + "/room/addImageToRoom",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
              },
            }
          );

          if (imageResponse.data.status !== 200) {
            alert("Failed to upload one of the images");
            return;
          }
        }

        alert("Room and images created successfully");
        setFormData(initialFormData);
        setImages([]);
      } else {
        alert("Failed to create room");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Name" },
    { name: "summary", placeholder: "Summary" },
    { name: "transit", placeholder: "Transit" },
    { name: "house_rules", placeholder: "House Rules" },
    { name: "street", placeholder: "Street" },
    { name: "smart_location", placeholder: "Smart Location" },
    { name: "country", placeholder: "Country" },
    { name: "latitude", placeholder: "Latitude" },
    { name: "longitude", placeholder: "Longitude" },
    { name: "room_type", placeholder: "Room Type" },
    { name: "bathRooms", placeholder: "Bathrooms" },
    { name: "bedRooms", placeholder: "Bedrooms" },
    { name: "beds", placeholder: "Beds" },
    { name: "price", placeholder: "Price" },
    { name: "weekly_price", placeholder: "Weekly Price" },
  ];

  return (
    <div className="w-full text-black  rounded-lg shadow-md">
      <h1 className="text-3xl mt-4 mb-2 text-center text-white font-bold">
        Add Room
      </h1>
      <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-3">
        {inputFields.map((field) => (
          <div className="" key={field.name}>
            <input
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border bg-black/30 text-white backdrop-blur-md p-2 border-gray-300/20 rounded-lg"
              required
            />
          </div>
        ))}
        <div className="col-span-3">
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full border border-blue-300 rounded-lg"
          />
        </div>
        <div className="col-span-3">
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-[350px] h-[350px] object-cover rounded-[30px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500/50 text-white rounded-full p-1"
                  >
                    X
                  </button>
                  <p className="text-xs text-center mt-1">
                    {Math.round(image.size / 1024)} KB
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="col-span-3 w-full bg-white text-black py-2 rounded-lg hover:bg-blue-600"
        >
          Create Room and Upload Images
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
