import { ProgressBar } from "primereact/progressbar";
import PropTypes from "prop-types";

const ContentProgressBar = ({ currentProgress, fullStop }) => {
  const valueTemplate = () => {
    return (
      <>
        {currentProgress}/<b>{fullStop}</b>
      </>
    );
  };

  return (
    <div className="card">
      <ProgressBar
        value={(currentProgress / fullStop) * 100}
        displayValueTemplate={valueTemplate}
      />
    </div>
  );
};

ContentProgressBar.propTypes = {
  currentProgress: PropTypes.number.isRequired,
  fullStop: PropTypes.number.isRequired
};

export default ContentProgressBar;
