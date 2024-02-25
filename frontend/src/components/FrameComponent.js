import { useMemo } from "react";
import "./FrameComponent.css";

const FrameComponent = ({
  vectorIconSupport,
  familySupport,
  propGap,
  propWidth,
  propHeight,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      gap: propGap,
    };
  }, [propGap]);

  const vectorIconSupportStyle = useMemo(() => {
    return {
      width: propWidth,
      height: propHeight,
    };
  }, [propWidth, propHeight]);

  return (
    <div className="icon-parent" style={frameDivStyle}>
      <div className="icon4">
        <div className="icon5">
          <div className="bg5" />
          <img
            className="vector-icon-support"
            loading="eager"
            alt=""
            src={vectorIconSupport}
            style={vectorIconSupportStyle}
          />
        </div>
        <h3 className="family-support">{familySupport}</h3>
      </div>
      <div className="frame-secondary-button">
        <div className="lorem-ipsum-dolor2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros.
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;
