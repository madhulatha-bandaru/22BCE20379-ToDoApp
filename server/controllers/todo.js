const Todo = require('../models/todo')

exports.getAllTodos = async (req, res) => {
    try {
        const allTodos = await Todo.find()
        return res.status(200).send(allTodos)
    } catch (error) {
        console.log('Error:', error.message)
        return res.status(400).send({ message: 'Failed to fetch all todos' })
    }
}

exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body
        const newTodo = await Todo.create({ title, description, done: false })
        return res.status(201).send({ newTodo })
    } catch (error) {
        console.log('Error:', error.message)
        return res.status(400).send({ message: 'Failed to create new todo' })
    }
}

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        return res.status(200).send(updatedTodo)
    } catch (error) {
        console.log('Error:', error.message)
        return res.status(400).send({ message: 'Failed to update todo' })
    }
}

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params
        const deletedTodo = await Todo.findByIdAndDelete(id)
        return res.status(200).send(deletedTodo)
    } catch (error) {
        console.log('Error:', error.message)
        return res.status(400).send({ message: 'Failed to delete todo' })
    }
}