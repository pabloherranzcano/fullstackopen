import StatisticsLine from "./StatisticsLine";

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positivePercentage =
    total === 0 ? 0 : ((good / total) * 100).toFixed(1);

  return (
    <>
      <h1>statistics</h1>
      {total === 0 ? (
        <div>No feedback given</div>
      ) : (
        <table>
          <tbody>
            <StatisticsLine text="Good" value={good} />
            <StatisticsLine text="Neutral" value={neutral} />
            <StatisticsLine text="Bad" value={bad} />
            <StatisticsLine text="All" value={total} />
            <StatisticsLine text="Average" value={average} />
            <StatisticsLine text="Positive" value={`${positivePercentage} %`} />
          </tbody>
        </table>
      )}
    </>
  );
}

export default Statistics;
