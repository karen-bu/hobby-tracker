import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../2_Components/useUser";
import { getTotalHours } from "../lib";

export function Metrics() {
  const { user } = useUser()
  const [hours, setHours] = useState<Number>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  useEffect(() => {
    async function totalHours() {
      try {
        const totalHours = await getTotalHours()
        console.log(totalHours)
        // setHours(totalHours)
      }
      catch (err) {
        console.error(err)
      }
    }
    totalHours()
  }, [hours])

  return (
    <div className="content-page metrics">
      <div>
        <div className='metrics row-100'>
          <h3>This week, you have spent</h3>
        </div>
        <div className='metrics row-100'>
          <h1></h1>
        </div>
        <div className='metrics row-100'>
          <h3>enjoying your hobbies!</h3>
        </div>
      </div>
    </div>
  );
}
