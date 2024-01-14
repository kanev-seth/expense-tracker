import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [name,setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions,setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions(){
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
  
    // Validate required fields
    if (!name.trim() || !datetime || !description.trim()) {
      console.error('Please fill in all required fields.');
      return;
    }
  
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];
  
    fetch(url, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add new transaction');
        }
        return response.json();
      })
      .then(json => {
        // Update the transactions state with the new transaction at the beginning
        setTransactions(prevTransactions => [json, ...prevTransactions]);
  
        // Clear input fields
        setName('');
        setDatetime('');
        setDescription('');
  
        console.log('New transaction added successfully:', json);
      })
      .catch(error => {
        console.error('Error adding new transaction:', error.message);
      });
  }
  
  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];


  return (
    <main>
      <h1>₹{balance}<span>.{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basics'>
          <input type="text" 
          value={name}
          onChange={ev => setName(ev.target.value)}
          placeholder='-250 for Kathi kababs'></input>
          <input value={datetime} 
          onChange={ev => setDatetime(ev.target.value)}
          type="datetime-local"></input>
        </div>
        <div className="description">
          <input type="text"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          placeholder='Description'></input>
        </div>
        <button type="submit">Add new Transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            <div className={"price " +(transaction.price<0?'red':'green')}>
              {transaction.price}
              </div>
            <div className="datetime">{new Date(transaction.datetime).toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'medium' })}</div>
          </div>
        </div>
        ))}
      </div>
    </main>
  );
}

export default App;
