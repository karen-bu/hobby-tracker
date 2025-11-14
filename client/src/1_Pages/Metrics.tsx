import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../2_Components/useUser";
import { getEntryByWeek, getEntry1Week, getEntry2Weeks, getEntry3Weeks, getEntry4Weeks, getTotalHours, Entry } from "../lib";

import { BarChart, PieChart, LineChart } from '@mui/x-charts'

export function Metrics() {

  // ~*~*~*~*~~*~**~*~ USER MANAGEMENT ~*~*~*~*~~*~**~*~
  const { user, hobbyArray } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  // ~*~*~*~*~~*~**~*~ GETTING HOURS ~*~*~*~*~~*~**~*~
  const [hours, setHours] = useState<Number>()

  useEffect(() => {
    async function totalHours() {
      try {
        const totalHours = await getTotalHours(date)
        setHours(totalHours.sum)
      }
      catch (err) {
        console.error(err)
      }
    }
    totalHours()
  }, [hours])

  // ~*~*~*~*~~*~**~*~ CHARTS ~*~*~*~*~~*~**~*~
  const { date } = useUser()
  const [weeklyEntries, setWeeklyEntries] = useState<Entry[]>([])


  useEffect(() => {
    async function fetchWeeklyEntries() {
      try {
        const currentWeekEntries = await getEntryByWeek(date)
        setWeeklyEntries(currentWeekEntries)
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchWeeklyEntries()
  }, [date])

  const chartColors =
    ['#D4EA87',
      '#ACE081',
      '#8FD481',
      '#6BC188',
      '#49AD8F',
      '#2E969A',
      '#177FA3',
      '#196A95',
      '#1C5586',
      '#17456C']

  // ~*~*~*~*~~*~**~*~ BAR CHART ~*~*~*~*~~*~**~*~
  const barSettings = {
    yAxis: [
      {
        label: 'hours',
        width: 50,
      }
    ],
    height: 300,
  }

  const barDataX = Object.values(
    weeklyEntries.reduce((acc: any, { hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = hobbyName
      }
      return acc
    }, {}
    )
  )

  const weeklyEntriesReduced = Object.values(
    weeklyEntries.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { data: hoursSpent, label: hobbyName }
      } else {
        acc[hobbyName].data += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const barDataY = weeklyEntriesReduced.map((obj: any) => obj.data)


  const barXAxis = [
    {
      data: barDataX,
    }
  ]

  const barSeries = [
    {
      data: barDataY,
      colorGetter: (data) => chartColors[data.dataIndex],
    }
  ]


  // ~*~*~*~*~~*~**~*~ PIECHART ~*~*~*~*~~*~**~*~
  const pieData = Object.values(
    weeklyEntries.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { label: hobbyName, value: hoursSpent }
      } else {
        acc[hobbyName].value += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const pieSettings = {
    // margin: { right: 5 },
    width: 300,
    height: 300,
    hideLegend: true,
  };

  // ~*~*~*~*~~*~**~*~ LINECHART ~*~*~*~*~~*~**~*~
  const [entry1Week, setEntry1Week] = useState<Entry[]>([])
  const [entry2Weeks, setEntry2Weeks] = useState<Entry[]>([])
  const [entry3Weeks, setEntry3Weeks] = useState<Entry[]>([])
  const [entry4Weeks, setEntry4Weeks] = useState<Entry[]>([])

  useEffect(() => {
    async function fetchEntries() {
      try {
        const [entryList4Weeks, entryList3Weeks, entryList2Weeks, entryList1Week] = await Promise.all([
          getEntry4Weeks(date),
          getEntry3Weeks(date),
          getEntry2Weeks(date),
          getEntry1Week(date),
        ]);
        setEntry4Weeks(entryList4Weeks);
        setEntry3Weeks(entryList3Weeks);
        setEntry2Weeks(entryList2Weeks);
        setEntry1Week(entryList1Week);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEntries();
  }, [date]);

  const entry4WeeksReduced = Object.values(
    entry4Weeks.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { data: hoursSpent, label: hobbyName }
      } else {
        acc[hobbyName].data += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const entry3WeeksReduced = Object.values(
    entry3Weeks.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { data: hoursSpent, label: hobbyName }
      } else {
        acc[hobbyName].data += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const entry2WeeksReduced = Object.values(
    entry2Weeks.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { data: hoursSpent, label: hobbyName }
      } else {
        acc[hobbyName].data += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const entry1WeekReduced = Object.values(
    entry1Week.reduce((acc: any, { hoursSpent, hobbyName }) => {
      if (!acc[hobbyName]) {
        acc[hobbyName] = { data: hoursSpent, label: hobbyName }
      } else {
        acc[hobbyName].data += hoursSpent
      }
      return acc
    }, {}
    )
  )

  const allEntriesMonth = [entry4WeeksReduced, entry3WeeksReduced, entry2WeeksReduced, entry1WeekReduced]
  const allHobbyNames = [...new Set(allEntriesMonth.flat().map((obj) => obj.label))]

  const entryWeeksCombined = allHobbyNames.map(hobbyName => {
    const data = allEntriesMonth.map(week => {
      const found = week.find((obj: any) => obj.label === hobbyName);
      return found ? found.data : 0;
    });
    return { label: hobbyName, data };
  });

  const lineSeries = [
    ...entryWeeksCombined
  ]

  return (
    <div className="content-page metrics">
      <div className="metrics-wrapper">
        <h3>This week, you have spent</h3>
        <h1>{hours?.toString()} HOURS</h1>
        <h3>enjoying your hobbies!</h3>
        <div className='metrics row-100'>
          <h2>Time Breakdown</h2>
        </div>
        <h3>
          Hours This Week
        </h3>
        <div>
          <BarChart
            {...barSettings}
            xAxis={barXAxis}
            series={barSeries}
          />
        </div>

        <div className='metrics graph-wrapper'>
          <div className='metrics graph'>
            <h3>
              Hours This Week
            </h3>
            <PieChart
              series={[
                { innerRadius: 70, outerRadius: 150, data: pieData, arcLabel: 'value' }
              ]}
              colors={chartColors}
              sx={{ fontFamily: 'Barlow' }}
              {...pieSettings}
            />
          </div>
          <div className='metrics graph'>
            <h3>
              Hours This Past Month
            </h3>
            <LineChart
              xAxis={[{
                data: ['-4w', '-3w', '-2w', '-1w'], scaleType: 'point'
              }]}
              yAxis={[{ width: 5 }]}
              series={lineSeries}
              height={300}
              colors={chartColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
