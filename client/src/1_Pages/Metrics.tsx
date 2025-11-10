import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../2_Components/useUser";
import { getEntryByWeek, getTotalHours, Entry } from "../lib";

import { BarChart, PieChart } from '@mui/x-charts'

export function Metrics() {
  const { user, date } = useUser()
  const [hours, setHours] = useState<Number>()
  const navigate = useNavigate()


  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  // ~*~*~*~*~~*~**~*~ GETTING HOURS ~*~*~*~*~~*~**~*~

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

  console.log('weeklyEntries:', weeklyEntries)

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

  // ~*~*~*~*~~*~**~*~ PIECHART ~*~*~*~*~~*~**~*~
  const pieData = weeklyEntries.map((entry, index) =>
    ({ label: entry.hobbyName, value: entry.hoursSpent, color: chartColors[index] }))

  const pieSettings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
  };

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



  return (
    <div className="content-page metrics">
      <div>
        <div className='metrics row-100'>
          <h3>This week, you have spent</h3>
        </div>
        <div className='metrics row-100'>
          <h1>{hours?.toString()} HOURS</h1>
        </div>
        <div className='metrics row-100'>
          <h3>enjoying your hobbies!</h3>
        </div>
        <div className='metrics row-100'>
          <h2>Time Breakdown</h2>
        </div>
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
                { innerRadius: 50, outerRadius: 100, data: pieData, arcLabel: 'value' }
              ]}
              sx={{ fontFamily: 'Barlow' }}
              {...pieSettings}
            />
          </div>
          <div className='metrics graph'>
            <h3>
              This Week
            </h3>
            <PieChart
              series={[{ innerRadius: 50, outerRadius: 100, data: pieData, arcLabel: 'value' }]}
              {...pieSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
