// Array of vibrant colors for class cards - will be used based on index or can be assigned from backend
export const cardColors = [
  {
    bg: "#8FA31E",
    gradient: "linear-gradient(135deg, #8FA31E 0%, #A8BD2A 100%)",
  }, // Olive green
  {
    bg: "#C1856D",
    gradient: "linear-gradient(135deg, #C1856D 0%, #D69980 100%)",
  }, // Terracotta
  {
    bg: "#3B38A0",
    gradient: "linear-gradient(135deg, #3B38A0 0%, #524DBF 100%)",
  }, // Purple
  {
    bg: "#E74C3C",
    gradient: "linear-gradient(135deg, #E74C3C 0%, #EC7063 100%)",
  }, // Red
  {
    bg: "#3498DB",
    gradient: "linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)",
  }, // Blue
  {
    bg: "#F39C12",
    gradient: "linear-gradient(135deg, #F39C12 0%, #F5B041 100%)",
  }, // Orange
  {
    bg: "#1ABC9C",
    gradient: "linear-gradient(135deg, #1ABC9C 0%, #48C9B0 100%)",
  }, // Turquoise
  {
    bg: "#9B59B6",
    gradient: "linear-gradient(135deg, #9B59B6 0%, #AF7AC5 100%)",
  }, // Amethyst
  {
    bg: "#E67E22",
    gradient: "linear-gradient(135deg, #E67E22 0%, #EB984E 100%)",
  }, // Carrot
  {
    bg: "#16A085",
    gradient: "linear-gradient(135deg, #16A085 0%, #1ABC9C 100%)",
  }, // Green Sea
];

// Function to get color for a class - can be customized based on backend data
export const getCardColor = (index: number) => {
  return cardColors[index % cardColors.length];
};
