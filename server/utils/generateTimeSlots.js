const generateTimeSlots = () => {
  const slots = [];
  let startTime = 9 * 60; // Start at 9:00 AM (in minutes)
  const endTime = 17 * 60; // End at 5:00 PM (in minutes)

  while (startTime < endTime) {
    const hours = Math.floor(startTime / 60);
    const minutes = startTime % 60;
    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`; // Format time as HH:MM

    // Skip break times
    if (formattedTime === "11:00") {
      startTime += 10; // Short break (10 minutes)
      continue;
    }
    if (formattedTime === "13:00") {
      startTime += 60; // Lunch break (1 hour)
      continue;
    }
    if (formattedTime === "15:30") {
      startTime += 10; // Short break (10 minutes)
      continue;
    }

    slots.push(formattedTime);
    startTime += 20; // Each appointment is 20 minutes
  }

  return slots;
};

export default generateTimeSlots;
