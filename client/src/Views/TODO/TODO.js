import { useEffect, useState } from 'react'
import Styles from './TODO.module.css'
import { dummy } from './dummy'
import axios from 'axios'

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [todoData, setTodoData] = useState(dummy)
    const [loading, setLoading] = useState(true)
    const [editingTodoId, setEditingTodoId] = useState(null)

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo()
            setTodoData(apiData)
            setLoading(false)
        }
        fetchTodo()
    }, [])

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
        }
        try {
            const response = await axios.request(options)
            return response.data
        } catch (err) {
            console.log(err)
            return [] // return an empty array in case of error
        }
    }

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description: newDescription,
            },
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData((prevData) => [...prevData, response.data.newTodo])
                setNewTodo('')
                setNewDescription('')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData((prevData) => prevData.filter((todo) => todo._id !== id))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find((todo) => todo._id === id)
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done,
            },
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData((prevData) =>
                    prevData.map((todo) => (todo._id === id ? response.data : todo))
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const editTodo = (id) => {
        setEditingTodoId(id)
    }

    const saveTodoEdit = (id) => {
        const todoToUpdate = todoData.find((todo) => todo._id === id)
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                title: newTodo,
                description: newDescription,
            },
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData((prevData) =>
                    prevData.map((todo) => (todo._id === id ? response.data : todo))
                )
                setEditingTodoId(null)
                setNewTodo('')
                setNewDescription('')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type="text"
                        name="New Todo"
                        placeholder="Task Header "
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value)
                        }}
                    />
                    
                    <input
                        className={Styles.todoInput}
                        type="text"
                        name="New Description"
                        placeholder="Task Description"
                        value={newDescription}
                        onChange={(event) => {
                            setNewDescription(event.target.value)
                        }}
                    />
                    <button
                        id="addButton"
                        name="add"
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo()
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id="todoContainer" className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} className={Styles.todo}>
                                <span className={Styles.infoContainer}>
                                    <input
                                        type="checkbox"
                                        checked={entry.done}
                                        onChange={() => {
                                            updateTodo(entry._id)
                                        }}
                                    />
                                    {editingTodoId === entry._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newTodo}
                                                onChange={(event) => {
                                                    setNewTodo(event.target.value)
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={newDescription}
                                                onChange={(event) => {
                                                    setNewDescription(event.target.value)
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    saveTodoEdit(entry._id)
                                                }}
                                            >
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {entry.title} - {entry.description}
                                            <button
                                                onClick={() => {
                                                    editTodo(entry._id)
                                                    setNewTodo(entry.title)
                                                    setNewDescription(entry.description)
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </span>
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        deleteTodo(entry._id)
                                    }}
                                >
                                    Delete
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    )
}