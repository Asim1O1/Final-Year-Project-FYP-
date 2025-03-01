const generateTimeSlots = () => {
  const slots = [];
  let startTime = 9 * 60; // 9:00 AM in minutes
  const endTime = 16 * 60; // 4:00 PM in minutes

  while (startTime < endTime) {
    const hours = Math.floor(startTime / 60);
    const minutes = startTime % 60;
    const formattedTime = `${hours}:${minutes === 0 ? "00" : minutes}`;

    // Skip break times
    if (formattedTime === "11:00") {
      startTime += 10; // Short break (10 minutes)
      continue;
    }
    if (formattedTime === "13:00") {
      startTime += 30; // Lunch break (30 minutes)
      continue;
    }
    if (formattedTime === "15:00") {
      startTime += 10; // Short break (10 minutes)
      continue;
    }

    slots.push(formattedTime);
    startTime += 20; // Each appointment is 20 minutes
  }

  return slots;
};

export default generateTimeSlots;
