import { useState ,useEffect} from 'preact/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './app.css'

export function App() {
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [planner, setPlanner] = useState([]);




  
  useEffect(() => {
    /**
     * 1. Check if the data is present in local storage
     * 2. If present use the data and render it on screen
     */
    const plannerData = localStorage.getItem("plannerData");
    
    if (plannerData) {
        // console.log("plannerData available");
        setPlanner(JSON.parse(plannerData));
    }
  }, []); // Mounting phase

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!subject || !hours) {
      alert("Please fill out the fields.");
      return;
  }
  else if(hours<=0){
    alert("Hour should be more than 0");
    return;

  }

    const obj = {
      subject: subject,
      hours: hours, 
    };
    const plannerArray = [...planner, obj];
    setPlanner(plannerArray);
    localStorage.setItem("plannerData", JSON.stringify(plannerArray));
    setSubject("");
    setHours("");
  };

  const handleToggleCompletion = (index) => {
    const plannerCopy = [...planner];
    plannerCopy[index].completed = !plannerCopy[index].completed; // Toggle completed
    setPlanner(plannerCopy);
    localStorage.setItem("plannerData", JSON.stringify(plannerCopy)); // Update localStorage
};

  const handlePlusBtn = (index) => {
    const plannerCopy = [...planner];
    const updatedObj = {
      ...plannerCopy[index],
      hours: parseInt(plannerCopy[index].hours) + 1, // Add 1 to existing hours key at a prticular index
    };
    plannerCopy.splice(index, 1, updatedObj);
    setPlanner(plannerCopy);
  };

  const handleMinusBtn = (index) => {
    const plannerCopy = [...planner];
    const currentHours = parseInt(plannerCopy[index].hours);
    if (currentHours > 0) {
        const updatedObj = {
            ...plannerCopy[index],
            hours: currentHours - 1, // Subtract 1 from existing hours
        };
        plannerCopy.splice(index, 1, updatedObj);
        setPlanner(plannerCopy);
        localStorage.setItem("plannerData", JSON.stringify(plannerCopy)); // Update localStorage
    }
};

const handleDeleteBtn = (index) => {
  const plannerCopy = [...planner];
  plannerCopy.splice(index, 1); // Remove the item at the specified index
  setPlanner(plannerCopy);
  localStorage.setItem("plannerData", JSON.stringify(plannerCopy)); // Update localStorage
};


const handleNoteChange = (index, newNote) => {
  const plannerCopy = [...planner];
  plannerCopy[index].note = newNote; // Update the note for the specific subject
  setPlanner(plannerCopy);
  localStorage.setItem("plannerData", JSON.stringify(plannerCopy));
};

const [openNotes, setOpenNotes] = useState(Array(planner.length).fill(false)); // Array to track open notes

const toggleAccordion = (index) => 
  {
  const updatedOpenNotes = [...openNotes];
  updatedOpenNotes[index] = !updatedOpenNotes[index]; // Toggle the specific index
  setOpenNotes(updatedOpenNotes);
};


return(
  <div className="container">
      <h1>Edu Planner</h1>
      <form>
        <input
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          type="text"
          placeholder="subject"
          value={subject}
          required
        />
        <input
          onChange={(e) => {
            setHours(e.target.value);
          }}
          value={hours}
          type="number"
          step={1}
          placeholder="hours"
          required
        />
        <button onClick={handleAddClick}>Add</button>
      </form>
      {planner.map((data, index) => {
        return (
          <div key={`card_${index}`}>
               <input
                            type="checkbox"
                            checked={data.completed}
                            onChange={() => handleToggleCompletion(index)}
                        />
                         <span style={{ textDecoration: data.completed ? 'line-through' : 'none' }}></span>
            {data.subject} - {data.hours} hours
            <button
              onClick={() => {
                handlePlusBtn(index);
              }}
            >
              +
            </button>
            <button onClick={()=>{
              handleMinusBtn(index)
            }}>-</button>
       <button onClick={() => handleDeleteBtn(index)}>
       <FontAwesomeIcon icon={faTrash} style={{ color: 'black', cursor: 'pointer' }} />
          </button>
         
          <button onClick={() => toggleAccordion(index)}>
                        {openNotes[index] ? 'save' : 'Note'}
                    </button>
                    {openNotes[index] && (
                        <div className="dataShow" >
                            <textarea
                                value={data.note}
                                onChange={(e) => handleNoteChange(index, e.target.value)}
                                placeholder="Enter your note here"
                                // rows="2"
                                cols={3}
                                style={{ width: '90%' }}
                            />
                            
                        </div>
                    )}
          </div>
        );
      })}
     </div>
);
};
