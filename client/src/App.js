import React from "react";
import io from "socket.io-client";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: {},
    };
  }

  // connect with server when component is ready
  componentDidMount() {
    // init socket
    this.socket = io.connect(
      process.env.NODE_ENV === "production" ? process.env.PORT : "http://localhost:8000"
    );
    // this.socket = socket available in all methods of our component
    this.socket.on('addTask', newTask => {
      this.addTask(newTask);
    });
    this.socket.on('removeTask', (index, task) => {
      this.removeTask(index, task);
    });
    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });
  }

  updateData(tasks) {
    this.setState({ tasks: tasks });
  }

  removeTask(id) {
    const { tasks } = this.state;

    // delete element which index is equal to id
    tasks.forEach((task, index) => {
      if(task.id === id) {
        tasks.splice(index, 1);
      }
    });
    // update state
    this.setState({ tasks: tasks });

    // emit to server what has been removed locally
    this.socket.emit('removeTask', id);
  }
  
  submitForm(event) {
    event.preventDefault();
    const { taskName } = this.state;

    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  }

  addTask(newTask) {
    const { tasks } = this.state;

    if (!tasks.find(task => task.id === newTask.id)) {
      tasks.push(newTask);
      this.setState(tasks);
      this.socket.emit('addTask', newTask);
    }
  }

  render() {
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2> 
          <ul className="tasks-section__list">
            {this.state.tasks.map(({name, id}) => {
              return (
                  <li key={id} className='task'>{name} 
                    <button onClick={() => this.removeTask(id)} className="btn btn--red">Remove</button>
                  </li>
                );
            })}
          </ul>
          <form id='add-task-form' onSubmit={this.submitForm}>
            <input
              className='text-input' 
              autoComplete="off" 
              type="text" 
              placeholder="Enter new task" 
              value={this.state.taskName.name}
              onChange={this.changeValue}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;