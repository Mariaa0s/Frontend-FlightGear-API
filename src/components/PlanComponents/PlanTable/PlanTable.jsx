import React, {useState, useEffect} from "react";
import PlanItem from "../PlanItem/PlanItem";
import plus from '../../../assets/img/Union.png'
import styles from './PlanTable.module.css';


const MainApp = () => {
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    fetchPlanData();
  }, []);

  const getData = (form) => {
    const dataForm = new FormData(form);
    const data = {};
    for (let [name, value] of dataForm){
      data[name] = value;
    }
    console.log(data);
    return data;
  }
  const clearForm = () => {
    const form = document.getElementById('form');

    form.querySelector('input[name=heading]').value = '';
    form.querySelector('input[name=speed]').value = '';
    form.querySelector('input[name=altitude]').value = '';
  }

  const handlerAddPlan = async (formData) => {
    if (!formData.heading || !formData.speed || !formData.altitude) { return; }

    // Construct new plan item
    const newPlan = { id: plan.length, ...formData };

    // Update the state and log the plan items
    setPlan((prevPlan) => {
      const updatedPlan = [...prevPlan, newPlan];
      logPlanItemData(updatedPlan); // Log the updated plan items
      return updatedPlan;
    });
    try {
      // Asynchronously send new plan to server
      const response = await sendDataToServer(newPlan);
      // Here you might want to do something with the response
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('There was an error sending the data to the server:', error);
    }
    clearForm();
  };

  const logPlanItemData = (updatedPlan) => {
    console.log(updatedPlan);
  };
  const sendDataToServer = async (data) => {
    const serverUrl = "https://localhost:7110/api/launch/stages";
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    //clearForm();
    return response.json();
  };

  const fetchPlanData = async () => {
    try {
      const serverUrl = "https://localhost:7110/api/launch/stages";
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlan(data); // Обновляем состояние плана данными с сервера
    } catch (error) {
      console.error('There was an error fetching the data:', error);
    }
  };
  const onRemoveData = async () => {
    await fetchPlanData();
  }
  return (
    <>
      <header>
      <h1 className={styles.title}>Make Your Flight Simulation</h1>
        <form className={styles.add_stage} id="form" method='POST' enctype="application/json"> 
          <div className={styles.add_stage_element_1}>
            <p className="course-label">Course:</p>
            <input type="text" className={styles.course} name="heading" required/>
          </div>
          <div className={styles.add_stage_element}>
            <p className={styles.speed_label}>Indicated Air Speed (m/s):</p>
            <input type="number" className={styles.speed} step="0.01" name="speed" required/>
          </div>
          <div className={styles.add_stage_element}>
            <p className={styles.altitude_label}>True Altitude:</p>
            <input type="number" className={styles.altitude} name="altitude" required/>
          </div>
          <div className={styles.add_stage_element_4}>
            <button onClick={e => {e.preventDefault(); const formData = getData(document.getElementById('form')); handlerAddPlan(formData);}} type="submit" className={styles.plus}><img src={plus} alt="Union"/></button>
          </div>
        </form>
    </header>
    <main className={styles.main_info}>
      <iframe className={styles.map} src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d69934.32592146858!2d60.723338649999995!3d56.78678595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1700587609013!5m2!1sru!2sru" width="623" height="604" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div>
        <table>
          <thead>
            <div className={styles.table_head}>
              <h2>Flight Plan Stages</h2>
              <div className={styles.table_head_info}>
                <tr className={styles.table_element}>
                  <th className={styles.table_element_info_1}>#</th>
                  <th className={styles.table_element_info_2}>Course</th>
                  <th className={styles.table_element_info_3}>Indicated Air Speed</th>
                  <th className={styles.table_element_info_4}>TrueAltitude</th>
                </tr>
              </div>
            </div>
          </thead>
          <tbody>
            <div className={styles.scroll}>
            {plan && plan.map((element, index) =>
              <PlanItem
                index={index}
                heading={element.heading}
                speed={element.speed}
                altitude={element.altitude}
                onRemoveData={onRemoveData}
              />
            )} 
            </div>
          </tbody>
        </table>
      </div>
    </main>     
    </>
  ) 
}

export default MainApp;