import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Subject"
import { Observable } from "rxjs/Observable"

import * as io from "socket.io-client"

import { Message } from "./message"

@Injectable()
export class ChatService {
  private url = "http://localhost:8000"
  private socket

  constructor() {
    this.socket = io(this.url) 
  }

  button_click(){
    this.socket.emit("button_click")
  }

  send_message(message: Message){
    this.socket.emit("message", message)
  }

  annoy(){
    this.socket.emit("annoy")
  }

  update_clicks(){
    let observable = new Observable(observer => {
      this.socket.on("click_count", data => observer.next(data))
    })

    return observable
  }

  new_message(){
    console.log("new_message service function")
    let observable =  new Observable(observer => {
      this.socket.on("new_message", (data: Message) => {
        observer.next(data)
      })
    })

    return observable
  }

  annoying(){
    let observable = new Observable(observer => {
      this.socket.on("annoying", () => observer.next())
    })

    return observable
  }

  disconnect(){
    this.socket.disconnect()
  }

}
