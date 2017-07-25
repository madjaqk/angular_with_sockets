const express = require("express")
const path = require("path")

const app = express()

const PORT = 8000

app.use(express.static(path.join(__dirname, "./client/dist")))

const server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})

const io = require("socket.io").listen(server)

let clicks = 0

io.on("connection", (socket) => {
	console.log("New connection", socket.id)

	socket.emit("click_count", clicks)

	socket.on("button_click", ()=> {
		clicks++
		io.emit("click_count", clicks)
	})

	socket.on("message", msg => {
		io.emit("new_message", msg)
	})

	socket.on("annoy", () => {
		socket.broadcast.emit("annoying")
	})

	socket.on("disconnect", () => {
		console.log("Disconnect", socket.id)
	})
})