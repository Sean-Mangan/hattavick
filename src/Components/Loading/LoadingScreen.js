import "./LoadingScreen.css";

/**
 * LoadingScreen component
 * Displays a loading spinner with customizable background color
 *
 * @param {Object} props - Component props
 * @param {string} props.background - Background color for the loading screen (defaults to "black")
 */
const LoadingScreen = ({ background }) => {
  return (
    <div
      className="loading-wrap"
      style={{ backgroundColor: background || "black" }}
    >
      <span className="loader" />
    </div>
  );
};

export default LoadingScreen;
