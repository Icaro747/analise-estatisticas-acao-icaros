// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from "nivo/pie";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function MyResponsivePie({ data /* see data tab */ }) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      sortByValue
      innerRadius={0.25}
      padAngle={2}
      cornerRadius={10}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "purple_blue" }}
      borderWidth={3}
      borderColor={{
        from: "color",
        modifiers: [["darker", "2"]]
      }}
      arcLinkLabelsTextOffset={9}
      arcLinkLabelsTextColor={{ theme: "labels.text.fill" }}
      arcLinkLabelsDiagonalLength={20}
      arcLinkLabelsStraightLength={20}
      arcLinkLabelsThickness={3}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      arcLabel="value"
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", "3"]]
      }}
      legends={[]}
    />
  );
}

export default MyResponsivePie;
