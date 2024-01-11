export default function WeekDays({ data, my }) {
  const weekDays = [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ];

  if (my) {
    weekDays.forEach((jour) => {
      data[jour] = JSON.parse(data[jour]);
    });
  }

  const renderDayData = (day, data) => {
    const dayData = data[day];

    return (
      <>
        {dayData.length === 0 ? (
          <div className="relative top-[20px] flex h-5/6 w-full flex-col items-center justify-center rounded-2xl border-2 border-white bg-[#ADD791]"></div>
        ) : dayData.length === 2 ? (
          <div
            style={{ height: `${(dayData[1] - dayData[0]) * 20}px` }}
            className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
          >
            {dayData.map((h, index) => (
              <div key={index}>{h === 25 ? '01' : h === 26 ? '02' : h}</div>
            ))}
          </div>
        ) : dayData.length === 4 ? (
          <>
            <div
              style={{
                marginBottom: `20px`,
                height: `${(dayData[1] - dayData[0]) * 20}px`,
              }}
              className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
            >
              <p>{dayData[0]}</p>
              <p>
                {dayData[1] === 25
                  ? '01'
                  : dayData[1] === 26
                  ? '02'
                  : dayData[1]}
              </p>
            </div>
            <div
              style={{ height: `${(dayData[3] - dayData[2]) * 20}px` }}
              className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
            >
              <p>{dayData[2]}</p>
              <p>
                {dayData[3] === 25
                  ? '01'
                  : dayData[3] === 26
                  ? '02'
                  : dayData[3]}
              </p>
            </div>
          </>
        ) : null}
      </>
    );
  };

  return (
    <>
      {my ? (
        <div className="mb-[5px] mt-[40px] text-2xl font-bold text-[#5DAF24]">
          {data.semaine}
        </div>
      ) : null}
      <div className="relative my-5 flex h-[500px] w-full items-start justify-around rounded-2xl  border-[3px] border-[#5DAF24] bg-[#ADD791] py-5 text-sm font-bold text-white shadow-md shadow-[#ADD791]">
        {weekDays.map((day, index) => (
          <div key={index} className="h-full w-1/12">
            <div
              style={{ marginBottom: `${(data[day][0] - 7) * 20 + 20}px` }}
              className={`flex h-[20px] items-center justify-center lg:text-lg`}
            >
              {day.substring(0, 3)}.
            </div>
            {renderDayData(day, data)}
          </div>
        ))}
      </div>
    </>
  );
}
