import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";

import { useUser } from "../2_Components/useUser";
import { getEntryByWeek, getEntry2Weeks, getEntry3Weeks, getEntry4Weeks, getTotalHours, Entry } from "../lib";
import dayjs from "dayjs";

import { BarChart, PieChart, LineChart } from '@mui/x-charts'

export function Metrics() {

  // ~*~*~*~*~~*~**~*~ USER MANAGEMENT ~*~*~*~*~~*~**~*~
  const { user } = useUser()
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

  const hobbyNames = weeklyEntries.map((entry) => entry.hobbyName)
  const barXAxis = [
    {
      data: hobbyNames,
    }
  ]

  const hobbyHours = weeklyEntries.map((entry) => entry.hoursSpent)
  const barSeries = [
    {
      data: hobbyHours,
      colorGetter: (data) => chartColors[data.dataIndex],
    }
  ]

  // ~*~*~*~*~~*~**~*~ PIECHART ~*~*~*~*~~*~**~*~
  const pieData = weeklyEntries.map((entry, index) =>
    ({ label: entry.hobbyName, value: entry.hoursSpent, color: chartColors[index] }))

  const pieSettings = {
    // margin: { right: 5 },
    width: 300,
    height: 300,
    hideLegend: true,
  };

  // ~*~*~*~*~~*~**~*~ LINECHART ~*~*~*~*~~*~**~*~
  const [entry2Weeks, setEntry2Weeks] = useState<Entry[]>([])
  const [entry3Weeks, setEntry3Weeks] = useState<Entry[]>([])
  const [entry4Weeks, setEntry4Weeks] = useState<Entry[]>([])

  useEffect(() => {
    async function fetchEntries4Weeks() {
      try {
        const entryList4Weeks = await getEntry4Weeks(date)
        setEntry4Weeks(entryList4Weeks)

      }
      catch (err) {
        console.error(err)
      }
    }
    fetchEntries4Weeks()
  }, [date])

  useEffect(() => {
    async function fetchEntries3Weeks() {
      try {
        const entryList3Weeks = await getEntry3Weeks(date)
        setEntry3Weeks(entryList3Weeks)

      }
      catch (err) {
        console.error(err)
      }
    }
    fetchEntries3Weeks()
  }, [date])

  useEffect(() => {
    async function fetchEntries2Weeks() {
      try {
        const entryList2Weeks = await getEntry2Weeks(date)
        setEntry2Weeks(entryList2Weeks)

      }
      catch (err) {
        console.error(err)
      }
    }
    fetchEntries2Weeks()
  }, [date])

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

  const entryThisWeekReduced = Object.values(
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


  console.log('entry4WeeksReduced: ', entry4WeeksReduced)
  console.log('entry3WeeksReduced: ', entry3WeeksReduced)
  console.log('entry2WeeksReduced: ', entry2WeeksReduced)
  console.log('entryThisWeekReduced: ', entryThisWeekReduced)

  const allEntriesMonth = [...entry4WeeksReduced, ...entry3WeeksReduced, ...entry2WeeksReduced, ...entryThisWeekReduced]

  const entryWeeksCombined = Object.values(
    allEntriesMonth.reduce((acc: any, { label, data }) => {
      if (!acc[label]) {
        acc[label] = { label, data: [data] }
      } else {
        acc[label].data.push(data)
      }
      return acc
    }, {}
    )
  )
  console.log('allEntriesMonth: ', allEntriesMonth)
  console.log('entryWeeksCombined: ', entryWeeksCombined)

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
                data: ['-4w', '-3w', '-2w', 'today'], scaleType: 'point'
              }]}
              yAxis={[{ width: 5 }]}
              series={lineSeries}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
