'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [plants, setPlants] = useState([
    { id: 1, name: 'Monstera', wateringInterval: 21, lastWatered: null },
    { id: 2, name: 'Rose', wateringInterval: 3, lastWatered: null },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60 * 60); // Update every hour
    return () => clearInterval(timer);
  }, []);

  const waterPlant = (id: number) => {
    setPlants(plants.map(plant => 
      plant.id === id ? { ...plant, lastWatered: new Date() } : plant
    ));
  };

  const getNextWateringDate = (plant: { lastWatered: Date | null, wateringInterval: number }) => {
    if (!plant.lastWatered) return 'Not watered yet';
    const nextDate = new Date(plant.lastWatered);
    nextDate.setDate(nextDate.getDate() + plant.wateringInterval);
    return nextDate.toLocaleDateString();
  };

  const getDaysUntilWatering = (plant: { lastWatered: Date | null, wateringInterval: number }) => {
    if (!plant.lastWatered) return plant.wateringInterval;
    const nextDate = new Date(plant.lastWatered);
    nextDate.setDate(nextDate.getDate() + plant.wateringInterval);
    const diffTime = nextDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedPlants = [...plants].sort((a, b) => getDaysUntilWatering(a) - getDaysUntilWatering(b));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Plant Watering Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedPlants.map(plant => (
          <div key={plant.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{plant.name}</h2>
            <p>Watering Interval: Every {plant.wateringInterval} days</p>
            <p>Last Watered: {plant.lastWatered ? plant.lastWatered.toLocaleDateString() : 'Not yet watered'}</p>
            <p>Next Watering: {getNextWateringDate(plant)}</p>
            <p>Days until next watering: {getDaysUntilWatering(plant)}</p>
            <button 
              onClick={() => waterPlant(plant.id)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Water Plant
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}