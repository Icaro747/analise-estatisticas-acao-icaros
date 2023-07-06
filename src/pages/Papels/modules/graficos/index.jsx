import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";

import * as S from "./style";

const Grafico = ({ data }) => {
  return (
    <S.BoxG>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: true,
          reverse: false
        }}
        xFormat=" >-"
        yFormat=" >-.2f"
        axisTop={null}
        enablePointLabel
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle"
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle"
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableArea
        useMesh
      />
    </S.BoxG>
  );
};

Grafico.propTypes = {
  data: PropTypes.array.isRequired
};

export default Grafico;
