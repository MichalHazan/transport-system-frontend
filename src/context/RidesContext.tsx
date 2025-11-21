import { createContext, useState, useContext, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface Ride {
  _id: string;
  clientId: string;
  tripType: string;
  origin: string;
  destinations: string[];
  vehicleType: string;
  seats: number;
  status: string;
  createdAt: string;
}

interface RidesContextType {
  rides: Ride[];
  fetchClientRides: () => Promise<void>;
  createRide: (data: any) => Promise<void>;
}

export const RidesContext = createContext<RidesContextType>({
  rides: [],
  fetchClientRides: async () => {},
  createRide: async () => {},
});

export const RidesProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useContext(AuthContext);

  const [rides, setRides] = useState<Ride[]>([]);

  // טעינת נסיעות של לקוח מהשרת
  const fetchClientRides = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/client/ride`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRides(res.data);
    } catch (err) {
      console.error("Failed to fetch rides:", err);
    }
  };

  // יצירת נסיעה חדשה
  const createRide = async (data: any) => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/client/ride`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // הוספה למצב המקומי
      setRides((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to create ride:", err);
    }
  };

  return (
    <RidesContext.Provider
      value={{
        rides,
        fetchClientRides,
        createRide,
      }}
    >
      {children}
    </RidesContext.Provider>
  );
};
